import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserLight } from "@/lib/auth-helpers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const COMMISSION_RATE = 0.05; // 5%

export async function POST(request: NextRequest) {
  try {
    const user = await getUserLight();

    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentMethod } = body;

    if (!paymentMethod || !["stripe", "wallet", "crypto"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Metodo de pago invalido. Usa: stripe, wallet, o crypto" },
        { status: 400 }
      );
    }

    // Get cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "El carrito esta vacio" },
        { status: 400 }
      );
    }

    // Validate all products are active and in stock
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `El producto "${item.product.title}" ya no esta disponible` },
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

    // Generate order number
    const orderNumber = `SD-${Date.now().toString(36).toUpperCase()}`;

    // Determine seller (use first item's seller for the order-level sellerId)
    const sellerId = cartItems[0].product.sellerId;

    if (paymentMethod === "wallet") {
      // Check balance
      const currentBalance = Number(user.balance);
      if (currentBalance < total) {
        return NextResponse.json(
          { error: `Saldo insuficiente. Necesitas $${total.toFixed(2)} y tienes $${currentBalance.toFixed(2)}` },
          { status: 400 }
        );
      }

      // Create order, items, deduct balance, record transaction, clear cart -- all in a transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            buyerId: user.id,
            sellerId,
            subtotal,
            commission,
            total,
            paymentMethod: "wallet",
            status: "paid",
            paidAt: new Date(),
          },
        });

        // Create order items
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

        // Deduct balance
        const newBalance = currentBalance - total;
        await tx.user.update({
          where: { id: user.id },
          data: { balance: newBalance },
        });

        // Record transaction
        await tx.transaction.create({
          data: {
            userId: user.id,
            type: "purchase",
            amount: -total,
            balanceAfter: newBalance,
            description: `Compra ${orderNumber}`,
            referenceId: newOrder.id,
            referenceType: "order",
          },
        });

        // Update product stock and sales count
        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              salesCount: { increment: item.quantity },
            },
          });
        }

        // Clear cart
        await tx.cartItem.deleteMany({
          where: { userId: user.id },
        });

        return newOrder;
      });

      return NextResponse.json({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total,
          status: order.status,
          paymentMethod: "wallet",
        },
        message: "Compra realizada exitosamente",
      });
    }

    if (paymentMethod === "stripe") {
      // Create pending order first
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            buyerId: user.id,
            sellerId,
            subtotal,
            commission,
            total,
            paymentMethod: "stripe",
            status: "pending",
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

      // Create Stripe checkout session
      const lineItems: any[] = cartItems.map(
        (item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.title,
              ...(item.product.mainImage
                ? { images: [item.product.mainImage] }
                : {}),
            },
            unit_amount: Math.round(Number(item.product.price) * 100),
          },
          quantity: item.quantity,
        })
      );

      // Add commission as a separate line item
      if (commission > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Comision SafeDeal",
            },
            unit_amount: Math.round(commission * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=true`,
        metadata: {
          orderId: order.id.toString(),
          orderNumber,
          userId: user.id.toString(),
        },
      });

      return NextResponse.json({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total,
          status: "pending",
          paymentMethod: "stripe",
        },
        checkoutUrl: session.url,
      });
    }

    // crypto - create pending order, return order details for crypto payment flow
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          buyerId: user.id,
          sellerId,
          subtotal,
          commission,
          total,
          paymentMethod: "crypto",
          status: "pending",
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

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total,
        status: "pending",
        paymentMethod: "crypto",
      },
      message: "Orden creada. Completa el pago con crypto.",
    });
  } catch (error) {
    console.error("[API] POST /api/checkout error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
