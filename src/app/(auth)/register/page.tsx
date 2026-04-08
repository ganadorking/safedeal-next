"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!firstName.trim() || !lastName.trim()) {
      return "Nombre y apellido son obligatorios";
    }
    if (username.length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "El nombre de usuario solo puede contener letras, numeros y guion bajo";
    }
    if (password.length < 8) {
      return "La contrasena debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contrasena debe tener al menos una letra mayuscula";
    }
    if (!/[0-9]/.test(password)) {
      return "La contrasena debe tener al menos un numero";
    }
    if (password !== confirmPassword) {
      return "Las contrasenas no coinciden";
    }
    return null;
  }

  const passStrength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Debil", "Regular", "Buena", "Fuerte"][passStrength] || "";
  const strengthColor = ["#EBEBEC", "#ef4444", "#f59e0b", "#4A7CF7", "#10b981"][passStrength] || "#EBEBEC";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Este email ya esta registrado");
        } else {
          setError(authError.message);
        }
        return;
      }

      if (!authData.user) {
        setError("Error al crear la cuenta. Intenta de nuevo.");
        return;
      }

      // 2. Create DB profile
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          supabaseId: authData.user.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al crear el perfil");
        return;
      }

      router.push("/login?registered=1");
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
          <p className="text-[#94A3B8] text-sm mt-2">
            Crea tu cuenta gratis
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0A0A0B", marginBottom: 6, letterSpacing: "-.4px" }}>
            Crear cuenta
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 22 }}>
            Es gratis y solo toma un minuto
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Apellido */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full bg-[#F5F5F6] border-[1.5px] border-[#EBEBEC] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Apellido</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  required
                  className="w-full bg-[#F5F5F6] border-[1.5px] border-[#EBEBEC] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Nombre de usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="mi_usuario"
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]{3,20}"
                className="w-full bg-[#F5F5F6] border-[1.5px] border-[#EBEBEC] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Correo electronico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-[#F5F5F6] border-[1.5px] border-[#EBEBEC] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none"
              />
            </div>

            {/* Password + strength */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Contrasena</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full bg-[#F5F5F6] border-[1.5px] border-[#EBEBEC] rounded-[10px] h-11 px-4 pr-10 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 14, padding: 4 }}
                >
                  <i className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <>
                  <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= passStrength ? strengthColor : "#EBEBEC" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: strengthColor, marginTop: 2 }}>{strengthLabel}</div>
                </>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Confirmar contrasena</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contrasena"
                  required
                  className="w-full bg-[#F5F5F6] border-[1.5px] border-[#EBEBEC] rounded-[10px] h-11 px-4 pr-10 text-sm text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 focus:outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 14, padding: 4 }}
                >
                  <i className={`far ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div style={{ fontSize: 11, marginTop: 3, color: password === confirmPassword ? "#10b981" : "#ef4444" }}>
                  {password === confirmPassword ? "Las contrasenas coinciden" : "Las contrasenas no coinciden"}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#4A7CF7] text-white rounded-[9px] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta gratis"
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
              Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-[#4A7CF7] hover:text-[#4A7CF7] font-semibold transition-colors"
              >
                Inicia Sesion
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Al registrarte aceptas nuestros{" "}
          <Link href="/terms" className="underline hover:text-[#4A7CF7]">
            Terminos
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="underline hover:text-[#4A7CF7]">
            Politica de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
