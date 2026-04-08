"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, use } from "react";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [productTitle, setProductTitle] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch product info for display
  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.product || data;
        setProductTitle(p.title || `Producto #${id}`);
      })
      .catch(() => setProductTitle(`Producto #${id}`));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Selecciona una calificacion");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: parseInt(id),
          rating,
          comment: comment.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar resena");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#E6007E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ratingLabels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#fce4ec] transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <h1 className="text-2xl font-bold text-[#0F172A]">Dejar Resena</h1>
      </div>

      {success ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-star text-4xl text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Gracias por tu resena</h3>
          <p className="text-sm text-[#94A3B8] mb-5">Tu opinion ayuda a otros compradores a tomar mejores decisiones</p>
          <button
            onClick={() => router.push("/purchases")}
            className="bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#E6007E] transition-all"
          >
            Volver a Compras
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
          {productTitle && (
            <div className="mb-6 pb-5 border-b border-[#E2E8F0]">
              <p className="text-xs text-[#94A3B8] mb-0.5">Producto</p>
              <p className="text-sm font-semibold text-[#0F172A]">{productTitle}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 mb-5 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-3">Calificacion *</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <i
                      className={`fa-solid fa-star text-3xl transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className="ml-3 text-sm font-medium text-[#64748B]">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">Comentario (opcional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Comparte tu experiencia con este producto..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#E6007E] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane" /> Publicar Resena
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
