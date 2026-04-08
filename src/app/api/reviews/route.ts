import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserLight } from "@/lib/auth-helpers";

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
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "productId y rating son requeridos" },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "El rating debe ser un numero entre 1 y 5" },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sellerId: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Check for duplicate review
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Ya has dejado una resena para este producto" },
        { status: 409 }
      );
    }

    // Create review and recalculate product rating in a transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          productId,
          userId: user.id,
          rating: Math.round(rating),
          comment: comment || null,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Recalculate product average rating using aggregation
      const aggregation = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: aggregation._avg.rating || 0,
          reviewCount: aggregation._count.rating,
        },
      });

      return newReview;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
