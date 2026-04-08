import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    open: { bg: "bg-amber-50", text: "text-amber-700", label: "Abierta" },
    in_review: { bg: "bg-[#EBF0FF]", text: "text-[#3A65D4]", label: "En revision" },
    resolved: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Resuelta" },
    closed: { bg: "bg-gray-50", text: "text-gray-700", label: "Cerrada" },
    escalated: { bg: "bg-red-50", text: "text-red-700", label: "Escalada" },
  };
  const s = map[status] ?? { bg: "bg-gray-50", text: "text-gray-700", label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default async function DisputesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const disputes = await prisma.dispute.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    include: {
      buyer: { select: { username: true } },
      seller: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Disputas</h1>
        <Link
          href="/open-dispute"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all"
        >
          <i className="fa-solid fa-plus" /> Abrir Disputa
        </Link>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-shield-check text-2xl text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin disputas</h3>
          <p className="text-sm text-[#94A3B8]">No tienes disputas activas. Tus transacciones estan en orden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((dispute) => {
            const isBuyer = dispute.buyerId === user.id;
            const otherUser = isBuyer ? dispute.seller.username : dispute.buyer.username;
            return (
              <div
                key={dispute.id}
                className="bg-white border border-[#E2E8F0] rounded-[14px] p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-gavel text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A]">Disputa #{dispute.id}</h3>
                      <p className="text-xs text-[#94A3B8]">
                        Orden Item #{dispute.orderItemId} &middot; {isBuyer ? "Comprador" : "Vendedor"} vs {otherUser}
                      </p>
                    </div>
                  </div>
                  {statusBadge(dispute.status)}
                </div>

                <div className="ml-[52px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0FF] text-[#3A65D4]">
                      <i className="fa-solid fa-tag text-[10px]" /> {dispute.reason}
                    </span>
                  </div>
                  {dispute.description && (
                    <p className="text-sm text-[#64748B] line-clamp-2 mb-2">{dispute.description}</p>
                  )}
                  {dispute.resolution && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-emerald-700 mb-0.5">Resolucion:</p>
                      <p className="text-sm text-emerald-800">{dispute.resolution}</p>
                    </div>
                  )}
                  <p className="text-xs text-[#94A3B8]">{timeAgo(dispute.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
