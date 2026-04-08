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

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Se requiere el codigo" }, { status: 400 });
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: "2FA no esta habilitado" }, { status: 400 });
    }

    const isValid = verifySync({ token, secret: user.twoFactorSecret });
    if (!isValid) {
      return NextResponse.json({ error: "Codigo invalido" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] 2fa/disable error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
