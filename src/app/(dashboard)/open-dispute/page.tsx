"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

interface OrderOption {
  id: number;
  orderNumber: string | null;
  total: number;
  createdAt: string;
}

export default function OpenDisputePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/me/orders")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.orders || [];
        setOrders(list);
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItemId: parseInt(selectedOrder),
          reason,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al abrir disputa");
      setSuccess(true);
      setTimeout(() => router.push("/disputes"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#4A7CF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-[#64748B] mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#fce4ec] transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <h1 className="text-2xl font-bold text-[#0F172A]">Abrir Disputa</h1>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-[14px] p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-triangle-exclamation text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Antes de abrir una disputa</h4>
          <p className="text-sm text-[#64748B]">
            Te recomendamos contactar al vendedor directamente primero. Las disputas se revisan por nuestro equipo de soporte y pueden tomar hasta 48 horas en resolverse.
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[14px] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-circle-check text-3xl text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Disputa abierta exitosamente</h3>
          <p className="text-sm text-[#94A3B8]">Redirigiendo a tus disputas...</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 mb-5 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Orden relacionada *</label>
              {loadingOrders ? (
                <div className="h-11 bg-[#F8FAFC] rounded-[10px] animate-pulse" />
              ) : (
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Selecciona una orden</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Orden #{order.orderNumber ?? order.id} - ${Number(order.total).toFixed(2)} ({new Date(order.createdAt).toLocaleDateString("es-MX")})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className={labelClass}>Razon de la disputa *</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)} required className={inputClass}>
                <option value="">Selecciona una razon</option>
                <option value="not_delivered">Producto no entregado</option>
                <option value="not_as_described">Producto diferente al descrito</option>
                <option value="defective">Producto defectuoso o no funcional</option>
                <option value="unauthorized">Compra no autorizada</option>
                <option value="duplicate">Cobro duplicado</option>
                <option value="other">Otro motivo</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Describe el problema en detalle *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Explica con detalle lo que ocurrio. Incluye fechas, capturas si es posible, y cualquier informacion relevante."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#4A7CF7] transition-all text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-gavel" /> Abrir Disputa
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
