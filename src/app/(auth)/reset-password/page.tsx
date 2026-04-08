"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        if (updateError.message.includes("same password")) {
          setError("La nueva contrasena debe ser diferente a la anterior");
        } else {
          setError(updateError.message);
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
              <span className="bg-gradient-to-r from-[#E6007E] to-[#C5006B] bg-clip-text text-transparent">
                Deal
              </span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          {success ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                Contrasena actualizada
              </h2>
              <p className="text-[#64748B] text-sm mb-4">
                Tu contrasena ha sido actualizada correctamente. Seras redirigido
                al inicio de sesion...
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6007E] transition-all text-sm"
              >
                Ir al inicio de sesion
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[#0F172A] mb-2">
                Nueva contrasena
              </h1>
              <p className="text-sm text-[#64748B] mb-6">
                Ingresa tu nueva contrasena. Debe tener al menos 6 caracteres.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Nueva contrasena
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    required
                    minLength={6}
                    className="w-full bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Confirmar contrasena
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contrasena"
                    required
                    className="w-full bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6007E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Actualizando...
                    </span>
                  ) : (
                    "Actualizar contrasena"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
