import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("[API] Supabase code exchange error:", error.message);
        return NextResponse.redirect(new URL("/login?error=auth", origin));
      }

      // Get the authenticated user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Check if user already exists in our DB
        const existingUser = await prisma.user.findUnique({
          where: { supabaseId: authUser.id },
        });

        if (!existingUser) {
          // New user from Google OAuth - create DB profile
          const email = authUser.email || "";
          const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");

          // Ensure unique username
          let username = emailPrefix.slice(0, 50);
          const existingUsername = await prisma.user.findUnique({
            where: { username },
          });
          if (existingUsername) {
            username = `${username.slice(0, 44)}_${Date.now().toString(36).slice(-5)}`;
          }

          // Check if email already exists (user registered with email/password before)
          const existingEmail = await prisma.user.findUnique({
            where: { email },
          });

          if (existingEmail) {
            // Link the supabase ID to the existing account
            await prisma.user.update({
              where: { email },
              data: { supabaseId: authUser.id },
            });
          } else {
            await prisma.user.create({
              data: {
                username,
                email,
                supabaseId: authUser.id,
                passwordHash: "oauth-google",
                emailVerified: true,
                emailVerifiedAt: new Date(),
              },
            });
          }
        }
      }

      return NextResponse.redirect(new URL(redirectTo, origin));
    } catch (error) {
      console.error("[API] GET /api/auth/callback error:", error);
    }
  }

  // If code exchange fails or no code, redirect to home
  return NextResponse.redirect(new URL("/", origin));
}
