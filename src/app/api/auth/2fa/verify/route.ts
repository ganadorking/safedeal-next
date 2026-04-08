import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-helpers";
import { verifySync } from "otplib";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { secret, token } = await request.json();
    if (!secret || !token) {
      return NextResponse.json({ error: "Se requiere el secreto y el codigo" }, { status: 400 });
    }

    const isValid = verifySync({ token, secret });
    if (!isValid) {
      return NextResponse.json({ error: "Codigo invalido. Intenta de nuevo." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true, twoFactorSecret: secret },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] 2fa/verify error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
