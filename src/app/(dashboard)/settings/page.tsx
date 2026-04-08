"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import Modal from "@/components/ui/Modal";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [twoFactor, setTwoFactor] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState(false);

  // 2FA state
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [twoFaError, setTwoFaError] = useState("");
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch current 2FA status
  useEffect(() => {
    if (user) {
      fetch("/api/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          const u = data?.user || data;
          if (u && typeof u.twoFactorEnabled === "boolean") {
            setTwoFactor(u.twoFactorEnabled);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("La contrasena debe tener al menos 8 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contrasenas no coinciden");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contrasena");
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleEnable2FA() {
    setTwoFaLoading(true);
    setTwoFaError("");
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al configurar 2FA");
      setQrCodeUrl(data.qrCodeUrl);
      setTotpSecret(data.secret);
      setVerifyCode("");
      setShowQrModal(true);
    } catch (err: any) {
      setTwoFaError(err.message);
    } finally {
      setTwoFaLoading(false);
    }
  }

  async function handleVerify2FA() {
    setTwoFaLoading(true);
    setTwoFaError("");
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: totpSecret, token: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Codigo invalido");
      setTwoFactor(true);
      setShowQrModal(false);
      setVerifyCode("");
      setTotpSecret("");
      setQrCodeUrl("");
    } catch (err: any) {
      setTwoFaError(err.message);
    } finally {
      setTwoFaLoading(false);
    }
  }

  async function handleDisable2FA() {
    setTwoFaLoading(true);
    setTwoFaError("");
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: disableCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Codigo invalido");
      setTwoFactor(false);
      setShowDisableModal(false);
      setDisableCode("");
    } catch (err: any) {
      setTwoFaError(err.message);
    } finally {
      setTwoFaLoading(false);
    }
  }

  async function handleSavePreferences() {
    setSavingPrefs(true);
    setPrefsSuccess(false);
    try {
      await fetch("/api/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifEmail,
          notifOrders,
          notifMessages,
          notifPromos,
        }),
      });
      setPrefsSuccess(true);
      setTimeout(() => setPrefsSuccess(false), 3000);
    } catch {
      // silent
    } finally {
      setSavingPrefs(false);
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

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[#64748B]">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#4A7CF7]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A7CF7]" />
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Configuracion</h1>

      {/* Change Password */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <i className="fa-solid fa-lock text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Cambiar Contrasena</h3>
        </div>

        {passwordSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[10px] p-3 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-500 text-sm" />
            <p className="text-sm text-emerald-700">Contrasena actualizada exitosamente</p>
          </div>
        )}

        {passwordError && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" />
            <p className="text-sm text-red-700">{passwordError}</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className={labelClass}>Contrasena actual</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nueva contrasena</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirmar contrasena</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {savingPassword ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              "Cambiar Contrasena"
            )}
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#fce4ec] flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-[#4A7CF7]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">Autenticacion de Dos Factores</h3>
            <p className="text-xs text-[#94A3B8]">Agrega una capa extra de seguridad con Google Authenticator</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm text-[#64748B]">Estado: </span>
            {twoFactor ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <i className="fa-solid fa-circle-check text-xs" />
                Activado
              </span>
            ) : (
              <span className="text-sm text-[#94A3B8]">Desactivado</span>
            )}
          </div>

          {twoFactor ? (
            <button
              onClick={() => {
                setDisableCode("");
                setTwoFaError("");
                setShowDisableModal(true);
              }}
              className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              Desactivar
            </button>
          ) : (
            <button
              onClick={handleEnable2FA}
              disabled={twoFaLoading}
              className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-5 py-2 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {twoFaLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cargando...
                </>
              ) : (
                "Activar"
              )}
            </button>
          )}
        </div>

        {twoFaError && !showQrModal && !showDisableModal && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 mt-3 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" />
            <p className="text-sm text-red-700">{twoFaError}</p>
          </div>
        )}
      </div>

      {/* 2FA Setup Modal */}
      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="Configurar 2FA">
        <div className="space-y-5">
          <p className="text-sm text-[#64748B]">
            Escanea el codigo QR con Google Authenticator u otra app compatible, luego ingresa el codigo de 6 digitos para verificar.
          </p>

          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                <img src={qrCodeUrl} alt="QR Code" width={200} height={200} />
              </div>
            </div>
          )}

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-3">
            <p className="text-xs text-[#94A3B8] mb-1">Clave manual (si no puedes escanear):</p>
            <p className="text-sm font-mono font-semibold text-[#0F172A] break-all select-all">
              {totpSecret}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-1.5">
              Codigo de verificacion
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={inputClass}
              style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: 18, fontWeight: 600 }}
            />
          </div>

          {twoFaError && (
            <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-sm text-red-700">{twoFaError}</p>
            </div>
          )}

          <button
            onClick={handleVerify2FA}
            disabled={twoFaLoading || verifyCode.length !== 6}
            className="w-full bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {twoFaLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar y Activar"
            )}
          </button>
        </div>
      </Modal>

      {/* 2FA Disable Modal */}
      <Modal isOpen={showDisableModal} onClose={() => setShowDisableModal(false)} title="Desactivar 2FA">
        <div className="space-y-5">
          <p className="text-sm text-[#64748B]">
            Ingresa el codigo actual de tu aplicacion de autenticacion para desactivar 2FA.
          </p>

          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-1.5">
              Codigo de verificacion
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={inputClass}
              style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: 18, fontWeight: 600 }}
            />
          </div>

          {twoFaError && (
            <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-sm text-red-700">{twoFaError}</p>
            </div>
          )}

          <button
            onClick={handleDisable2FA}
            disabled={twoFaLoading || disableCode.length !== 6}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {twoFaLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Desactivando...
              </>
            ) : (
              "Desactivar 2FA"
            )}
          </button>
        </div>
      </Modal>

      {/* Notification Preferences */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <i className="fa-solid fa-bell text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Preferencias de Notificaciones</h3>
        </div>

        {prefsSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[10px] p-3 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-500 text-sm" />
            <p className="text-sm text-emerald-700">Preferencias guardadas</p>
          </div>
        )}

        <div className="divide-y divide-[#E2E8F0]">
          <Toggle checked={notifEmail} onChange={setNotifEmail} label="Notificaciones por correo electronico" />
          <Toggle checked={notifOrders} onChange={setNotifOrders} label="Actualizaciones de ordenes" />
          <Toggle checked={notifMessages} onChange={setNotifMessages} label="Nuevos mensajes" />
          <Toggle checked={notifPromos} onChange={setNotifPromos} label="Ofertas y promociones" />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSavePreferences}
            disabled={savingPrefs}
            className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {savingPrefs ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Preferencias"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
