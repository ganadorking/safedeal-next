"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, FormEvent, use } from "react";

interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface OtherUser {
  id: number;
  username: string;
  avatarUrl: string | null;
}

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch messages
  useEffect(() => {
    if (!userId) return;

    async function fetchChat() {
      try {
        const res = await fetch(`/api/messages/${userId}`);
        const data = await res.json();
        setMessages(data.messages || []);
        setOtherUser(data.otherUser || { id: parseInt(userId), username: `Usuario #${userId}`, avatarUrl: null });
      } catch {
        // fallback
        setOtherUser({ id: parseInt(userId), username: `Usuario #${userId}`, avatarUrl: null });
      } finally {
        setLoadingChat(false);
      }
    }

    fetchChat();
    const interval = setInterval(fetchChat, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: parseInt(userId),
          message: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const sent = data.message || {
          id: Date.now(),
          senderId: 0, // will be replaced on next fetch
          receiverId: parseInt(userId),
          subject: null,
          message: newMessage.trim(),
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, sent]);
        setNewMessage("");
      }
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  if (loading || loadingChat) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#4A7CF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Chat Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-t-[14px] px-5 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/messages")} className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#EBF0FF] transition-colors shrink-0">
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A7CF7] to-[#3A65D4] flex items-center justify-center text-white font-bold shrink-0">
          {otherUser?.avatarUrl ? (
            <img src={otherUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            (otherUser?.username || "?").charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#0F172A]">{otherUser?.username || "Usuario"}</h2>
          <p className="text-xs text-[#94A3B8]">Conversacion</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#FFFFFF] border-x border-[#E2E8F0] px-5 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-[#EBF0FF] flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-comments text-xl text-[#4A7CF7]" />
            </div>
            <p className="text-sm text-[#94A3B8]">Inicia la conversacion</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = user && msg.senderId !== parseInt(userId);
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? "bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white rounded-br-md"
                      : "bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-[#94A3B8]"}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border border-[#E2E8F0] rounded-b-[14px] px-4 py-3">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="w-11 h-11 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#4A7CF7] transition-all disabled:opacity-50 shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <i className="fa-solid fa-paper-plane text-sm" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
