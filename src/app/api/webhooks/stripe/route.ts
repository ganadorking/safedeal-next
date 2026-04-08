import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import {
  sendPurchaseConfirmation,
  sendSaleNotification,
} from '@/lib/email';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`[Stripe Webhook] Error handling ${event.type}:`, error);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── checkout.session.completed (legacy Checkout flow) ─────────────────
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.error('[Stripe Webhook] No orderId in session metadata');
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    include: {
      buyer: { select: { id: true, email: true, username: true } },
      seller: { select: { id: true, email: true, username: true } },
      items: {
        include: {
          product: { select: { id: true, title: true, price: true, stock: true, salesCount: true } },
        },
      },
    },
  });

  if (!order) {
    console.error(`[Stripe Webhook] Order ${orderId} not found`);
    return;
  }

  if (order.status === 'paid') {
    console.log(`[Stripe Webhook] Order ${orderId} already paid, skipping`);
    return;
  }

  // Update order to paid
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      paidAt: new Date(),
      paymentId: session.payment_intent as string,
    },
  });

  // Update product stock and sales count
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: { decrement: item.quantity },
        salesCount: { increment: item.quantity },
      },
    });
  }

  // Clear buyer cart
  await prisma.cartItem.deleteMany({
    where: { userId: order.buyerId },
  });

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: order.buyerId,
      type: 'purchase',
      title: 'Compra confirmada',
      message: `Tu orden ${order.orderNumber} ha sido pagada exitosamente.`,
      link: `/purchases`,
    },
  });

  if (order.seller) {
    await prisma.notification.create({
      data: {
        userId: order.seller.id,
        type: 'sale',
        title: 'Nueva venta!',
        message: `Vendiste ${order.items.map((i) => i.product.title).join(', ')} por $${Number(order.total).toFixed(2)}`,
        link: `/sales`,
      },
    });
  }

  // Send emails
  const emailItems = order.items.map((item) => ({
    title: item.product.title,
    quantity: item.quantity,
    price: Number(item.price),
  }));

  await sendPurchaseConfirmation(
    order.buyer.email,
    order.orderNumber || `SD-${order.id}`,
    emailItems,
    Number(order.total)
  ).catch((err) => console.error('[Stripe Webhook] Purchase email error:', err));

  if (order.seller?.email) {
    const firstProduct = order.items[0]?.product.title || 'Producto';
    await sendSaleNotification(
      order.seller.email,
      order.seller.username,
      firstProduct,
      Number(order.total)
    ).catch((err) => console.error('[Stripe Webhook] Sale email error:', err));
  }
}

// ── payment_intent.succeeded (Elements / PaymentIntent flow) ──────────
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) {
    // Not every PaymentIntent belongs to us; ignore gracefully
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
  });

  if (!order || order.status === 'paid') {
    return;
  }

  // Mark as paid -- the confirm endpoint handles the full flow,
  // but this is a safety net in case the client never calls confirm.
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      paidAt: new Date(),
      paymentId: paymentIntent.id,
    },
  });

  console.log(`[Stripe Webhook] PaymentIntent ${paymentIntent.id} succeeded for order ${orderId}`);
}

// ── payment_intent.payment_failed ─────────────────────────────────────
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: parseInt(orderId) },
    data: {
      status: 'failed',
    },
  }).catch(() => {
    // Order might not exist
  });

  console.log(`[Stripe Webhook] PaymentIntent ${paymentIntent.id} failed for order ${orderId}`);
}
