"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { getProductImageUrl } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ── Types ─────────────────────────────────────────────────────────────
interface CartProduct {
  id: number;
  title: string;
  slug: string;
  price: string;
  mainImage: string | null;
  deliveryType: string;
  seller: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
}

interface CartItemData {
  id: number;
  quantity: number;
  product: CartProduct;
}

// ── Stripe setup ──────────────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0F172A",
      "::placeholder": { color: "#94A3B8" },
      fontFamily: "Inter, system-ui, sans-serif",
    },
    invalid: { color: "#ef4444" },
  },
  hidePostalCode: true,
};

// ── Payment methods config ────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "card",
    name: "Tarjeta de credito/debito",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    description: "Visa, Mastercard, AMEX",
  },
  {
    id: "wallet",
    name: "Saldo SafeDeal",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6" />
      </svg>
    ),
    description: "Paga con tu saldo disponible",
  },
  {
    id: "crypto",
    name: "Criptomonedas",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: "Bitcoin, USDT, ETH",
  },
];

// ── Spinner ───────────────────────────────────────────────────────────
function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Card Payment Form (inside Elements) ───────────────────────────────
function CardPaymentForm({
  total,
  onSuccess,
  onError,
}: {
  total: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    onError("");

    try {
      // Step 1: Create PaymentIntent on our server
      const intentRes = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!intentRes.ok) {
        const data = await intentRes.json();
        onError(data.error || "Error al crear el pago");
        setProcessing(false);
        return;
      }

      const { clientSecret, orderId } = await intentRes.json();

      // Step 2: Confirm payment with Stripe Elements
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onError("Error al cargar el formulario de pago");
        setProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        onError(error.message || "Error al procesar el pago");
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Step 3: Confirm on our server
        await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        onSuccess();
      } else {
        onError("El pago no se completo. Intenta de nuevo.");
        setProcessing(false);
      }
    } catch {
      onError("Error de conexion. Intenta de nuevo.");
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Card input container */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#0F172A] mb-2">
          Datos de la tarjeta
        </label>
        <div
          className="p-4 bg-[#F8FAFC] rounded-[10px] border-[1.5px] border-[#E2E8F0] transition-all focus-within:border-[#E6007E] focus-within:ring-2 focus-within:ring-[#E6007E]/10"
        >
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8]">
          Tus datos son encriptados y procesados de forma segura
        </p>
      </div>

      {/* Pay button */}
      <button
        type="submit"
        disabled={processing || !stripe || !cardComplete}
        className="w-full h-[52px] bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#E6007E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Spinner className="h-5 w-5" />
            <span>Procesando pago...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Pagar ${total.toFixed(2)}</span>
          </>
        )}
      </button>

      {/* Trust badge */}
      <div className="mt-4 flex items-center gap-2 justify-center">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-xs text-[#94A3B8]">Pago seguro por SafeDeal</span>
      </div>
    </form>
  );
}

// ── Main Checkout Page ────────────────────────────────────────────────
export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=cart, 2=method, 3=pay

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cartItems || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchCart();
    }
  }, [user, authLoading, router, fetchCart]);

  async function handleRemoveItem(productId: number) {
    setRemovingId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      }
    } catch {
      // silent
    } finally {
      setRemovingId(null);
    }
  }

  // Wallet payment
  async function handleWalletPayment() {
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: "wallet" }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al procesar el pago");
        return;
      }

      router.push("/purchases?success=true");
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
  }

  function handleCardSuccess() {
    router.push("/purchases?success=true");
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const commission = subtotal * 0.05;
  const total = subtotal + commission;

  // ── Loading state ─────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-[#E6007E]" />
          <p className="text-[#94A3B8] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Tu carrito esta vacio</h2>
          <p className="text-sm text-[#94A3B8] mb-6">Agrega productos para continuar con la compra.</p>
          <Link
            href="/search"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6007E] transition-all"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  // ── Main checkout ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/search" className="text-[#94A3B8] hover:text-[#E6007E] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A]">Checkout</h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { num: 1, label: "Carrito" },
            { num: 2, label: "Metodo" },
            { num: 3, label: "Pago" },
          ].map(({ num, label }) => (
            <div key={num} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (num < step || (num === 1)) setStep(num as 1 | 2 | 3);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  step === num
                    ? "bg-[#fce4ec] text-[#E6007E]"
                    : step > num
                    ? "bg-green-50 text-green-600 cursor-pointer"
                    : "bg-[#F8FAFC] text-[#94A3B8]"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === num
                      ? "bg-[#E6007E] text-white"
                      : step > num
                      ? "bg-green-500 text-white"
                      : "bg-[#E2E8F0] text-[#94A3B8]"
                  }`}
                >
                  {step > num ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    num
                  )}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {num < 3 && (
                <div className={`w-8 h-0.5 ${step > num ? "bg-green-300" : "bg-[#E2E8F0]"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Cart items */}
            {step >= 1 && (
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Tu carrito ({cartItems.length})
                  </h2>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[#E6007E] hover:text-[#E6007E] font-medium"
                    >
                      Editar
                    </button>
                  )}
                </div>

                {step === 1 ? (
                  <>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-[#F8FAFC] rounded-[10px]">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                            <img
                              src={getProductImageUrl(item.product.mainImage, item.product.title)}
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
                              Vendedor: {item.product.seller.username}
                            </p>
                            <p className="text-xs text-[#94A3B8]">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <p className="text-sm font-bold text-[#E6007E]">
                              ${(Number(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              disabled={removingId === item.product.id}
                              className="text-xs text-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              {removingId === item.product.id ? "..." : "Eliminar"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="mt-6 w-full h-12 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6007E] transition-all flex items-center justify-center gap-2"
                    >
                      Continuar al pago
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : (
                  /* Collapsed cart summary */
                  <div className="flex items-center gap-3 text-sm text-[#64748B]">
                    <span>{cartItems.length} producto{cartItems.length > 1 ? "s" : ""}</span>
                    <span className="text-[#E2E8F0]">|</span>
                    <span className="font-semibold text-[#E6007E]">${subtotal.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment method selection */}
            {step >= 2 && (
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#0F172A]">Metodo de pago</h2>
                  {step > 2 && (
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-[#E6007E] hover:text-[#E6007E] font-medium"
                    >
                      Cambiar
                    </button>
                  )}
                </div>

                {step === 2 ? (
                  <>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-[10px] border-[1.5px] transition-all text-left ${
                            paymentMethod === method.id
                              ? "border-[#E6007E] bg-[#fce4ec]/50 ring-2 ring-[#E6007E]/10"
                              : "border-[#E2E8F0] hover:border-[#E6007E]"
                          }`}
                        >
                          <div className={paymentMethod === method.id ? "text-[#E6007E]" : "text-[#94A3B8]"}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#0F172A]">{method.name}</p>
                            <p className="text-xs text-[#94A3B8]">{method.description}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === method.id ? "border-[#E6007E]" : "border-[#E2E8F0]"
                            }`}
                          >
                            {paymentMethod === method.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#E6007E]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="mt-6 w-full h-12 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6007E] transition-all flex items-center justify-center gap-2"
                    >
                      Continuar
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : (
                  /* Collapsed method summary */
                  <div className="flex items-center gap-3 text-sm text-[#64748B]">
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.icon}
                    <span>{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment form */}
            {step === 3 && (
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-6">Completar pago</h2>

                {/* Card payment with Stripe Elements */}
                {paymentMethod === "card" && (
                  <Elements stripe={stripePromise}>
                    <CardPaymentForm
                      total={total}
                      onSuccess={handleCardSuccess}
                      onError={setError}
                    />
                  </Elements>
                )}

                {/* Wallet payment */}
                {paymentMethod === "wallet" && (
                  <div>
                    <div className="bg-[#F8FAFC] rounded-[10px] p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#94A3B8]">Tu saldo disponible</p>
                          <p className="text-xl font-bold text-[#0F172A]">
                            ${user ? Number(user.balance).toFixed(2) : "0.00"}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user && Number(user.balance) >= total
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {user && Number(user.balance) >= total ? "Saldo suficiente" : "Saldo insuficiente"}
                        </div>
                      </div>
                    </div>

                    {user && Number(user.balance) < total ? (
                      <div className="text-center">
                        <p className="text-sm text-[#64748B] mb-4">
                          Necesitas ${(total - Number(user.balance)).toFixed(2)} mas para completar esta compra.
                        </p>
                        <Link
                          href="/wallet"
                          className="inline-block px-6 py-3 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6007E] transition-all"
                        >
                          Recargar saldo
                        </Link>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleWalletPayment}
                          disabled={processing}
                          className="w-full h-[52px] bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#E6007E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <Spinner />
                              <span>Procesando...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Pagar ${total.toFixed(2)} con saldo</span>
                            </>
                          )}
                        </button>
                        <div className="mt-4 flex items-center gap-2 justify-center">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="text-xs text-[#94A3B8]">Pago seguro por SafeDeal</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Crypto - coming soon */}
                {paymentMethod === "crypto" && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">Proximamente</h3>
                    <p className="text-sm text-[#94A3B8] max-w-sm mx-auto">
                      Los pagos con criptomonedas estaran disponibles pronto. Mientras tanto, usa tarjeta o saldo SafeDeal.
                    </p>
                    <button
                      onClick={() => {
                        setPaymentMethod("card");
                        setStep(2);
                      }}
                      className="mt-6 px-6 py-3 border-[1.5px] border-[#E6007E] text-[#E6007E] rounded-xl font-semibold hover:bg-[#fce4ec] transition-all"
                    >
                      Elegir otro metodo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: Order summary */}
          <div>
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Resumen del pedido</h2>

              {/* Mini cart items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0F172A] truncate">{item.product.title}</p>
                      <p className="text-xs text-[#94A3B8]">x{item.quantity}</p>
                    </div>
                    <p className="text-[#0F172A] font-medium ml-3">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E2E8F0] pt-3 space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Subtotal</span>
                  <span className="text-[#0F172A] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Comision SafeDeal (5%)</span>
                  <span className="text-[#0F172A] font-medium">${commission.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#E2E8F0] pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-[#0F172A]">Total</span>
                    <span className="text-xl font-bold text-[#E6007E]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Error display */}
              {error && (
                <div className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              {/* Trust badges */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Proteccion al comprador SafeDeal</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <svg className="w-4 h-4 text-[#E6007E] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Encriptacion SSL de extremo a extremo</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reembolso garantizado en disputas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
