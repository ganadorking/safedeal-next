import { NextResponse } from "next/server";
import { getUserLight } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await getUserLight();

    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[API] GET /api/me error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
