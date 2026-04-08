"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DbUser {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  isSeller: boolean;
  isVerified: boolean;
  isPlus: boolean;
  sellerLevel: string;
  balance: number;
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDbUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user);
      if (user) {
        fetchDbUser();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchDbUser();
      } else {
        setDbUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchDbUser]);

  return { authUser, user: dbUser, loading };
}
