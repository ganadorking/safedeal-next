"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSent(true);
    } catch {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold">
              <span className="text-[#0F172A]">Safe</span>
              <span className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] bg-clip-text text-transparent">
                Deal
              </span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                Revisa tu email
              </h2>
              <p className="text-[#64748B] text-sm mb-6">
                Hemos enviado un enlace de recuperacion a{" "}
                <span className="font-semibold text-[#0F172A]">{email}</span>.
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4A7CF7] transition-all text-sm"
              >
                Volver al inicio de sesion
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[#0F172A] mb-2">
                Recuperar contrasena
              </h1>
              <p className="text-sm text-[#64748B] mb-6">
                Ingresa tu email y te enviaremos un enlace para restablecer tu
                contrasena.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    "Enviar enlace de recuperacion"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-[#4A7CF7] hover:text-[#4A7CF7] transition-colors"
                >
                  Volver al inicio de sesion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
