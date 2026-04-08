import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getUserLight } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const COMMISSION_RATE = 0.05; // 5%

export async function POST(_request: NextRequest) {
  try {
    const user = await getUserLight();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            seller: { select: { id: true, username: true } },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito esta vacio' }, { status: 400 });
    }

    // Validate products
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `"${item.product.title}" ya no esta disponible` },
          { status: 400 }
        );
      }
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para "${item.product.title}"` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const commission = Math.round(subtotal * COMMISSION_RATE * 100) / 100;
    const total = Math.round((subtotal + commission) * 100) / 100;
    const amountInCents = Math.round(total * 100);

    // Generate order number
    const orderNumber = `SD-${Date.now().toString(36).toUpperCase()}`;
    const sellerId = cartItems[0].product.sellerId;

    // Create pending order
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          buyerId: user.id,
          sellerId,
          subtotal,
          commission,
          total,
          paymentMethod: 'stripe',
          status: 'pending',
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          sellerId: item.product.sellerId,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: Number(item.product.price) * item.quantity,
        })),
      });

      return newOrder;
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        orderId: order.id.toString(),
        orderNumber,
        userId: user.id.toString(),
      },
      description: `SafeDeal Order ${orderNumber}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber,
      total,
    });
  } catch (error) {
    console.error('[API] POST /api/payment/create-intent error:', error);
    return NextResponse.json(
      { error: 'Error al crear la intencion de pago' },
      { status: 500 }
    );
  }
}
