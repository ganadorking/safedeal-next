import { NextResponse } from "next/server";
import { getUserLight } from "@/lib/auth-helpers";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

export async function POST() {
  try {
    const user = await getUserLight();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({ strategy: "totp", secret, issuer: "SafeDeal", label: user.email });
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    return NextResponse.json({ secret, qrCodeUrl, otpauthUrl });
  } catch (error) {
    console.error("[API] 2fa/setup error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
