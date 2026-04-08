"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Tab = "paypal" | "bank" | "crypto";

export default function PayoutSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("paypal");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // PayPal
  const [paypalEmail, setPaypalEmail] = useState("");

  // Bank
  const [bankName, setBankName] = useState("");
  const [clabe, setClabe] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // Crypto
  const [cryptoWallet, setCryptoWallet] = useState("");
  const [cryptoNetwork, setCryptoNetwork] = useState("bitcoin");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const body: Record<string, any> = { method: activeTab };
      if (activeTab === "paypal") body.paypalEmail = paypalEmail;
      if (activeTab === "bank") {
        body.bankName = bankName;
        body.clabe = clabe;
        body.accountHolder = accountHolder;
      }
      if (activeTab === "crypto") {
        body.walletAddress = cryptoWallet;
        body.network = cryptoNetwork;
      }

      const res = await fetch("/api/me/payout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "paypal", label: "PayPal", icon: "fa-brands fa-paypal" },
    { key: "bank", label: "Banco (CLABE)", icon: "fa-solid fa-building-columns" },
    { key: "crypto", label: "Cripto", icon: "fa-brands fa-bitcoin" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Configuracion de Payout</h1>

      <p className="text-sm text-[#64748B]">
        Configura como deseas recibir tus ganancias. Puedes cambiar tu metodo de pago en cualquier momento.
      </p>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[14px] p-4 flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-emerald-500" />
          <p className="text-sm text-emerald-700 font-medium">Configuracion guardada exitosamente</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden">
        <div className="flex border-b border-[#E2E8F0]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-[#4A7CF7] border-b-2 border-[#4A7CF7] bg-[#fce4ec]/50"
                  : "text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F8FAFC]"
              }`}
            >
              <i className={`${tab.icon}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {activeTab === "paypal" && (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <i className="fa-brands fa-paypal text-blue-600 text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">PayPal</h4>
                  <p className="text-xs text-[#94A3B8]">Recibe tus pagos directamente en tu cuenta PayPal</p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Correo electronico de PayPal</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="tu-correo@ejemplo.com"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {activeTab === "bank" && (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-building-columns text-teal-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">Transferencia Bancaria</h4>
                  <p className="text-xs text-[#94A3B8]">Recibe via SPEI con tu CLABE interbancaria</p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Nombre del banco</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Ej: BBVA, Banorte, etc." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CLABE interbancaria (18 digitos)</label>
                <input type="text" value={clabe} onChange={(e) => setClabe(e.target.value)} placeholder="000000000000000000" maxLength={18} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Titular de la cuenta</label>
                <input type="text" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Nombre completo del titular" className={inputClass} />
              </div>
            </>
          )}

          {activeTab === "crypto" && (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <i className="fa-brands fa-bitcoin text-amber-500 text-lg" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">Criptomonedas</h4>
                  <p className="text-xs text-[#94A3B8]">Recibe pagos en tu wallet de criptomonedas</p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Red</label>
                <select value={cryptoNetwork} onChange={(e) => setCryptoNetwork(e.target.value)} className={inputClass}>
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="usdt_trc20">USDT (TRC-20)</option>
                  <option value="usdt_erc20">USDT (ERC-20)</option>
                  <option value="litecoin">Litecoin (LTC)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Direccion de wallet</label>
                <input
                  type="text"
                  value={cryptoWallet}
                  onChange={(e) => setCryptoWallet(e.target.value)}
                  placeholder="Tu direccion de wallet"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" /> Guardar Configuracion
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
