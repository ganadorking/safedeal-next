import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

function txTypeLabel(type: string) {
  const map: Record<string, { icon: string; color: string; label: string }> = {
    deposit: { icon: "fa-arrow-down", color: "text-emerald-500", label: "Deposito" },
    withdrawal: { icon: "fa-arrow-up", color: "text-red-500", label: "Retiro" },
    sale: { icon: "fa-cart-shopping", color: "text-emerald-500", label: "Venta" },
    purchase: { icon: "fa-shopping-bag", color: "text-blue-500", label: "Compra" },
    commission: { icon: "fa-percent", color: "text-amber-500", label: "Comision" },
    refund: { icon: "fa-rotate-left", color: "text-[#E6007E]", label: "Reembolso" },
    escrow_hold: { icon: "fa-lock", color: "text-gray-500", label: "Escrow" },
    escrow_release: { icon: "fa-lock-open", color: "text-emerald-500", label: "Liberacion" },
  };
  return map[type] ?? { icon: "fa-circle", color: "text-gray-400", label: type };
}

export default async function WalletPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Billetera</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#E6007E] via-[#E6007E] to-[#C5006B] rounded-[14px] p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-sm text-white/70 font-medium mb-1">Balance disponible</p>
          <p className="text-4xl font-bold mb-6">${Number(user.balance).toFixed(2)} <span className="text-lg font-normal text-white/60">USD</span></p>
          <div className="flex items-center gap-3">
            <Link
              href="/wallet?action=deposit"
              className="inline-flex items-center gap-2 bg-white text-[#E6007E] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              <i className="fa-solid fa-plus" /> Depositar
            </Link>
            <Link
              href="/wallet?action=withdraw"
              className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.15)] text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-[rgba(255,255,255,0.2)]"
            >
              <i className="fa-solid fa-arrow-up-from-bracket" /> Retirar
            </Link>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px]">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-lg font-semibold text-[#0F172A]">Historial de Transacciones</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#fce4ec] flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-clock-rotate-left text-xl text-[#E6007E]" />
            </div>
            <p className="text-sm text-[#94A3B8]">No tienes transacciones aun</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {transactions.map((tx) => {
              const info = txTypeLabel(tx.type);
              const isPositive = Number(tx.amount) > 0;
              return (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0 ${info.color}`}>
                    <i className={`fa-solid ${info.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A]">{info.label}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{tx.description ?? "Sin descripcion"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}{Number(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">Saldo: ${Number(tx.balanceAfter).toFixed(2)}</p>
                  </div>
                  <div className="hidden sm:block shrink-0">
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(tx.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
