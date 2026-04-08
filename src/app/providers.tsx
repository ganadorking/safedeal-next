"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

/* ========== AUTH CONTEXT ========== */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/* ========== CURRENCY CONTEXT ========== */
interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  symbol: "$",
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

const SYMBOLS: Record<string, string> = {
  USD: "$",
  MXN: "$",
  EUR: "\u20ac",
  COP: "$",
  ARS: "$",
  BRL: "R$",
};

/* ========== PROVIDERS ========== */
export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const { data: { user: u } } = await supabase.auth.getUser();
        if (!cancelled) {
          setUser(u ?? null);
          setLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!cancelled) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        });

        return () => {
          cancelled = true;
          subscription.unsubscribe();
        };
      } catch (err) {
        console.warn("Auth init failed:", err);
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const cleanup = initAuth();
    return () => {
      cancelled = true;
      cleanup?.then((fn) => fn?.());
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      <CurrencyContext.Provider
        value={{ currency, setCurrency, symbol: SYMBOLS[currency] || "$" }}
      >
        {children}
      </CurrencyContext.Provider>
    </AuthContext.Provider>
  );
}
