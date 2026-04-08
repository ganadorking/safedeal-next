import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Comprar - SafeDeal",
};

const steps = [
  {
    number: 1,
    title: "Crea tu Cuenta",
    description:
      "Regístrate gratis con tu correo electrónico o cuenta de Google. Completa tu perfil para generar confianza con los vendedores.",
  },
  {
    number: 2,
    title: "Encuentra tu Producto",
    description:
      "Usa la barra de búsqueda, navega por categorías o explora las ofertas destacadas. Filtra por precio, calificación y tipo de entrega.",
  },
  {
    number: 3,
    title: "Revisa los Detalles",
    description:
      "Lee la descripción completa del producto, revisa las fotos, verifica la reputación del vendedor y lee las reseñas de otros compradores.",
  },
  {
    number: 4,
    title: "Realiza el Pago",
    description:
      "Agrega el producto al carrito y procede al pago. Elige tu método de pago preferido. Tu dinero queda protegido en escrow hasta que confirmes la recepción.",
  },
  {
    number: 5,
    title: "Confirma la Recepción",
    description:
      "Para productos digitales, recibirás el acceso inmediatamente. Para productos físicos, confirma cuando llegue tu paquete. El pago se libera al vendedor después de tu confirmación.",
  },
];

const tips = [
  {
    title: "Revisa el perfil del vendedor",
    description:
      "Verifica el Trust Score, la cantidad de ventas exitosas y las reseñas de otros compradores antes de comprar.",
  },
  {
    title: "Lee la descripción completa",
    description:
      "Asegúrate de entender exactamente qué estás comprando, incluyendo cualquier condición o restricción del producto.",
  },
  {
    title: "Usa el chat interno",
    description:
      "Si tienes dudas, comunícate con el vendedor a través del chat de SafeDeal antes de realizar la compra.",
  },
  {
    title: "No confirmes antes de tiempo",
    description:
      "No confirmes la recepción hasta que hayas verificado que el producto está en perfectas condiciones y cumple con lo descrito.",
  },
  {
    title: "Guarda tus comprobantes",
    description:
      "Mantén un registro de tus transacciones y comunicaciones por si necesitas abrir una disputa.",
  },
];

export default function HowToBuyPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Cómo Comprar en SafeDeal
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Comprar en SafeDeal es fácil y seguro. Sigue estos pasos para
          realizar tu primera compra con total confianza.
        </p>
      </div>

      <div className="space-y-6 mb-16">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 flex items-start gap-6"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#E6007E] to-[#C5006B] flex items-center justify-center text-white font-bold text-lg">
              {step.number}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A] mb-2">
                {step.title}
              </h2>
              <p className="text-[#64748B] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Consejos para Compradores
      </h2>
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
        <ul className="space-y-6">
          {tips.map((tip) => (
            <li key={tip.title} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-1">
                  {tip.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
