import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

const promoCoupons = [
  {
    id: 1,
    code: "BIENVENIDO10",
    discount: "10%",
    description: "Descuento de bienvenida en tu primera compra",
    minPurchase: 5.0,
    expiresAt: "2026-06-30",
    gradient: "from-[#E6007E] to-[#C5006B]",
    icon: "fa-gift",
  },
  {
    id: 2,
    code: "VERANO2026",
    discount: "15%",
    description: "Oferta de verano en productos seleccionados",
    minPurchase: 10.0,
    expiresAt: "2026-08-31",
    gradient: "from-amber-400 to-orange-500",
    icon: "fa-sun",
  },
  {
    id: 3,
    code: "GAMERDEAL",
    discount: "$5 USD",
    description: "Descuento en juegos y gift cards",
    minPurchase: 20.0,
    expiresAt: "2026-05-15",
    gradient: "from-cyan-500 to-blue-500",
    icon: "fa-gamepad",
  },
  {
    id: 4,
    code: "SAFEDEALPLUS",
    discount: "20%",
    description: "Exclusivo para miembros SafeDeal Plus",
    minPurchase: 0,
    expiresAt: "2026-12-31",
    gradient: "from-emerald-500 to-teal-500",
    icon: "fa-crown",
  },
];

export default async function CouponsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Cupones y Promociones</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Cupones disponibles para usar en tus compras</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promoCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className={`h-2 bg-gradient-to-r ${coupon.gradient}`} />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${coupon.gradient} flex items-center justify-center text-white`}>
                    <i className={`fa-solid ${coupon.icon} text-lg`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{coupon.discount}</p>
                    <p className="text-xs text-[#94A3B8]">de descuento</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#64748B] mb-4">{coupon.description}</p>

              {/* Code + Copy */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-[10px] px-4 py-2.5 text-center">
                  <span className="font-mono text-sm font-bold text-[#E6007E] tracking-wider">{coupon.code}</span>
                </div>
                <button
                  onClick={undefined}
                  data-code={coupon.code}
                  className="shrink-0 w-11 h-11 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white rounded-[10px] flex items-center justify-center hover:shadow-lg hover:shadow-[#E6007E] transition-all"
                  title="Copiar codigo"
                >
                  <i className="fa-solid fa-copy" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                {coupon.minPurchase > 0 ? (
                  <span>Compra minima: ${coupon.minPurchase.toFixed(2)}</span>
                ) : (
                  <span>Sin compra minima</span>
                )}
                <span>
                  Expira: {new Date(coupon.expiresAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to use */}
      <div className="bg-[#fce4ec] border border-[#E6007E]/30 rounded-[14px] p-5">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-2">
          <i className="fa-solid fa-circle-question mr-1.5 text-[#E6007E]" />
          Como usar un cupon
        </h3>
        <ol className="text-sm text-[#64748B] space-y-1.5 list-decimal list-inside">
          <li>Copia el codigo del cupon que deseas usar</li>
          <li>Agrega productos a tu carrito y ve al checkout</li>
          <li>Pega el codigo en el campo &ldquo;Cupon de descuento&rdquo;</li>
          <li>El descuento se aplicara automaticamente a tu total</li>
        </ol>
      </div>
    </div>
  );
}
