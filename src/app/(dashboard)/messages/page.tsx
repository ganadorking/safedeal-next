import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { timeAgo, truncate } from "@/lib/utils";

export default async function MessagesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  // Get all messages where user is sender or receiver, grouped by conversation partner
  const sent = await prisma.message.findMany({
    where: { senderId: user.id },
    include: { receiver: { select: { id: true, username: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  const received = await prisma.message.findMany({
    where: { receiverId: user.id },
    include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Build conversation map
  const convMap = new Map<
    number,
    { userId: number; username: string; avatarUrl: string | null; lastMessage: string; lastDate: Date; unread: number; subject: string | null }
  >();

  for (const msg of received) {
    const partnerId = msg.sender.id;
    const existing = convMap.get(partnerId);
    if (!existing || msg.createdAt > existing.lastDate) {
      convMap.set(partnerId, {
        userId: partnerId,
        username: msg.sender.username,
        avatarUrl: msg.sender.avatarUrl,
        lastMessage: msg.message,
        lastDate: msg.createdAt,
        unread: (existing?.unread ?? 0) + (!msg.isRead ? 1 : 0),
        subject: msg.subject ?? existing?.subject ?? null,
      });
    } else if (!msg.isRead) {
      existing.unread += 1;
    }
  }

  for (const msg of sent) {
    const partnerId = msg.receiver.id;
    const existing = convMap.get(partnerId);
    if (!existing || msg.createdAt > existing.lastDate) {
      convMap.set(partnerId, {
        userId: partnerId,
        username: msg.receiver.username,
        avatarUrl: msg.receiver.avatarUrl,
        lastMessage: msg.message,
        lastDate: msg.createdAt,
        unread: existing?.unread ?? 0,
        subject: msg.subject ?? existing?.subject ?? null,
      });
    }
  }

  const conversations = Array.from(convMap.values()).sort(
    (a, b) => b.lastDate.getTime() - a.lastDate.getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Mensajes</h1>
        <Link
          href="/messages/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#E6007E] transition-all"
        >
          <i className="fa-solid fa-pen-to-square" /> Nuevo Mensaje
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-envelope text-2xl text-sky-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin mensajes</h3>
          <p className="text-sm text-[#94A3B8] mb-4">Inicia una conversacion con otro usuario</p>
          <Link
            href="/messages/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#E6007E] transition-all"
          >
            <i className="fa-solid fa-pen-to-square" /> Nuevo Mensaje
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden divide-y divide-[#E2E8F0]">
          {conversations.map((conv) => (
            <Link
              key={conv.userId}
              href={`/messages/${conv.userId}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E6007E] to-[#C5006B] flex items-center justify-center text-white font-bold">
                  {conv.avatarUrl ? (
                    <img src={conv.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    conv.username.charAt(0).toUpperCase()
                  )}
                </div>
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E6007E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unread > 9 ? "9+" : conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className={`text-sm font-semibold truncate ${conv.unread > 0 ? "text-[#0F172A]" : "text-[#64748B]"}`}>
                    {conv.username}
                  </h3>
                  <span className="text-xs text-[#94A3B8] shrink-0 ml-3">{timeAgo(conv.lastDate)}</span>
                </div>
                {conv.subject && (
                  <p className="text-xs font-medium text-[#E6007E] mb-0.5 truncate">{conv.subject}</p>
                )}
                <p className={`text-sm truncate ${conv.unread > 0 ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}`}>
                  {truncate(conv.lastMessage, 80)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
