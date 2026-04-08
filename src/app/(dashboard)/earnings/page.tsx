import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function EarningsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: { in: ["sale", "commission", "escrow_release"] },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const totalEarnings = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const pendingItems = await prisma.orderItem.count({
    where: { sellerId: user.id, status: { in: ["paid", "delivered"] } },
  });

  const completedItems = await prisma.orderItem.count({
    where: { sellerId: user.id, status: "confirmed" },
  });

  const paidEarnings = transactions
    .filter((t) => t.status === "completed" && Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const pendingEarnings = totalEarnings - paidEarnings;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Ganancias</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <i className="fa-solid fa-coins text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-[#94A3B8]">Total Ganado</p>
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <i className="fa-solid fa-hourglass-half text-amber-500" />
            </div>
            <p className="text-sm font-medium text-[#94A3B8]">Pendiente</p>
          </div>
          <p className="text-3xl font-bold text-amber-600">${pendingEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <i className="fa-solid fa-check-double text-blue-500" />
            </div>
            <p className="text-sm font-medium text-[#94A3B8]">Pagado</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">${paidEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-[#fce4ec] border border-[#4A7CF7]/30 rounded-[14px] p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#fce4ec] flex items-center justify-center shrink-0">
          <i className="fa-solid fa-circle-info text-[#4A7CF7]" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Comision de la plataforma: 5%</h4>
          <p className="text-sm text-[#64748B]">
            SafeDeal cobra una comision del 5% sobre cada venta completada. Los fondos se liberan automaticamente cuando el comprador confirma la entrega o despues de 72 horas.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 text-center">
          <p className="text-3xl font-bold text-[#0F172A]">{pendingItems}</p>
          <p className="text-sm text-[#94A3B8] mt-1">Ventas pendientes de confirmar</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 text-center">
          <p className="text-3xl font-bold text-[#0F172A]">{completedItems}</p>
          <p className="text-sm text-[#94A3B8] mt-1">Ventas completadas</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px]">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-lg font-semibold text-[#0F172A]">Transacciones Recientes</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-coins text-xl text-amber-400" />
            </div>
            <p className="text-sm text-[#94A3B8]">Aun no tienes ganancias</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {transactions.map((tx) => {
              const isPositive = Number(tx.amount) > 0;
              return (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? "bg-emerald-50" : "bg-red-50"}`}>
                    <i className={`fa-solid ${isPositive ? "fa-arrow-trend-up text-emerald-500" : "fa-arrow-trend-down text-red-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] capitalize">{tx.type.replace(/_/g, " ")}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{tx.description ?? "Transaccion"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}{Number(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
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
