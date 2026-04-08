import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Pendiente" },
    paid: { bg: "bg-blue-50", text: "text-blue-700", label: "Pagado" },
    processing: { bg: "bg-[#fce4ec]", text: "text-[#C5006B]", label: "Procesando" },
    delivered: { bg: "bg-cyan-50", text: "text-cyan-700", label: "Entregado" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Completado" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Cancelado" },
    refunded: { bg: "bg-gray-50", text: "text-gray-700", label: "Reembolsado" },
    in_review: { bg: "bg-[#fce4ec]", text: "text-pink-700", label: "En revision" },
  };
  const s = map[status] ?? { bg: "bg-gray-50", text: "text-gray-700", label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default async function PurchasesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { title: true, mainImage: true, slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Mis Compras</h1>
        <span className="text-sm text-[#94A3B8]">{orders.length} ordenes</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#fce4ec] flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-shopping-bag text-2xl text-[#E6007E]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin compras aun</h3>
          <p className="text-sm text-[#94A3B8] mb-4">Explora el marketplace para encontrar productos increibles</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#E6007E] transition-all"
          >
            <i className="fa-solid fa-compass" /> Explorar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="block bg-white border border-[#E2E8F0] rounded-[14px] p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#0F172A]">
                    Orden #{order.orderNumber ?? order.id}
                  </span>
                  {statusBadge(order.status)}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#94A3B8]">
                    {new Date(order.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-base font-bold text-[#E6007E]">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.mainImage ? (
                        <img src={item.product.mainImage} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <i className="fa-solid fa-box text-[#E6007E] text-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{item.product.title}</p>
                      <p className="text-xs text-[#94A3B8]">Cant: {item.quantity} &middot; ${Number(item.subtotal).toFixed(2)}</p>
                    </div>
                    {statusBadge(item.status)}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
