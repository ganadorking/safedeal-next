import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Pendiente" },
    paid: { bg: "bg-blue-50", text: "text-blue-700", label: "Pagado" },
    delivered: { bg: "bg-cyan-50", text: "text-cyan-700", label: "Entregado" },
    confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Confirmado" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Completado" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Cancelado" },
    disputed: { bg: "bg-red-50", text: "text-red-700", label: "Disputado" },
    in_review: { bg: "bg-[#fce4ec]", text: "text-pink-700", label: "En revision" },
  };
  const s = map[status] ?? { bg: "bg-gray-50", text: "text-gray-700", label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default async function SalesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId: user.id },
    include: {
      product: { select: { title: true, mainImage: true } },
      order: {
        select: {
          orderNumber: true,
          buyer: { select: { username: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalRevenue = orderItems.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Mis Ventas</h1>
        <div className="text-right">
          <p className="text-sm text-[#94A3B8]">{orderItems.length} ventas</p>
          <p className="text-lg font-bold text-[#4A7CF7]">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {orderItems.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-chart-line text-2xl text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin ventas aun</h3>
          <p className="text-sm text-[#94A3B8]">Publica tu primer producto para comenzar a vender</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
            <div className="col-span-4">Producto</div>
            <div className="col-span-2">Comprador</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2">Subtotal</div>
            <div className="col-span-2">Fecha</div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors"
              >
                {/* Product */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product.mainImage ? (
                      <img src={item.product.mainImage} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <i className="fa-solid fa-box text-[#4A7CF7] text-sm" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{item.product.title}</p>
                    <p className="text-xs text-[#94A3B8] md:hidden">
                      Orden #{item.order.orderNumber ?? item.orderId}
                    </p>
                  </div>
                </div>

                {/* Buyer */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4A7CF7] to-[#3A65D4] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {item.order.buyer.avatarUrl ? (
                      <img src={item.order.buyer.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      item.order.buyer.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm text-[#64748B] truncate">{item.order.buyer.username}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  {statusBadge(item.status)}
                </div>

                {/* Subtotal */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm font-semibold text-[#4A7CF7]">${Number(item.subtotal).toFixed(2)}</span>
                </div>

                {/* Date */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-[#94A3B8]">
                    {new Date(item.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
