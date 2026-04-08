import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserLight } from '@/lib/auth-helpers';
import {
  sendPurchaseConfirmation,
  sendSaleNotification,
} from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserLight();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentIntentId } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'orderId y paymentIntentId son requeridos' },
        { status: 400 }
      );
    }

    // Fetch order with relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: { select: { id: true, email: true, username: true } },
        seller: { select: { id: true, email: true, username: true } },
        items: {
          include: {
            product: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    if (order.buyerId !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        message: 'Orden ya fue pagada',
        order: { id: order.id, orderNumber: order.orderNumber, status: 'paid' },
      });
    }

    // Update order, stock, cart in a transaction
    await prisma.$transaction(async (tx) => {
      // Mark order as paid
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'paid',
          paidAt: new Date(),
          paymentId: paymentIntentId,
        },
      });

      // Decrement product stock & increment sales
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      // Clear buyer cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });
    });

    // Create notifications (non-blocking)
    const notifPromises: Promise<unknown>[] = [];

    notifPromises.push(
      prisma.notification.create({
        data: {
          userId: order.buyerId,
          type: 'purchase',
          title: 'Compra confirmada',
          message: `Tu orden ${order.orderNumber} ha sido pagada exitosamente.`,
          link: '/purchases',
        },
      })
    );

    if (order.seller) {
      notifPromises.push(
        prisma.notification.create({
          data: {
            userId: order.seller.id,
            type: 'sale',
            title: 'Nueva venta!',
            message: `Vendiste ${order.items.map((i) => i.product.title).join(', ')} por $${Number(order.total).toFixed(2)}`,
            link: '/sales',
          },
        })
      );
    }

    await Promise.allSettled(notifPromises);

    // Send emails (non-blocking)
    const emailItems = order.items.map((item) => ({
      title: item.product.title,
      quantity: item.quantity,
      price: Number(item.price),
    }));

    sendPurchaseConfirmation(
      order.buyer.email,
      order.orderNumber || `SD-${order.id}`,
      emailItems,
      Number(order.total)
    ).catch((err) => console.error('[Payment Confirm] Purchase email error:', err));

    if (order.seller?.email) {
      const firstProduct = order.items[0]?.product.title || 'Producto';
      sendSaleNotification(
        order.seller.email,
        order.seller.username,
        firstProduct,
        Number(order.total)
      ).catch((err) => console.error('[Payment Confirm] Sale email error:', err));
    }

    return NextResponse.json({
      message: 'Pago confirmado exitosamente',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
        status: 'paid',
      },
    });
  } catch (error) {
    console.error('[API] POST /api/payment/confirm error:', error);
    return NextResponse.json(
      { error: 'Error al confirmar el pago' },
      { status: 500 }
    );
  }
}
