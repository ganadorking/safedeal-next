"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProductActionsProps {
  productId: number;
  stock: number;
}

export default function ProductActions({ productId, stock }: ProductActionsProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addingCart, setAddingCart] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleAddToCart() {
    if (!user) {
      router.push("/login");
      return;
    }

    setAddingCart(true);
    setError("");
    setCartSuccess(false);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al agregar al carrito");
        return;
      }

      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch {
      setError("Error de conexion");
    } finally {
      setAddingCart(false);
    }
  }

  async function handleToggleFavorite() {
    if (!user) {
      router.push("/login");
      return;
    }

    setTogglingFav(true);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
      }
    } catch {
      // silent
    } finally {
      setTogglingFav(false);
    }
  }

  const isOutOfStock = stock <= 0;

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}

      {cartSuccess && (
        <div className="p-2.5 rounded-[10px] bg-green-50 border border-green-200 text-green-600 text-xs flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Producto agregado al carrito
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || addingCart || authLoading}
        className="w-full h-12 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {addingCart ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Agregando...
          </>
        ) : isOutOfStock ? (
          "Agotado"
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Agregar al carrito
          </>
        )}
      </button>

      <button
        onClick={handleToggleFavorite}
        disabled={togglingFav || authLoading}
        className={`w-full h-11 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-[1.5px] ${
          isFavorited
            ? "bg-[#EBF0FF] border-[#4A7CF7]/40 text-[#4A7CF7]"
            : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#4A7CF7]/40 hover:text-[#4A7CF7]"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {isFavorited ? "En favoritos" : "Agregar a favoritos"}
      </button>
    </div>
  );
}
