import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

// Get the current authenticated user with their DB profile
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  return dbUser;
}

// Get user with selected fields (lighter query)
export async function getUserLight() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      isAdmin: true,
      isSeller: true,
      isVerified: true,
      isPlus: true,
      sellerLevel: true,
      balance: true,
      twoFactorEnabled: true,
    },
  });

  return dbUser;
}

// Require authentication - throws redirect if not logged in
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
