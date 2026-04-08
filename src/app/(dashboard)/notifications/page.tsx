import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

function notifIcon(type: string) {
  const map: Record<string, { icon: string; bg: string; color: string }> = {
    order: { icon: "fa-shopping-bag", bg: "bg-blue-50", color: "text-blue-500" },
    sale: { icon: "fa-chart-line", bg: "bg-emerald-50", color: "text-emerald-500" },
    payment: { icon: "fa-credit-card", bg: "bg-[#fce4ec]", color: "text-[#4A7CF7]" },
    delivery: { icon: "fa-truck", bg: "bg-cyan-50", color: "text-cyan-500" },
    review: { icon: "fa-star", bg: "bg-amber-50", color: "text-amber-500" },
    dispute: { icon: "fa-gavel", bg: "bg-red-50", color: "text-red-500" },
    message: { icon: "fa-envelope", bg: "bg-sky-50", color: "text-sky-500" },
    system: { icon: "fa-bell", bg: "bg-gray-50", color: "text-gray-500" },
    promotion: { icon: "fa-tag", bg: "bg-[#fce4ec]", color: "text-[#4A7CF7]" },
    wallet: { icon: "fa-wallet", bg: "bg-indigo-50", color: "text-indigo-500" },
  };
  return map[type] ?? map.system;
}

export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-[#94A3B8] mt-0.5">{unreadCount} sin leer</p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action="/api/notifications/read-all" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4A7CF7] hover:text-[#3A65D4] transition-colors"
            >
              <i className="fa-solid fa-check-double" /> Marcar todo como leido
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-bell text-2xl text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin notificaciones</h3>
          <p className="text-sm text-[#94A3B8]">Te avisaremos cuando algo importante ocurra</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden divide-y divide-[#E2E8F0]">
          {notifications.map((notif) => {
            const icon = notifIcon(notif.type);
            const Wrapper = notif.link ? Link : "div";
            const wrapperProps = notif.link ? { href: notif.link } : {};
            return (
              <Wrapper
                key={notif.id}
                {...(wrapperProps as any)}
                className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-[#F8FAFC] ${!notif.isRead ? "bg-[#fce4ec]/30" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl ${icon.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <i className={`fa-solid ${icon.icon} text-sm ${icon.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {notif.title && (
                    <p className="text-sm font-semibold text-[#0F172A] mb-0.5">{notif.title}</p>
                  )}
                  <p className="text-sm text-[#64748B] leading-relaxed">{notif.message}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4A7CF7] shrink-0 mt-2" />
                )}
              </Wrapper>
            );
          })}
        </div>
      )}
    </div>
  );
}
