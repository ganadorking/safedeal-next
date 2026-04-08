"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("Email o contrasena incorrectos");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Debes confirmar tu email antes de iniciar sesion");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/");
      router.refresh();
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
          <p className="text-[#94A3B8] text-sm mt-2">
            Inicia sesion en tu cuenta
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h1 className="text-xl font-bold text-[#0F172A] mb-6">
            Iniciar Sesion
          </h1>

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
                className="w-full bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contrasena"
                required
                className="w-full bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-[#E6007E] hover:text-[#E6007E] transition-colors"
              >
                Olvidaste tu contrasena?
              </Link>
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
                  Iniciando sesion...
                </span>
              ) : (
                "Iniciar Sesion"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">o continua con</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: window.location.origin + "/api/auth/callback",
                },
              });
            }}
            className="w-full h-11 bg-white border-[1.5px] border-[#E2E8F0] rounded-xl font-semibold text-sm text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#c4b5fd] transition-all flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-[#E6007E] hover:text-[#E6007E] font-semibold transition-colors"
              >
                Registrate
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Al iniciar sesion aceptas nuestros{" "}
          <Link href="/terms" className="underline hover:text-[#E6007E]">
            Terminos
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="underline hover:text-[#E6007E]">
            Politica de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
