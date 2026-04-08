import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, supabaseId } = body;

    if (!username || !email || !supabaseId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: username, email, supabaseId" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { supabaseId },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.supabaseId === supabaseId) {
        return NextResponse.json(
          { error: "Este usuario ya existe" },
          { status: 409 }
        );
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Este email ya esta registrado" },
          { status: 409 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Este nombre de usuario ya esta en uso" },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        supabaseId,
        passwordHash: "supabase-managed",
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
