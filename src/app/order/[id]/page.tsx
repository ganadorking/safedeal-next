import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-helpers";
import { formatPrice, getProductImageUrl, timeAgo } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Pedido #${id} - SafeDeal`,
  };
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label: "Pendiente",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  paid: {
    label: "Pagado",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  delivered: {
    label: "Entregado",
    color: "text-[#C5006B]",
    bg: "bg-[#fce4ec]",
    border: "border-[#E6007E]/30",
  },
  completed: {
    label: "Completado",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  refunded: {
    label: "Reembolsado",
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
  disputed: {
    label: "En disputa",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
};

const TIMELINE_STEPS = [
  { key: "pending", label: "Pedido creado" },
  { key: "paid", label: "Pago confirmado" },
  { key: "delivered", label: "Producto entregado" },
  { key: "completed", label: "Compra confirmada" },
];

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    notFound();
  }

  const user = await getUser();
  if (!user) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      buyer: {
        select: { id: true, username: true },
      },
      seller: {
        select: { id: true, username: true },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              mainImage: true,
              deliveryType: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Only buyer or seller can view
  if (order.buyerId !== user.id && order.sellerId !== user.id) {
    notFound();
  }

  const isBuyer = order.buyerId === user.id;
  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  // Determine timeline progress
  const statusOrder = ["pending", "paid", "delivered", "completed"];
  const currentStepIndex = statusOrder.indexOf(order.status);

  const paymentLabels: Record<string, string> = {
    stripe: "Tarjeta de credito/debito",
    wallet: "Saldo SafeDeal",
    crypto: "Criptomonedas",
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-sm text-[#94A3B8] mb-2">
              <Link href="/" className="hover:text-[#E6007E] transition-colors">
                Inicio
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[#64748B]">Pedido</span>
            </nav>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Pedido #{order.orderNumber || order.id}
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Creado {timeAgo(order.createdAt)}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-[10px] text-sm font-semibold border ${statusInfo.color} ${statusInfo.bg} ${statusInfo.border}`}
          >
            {statusInfo.label}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 mb-6">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide mb-6">
            Progreso del pedido
          </h2>
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#E2E8F0]" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-[#E6007E] to-[#C5006B] transition-all"
              style={{
                width:
                  currentStepIndex >= 0
                    ? `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%`
                    : "0%",
              }}
            />

            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-[#E6007E] to-[#C5006B] border-[#E6007E] text-white"
                        : "bg-white border-[#E2E8F0] text-[#94A3B8]"
                    } ${isCurrent ? "ring-4 ring-[#E6007E]/20" : ""}`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center max-w-[80px] ${
                      isCompleted ? "text-[#0F172A] font-semibold" : "text-[#94A3B8]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">
                Productos ({order.items.length})
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-[#F8FAFC] rounded-[10px]"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                      <img
                        src={getProductImageUrl(
                          item.product.mainImage,
                          item.product.title
                        )}
                        alt={item.product.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-sm font-semibold text-[#0F172A] hover:text-[#E6007E] transition-colors line-clamp-1"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Cantidad: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            STATUS_CONFIG[item.status]?.bg || "bg-gray-50"
                          } ${STATUS_CONFIG[item.status]?.color || "text-gray-600"}`}
                        >
                          {STATUS_CONFIG[item.status]?.label || item.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#E6007E]">
                        {formatPrice(Number(item.subtotal))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Data */}
            {order.deliveryData && (
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">
                  Datos de entrega
                </h2>
                <div className="bg-[#F8FAFC] rounded-[10px] p-4">
                  <pre className="text-sm text-[#0F172A] whitespace-pre-wrap font-mono">
                    {order.deliveryData}
                  </pre>
                </div>
                {order.deliveryInstructions && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">
                      Instrucciones
                    </p>
                    <p className="text-sm text-[#64748B]">
                      {order.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Payment Info */}
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
              <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide mb-4">
                Informacion de pago
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Metodo</span>
                  <span className="text-[#0F172A] font-medium">
                    {paymentLabels[order.paymentMethod || ""] || order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Subtotal</span>
                  <span className="text-[#0F172A]">
                    {formatPrice(Number(order.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Comision</span>
                  <span className="text-[#0F172A]">
                    {formatPrice(Number(order.commission))}
                  </span>
                </div>
                <div className="border-t border-[#E2E8F0] pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#0F172A]">Total</span>
                    <span className="text-lg font-bold text-[#E6007E]">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
              <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide mb-4">
                Fechas
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Creado</span>
                  <span className="text-[#0F172A]">
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Pagado</span>
                    <span className="text-[#0F172A]">
                      {new Date(order.paidAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Entregado</span>
                    <span className="text-[#0F172A]">
                      {new Date(order.deliveredAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                {order.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Completado</span>
                    <span className="text-[#0F172A]">
                      {new Date(order.completedAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
              <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-wide mb-4">
                Participantes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Comprador</span>
                  <Link
                    href={`/seller/${order.buyer.username}`}
                    className="text-sm font-semibold text-[#E6007E] hover:text-[#E6007E] transition-colors"
                  >
                    {order.buyer.username}
                  </Link>
                </div>
                {order.seller && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#94A3B8]">Vendedor</span>
                    <Link
                      href={`/seller/${order.seller.username}`}
                      className="text-sm font-semibold text-[#E6007E] hover:text-[#E6007E] transition-colors"
                    >
                      {order.seller.username}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {isBuyer && order.status === "delivered" && (
                <button className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all text-sm">
                  Confirmar recepcion
                </button>
              )}
              {isBuyer && ["delivered", "paid"].includes(order.status) && (
                <button className="w-full h-11 border-[1.5px] border-red-300 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-all text-sm">
                  Abrir disputa
                </button>
              )}
              <Link
                href="/"
                className="block w-full text-center h-11 leading-[44px] border-[1.5px] border-[#E2E8F0] text-[#64748B] rounded-xl font-semibold hover:border-[#E6007E] hover:text-[#E6007E] transition-all text-sm"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
