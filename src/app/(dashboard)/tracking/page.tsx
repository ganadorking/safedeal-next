import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const timelineSteps = [
  { key: "ordered", label: "Ordenado", icon: "fa-receipt" },
  { key: "paid", label: "Pagado", icon: "fa-credit-card" },
  { key: "delivered", label: "Entregado", icon: "fa-truck" },
  { key: "confirmed", label: "Confirmado", icon: "fa-circle-check" },
];

function getStepIndex(status: string, paidAt: Date | null, deliveredAt: Date | null, completedAt: Date | null) {
  if (completedAt || status === "completed" || status === "confirmed") return 3;
  if (deliveredAt || status === "delivered") return 2;
  if (paidAt || status === "paid" || status === "processing") return 1;
  return 0;
}

export default async function TrackingPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
      status: { notIn: ["cancelled", "refunded"] },
    },
    include: {
      items: {
        include: {
          product: { select: { title: true, mainImage: true } },
        },
      },
      buyer: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Seguimiento de Ordenes</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-route text-2xl text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin ordenes para rastrear</h3>
          <p className="text-sm text-[#94A3B8]">Aqui podras ver el progreso de tus ordenes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status, order.paidAt, order.deliveredAt, order.completedAt);
            const isBuyer = order.buyerId === user.id;

            return (
              <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">
                      Orden #{order.orderNumber ?? order.id}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {isBuyer ? "Compraste" : `Comprador: ${order.buyer.username}`} &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-base font-bold text-[#4A7CF7]">${Number(order.total).toFixed(2)}</span>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between mb-5 px-2">
                  {timelineSteps.map((step, idx) => {
                    const isComplete = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {idx > 0 && (
                          <div
                            className={`absolute top-5 right-1/2 w-full h-0.5 ${
                              idx <= currentStep ? "bg-emerald-400" : "bg-[#E2E8F0]"
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                            isCurrent
                              ? "bg-gradient-to-br from-[#4A7CF7] to-[#3A65D4] text-white shadow-lg shadow-[#4A7CF7]/30"
                              : isComplete
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-[#F8FAFC] text-[#94A3B8]"
                          }`}
                        >
                          <i className={`fa-solid ${step.icon} text-sm`} />
                        </div>
                        <span
                          className={`text-[11px] font-medium text-center ${
                            isCurrent ? "text-[#4A7CF7]" : isComplete ? "text-emerald-600" : "text-[#94A3B8]"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product.mainImage ? (
                          <img src={item.product.mainImage} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <i className="fa-solid fa-box text-[#4A7CF7] text-xs" />
                        )}
                      </div>
                      <p className="text-sm text-[#64748B] truncate flex-1">{item.product.title}</p>
                      <span className="text-xs text-[#94A3B8]">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
