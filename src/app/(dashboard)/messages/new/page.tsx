"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

export default function NewMessagePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      // First resolve username to userId
      const lookupRes = await fetch(`/api/users/lookup?username=${encodeURIComponent(recipient)}`);
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData.userId) {
        throw new Error("Usuario no encontrado");
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: lookupData.userId,
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar mensaje");

      setSuccess(true);
      setTimeout(() => router.push(`/messages/${lookupData.userId}`), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#E6007E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-[#64748B] mb-1.5";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#fce4ec] transition-colors">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <h1 className="text-2xl font-bold text-[#0F172A]">Nuevo Mensaje</h1>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[14px] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-paper-plane text-2xl text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Mensaje enviado</h3>
          <p className="text-sm text-[#94A3B8]">Redirigiendo a la conversacion...</p>
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
              <label className={labelClass}>Destinatario *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <i className="fa-solid fa-at text-sm" />
                </span>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Nombre de usuario"
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Asunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Asunto del mensaje (opcional)"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mensaje *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Escribe tu mensaje aqui..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={sending}
                className="bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#E6007E] transition-all text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane" /> Enviar Mensaje
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
