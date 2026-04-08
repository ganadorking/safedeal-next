import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Funciona - SafeDeal",
};

const steps = [
  {
    number: 1,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Explora",
    description:
      "Navega por miles de productos digitales y físicos. Usa filtros avanzados para encontrar exactamente lo que buscas al mejor precio.",
  },
  {
    number: 2,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Paga con Escrow",
    description:
      "Tu dinero queda protegido en nuestro sistema de escrow. El vendedor no recibe el pago hasta que confirmes que recibiste tu producto.",
  },
  {
    number: 3,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Recibe tu Producto",
    description:
      "Recibe tu producto digital al instante o rastrea tu envío físico. Confirma la recepción y el pago se libera al vendedor.",
  },
];

const features = [
  {
    title: "Entrega Instantánea",
    description: "Los productos digitales se entregan al momento de la compra.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: "Pagos Seguros",
    description: "Todas las transacciones están protegidas con encriptación de extremo a extremo.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: "Soporte 24/7",
    description: "Nuestro equipo está disponible las 24 horas para ayudarte con cualquier problema.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Garantía",
    description: "Si algo sale mal, te devolvemos tu dinero. Sin complicaciones.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Cómo Funciona SafeDeal
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Compra y vende con total confianza. Nuestro sistema de escrow protege
          cada transacción de principio a fin.
        </p>
      </div>

      <div className="grid gap-6 mb-16">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 flex items-start gap-6"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] flex items-center justify-center text-white font-bold text-lg">
              {step.number}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#4A7CF7]">{step.icon}</span>
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  {step.title}
                </h2>
              </div>
              <p className="text-[#64748B] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-8">
        Por qué elegir SafeDeal
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EBF0FF] flex items-center justify-center text-[#4A7CF7] mb-4">
              {feature.icon}
            </div>
            <h3 className="text-[#0F172A] font-semibold mb-2">
              {feature.title}
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] rounded-[14px] p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Empieza a comprar y vender hoy
        </h2>
        <p className="text-white/80 mb-6">
          Únete a miles de usuarios que confían en SafeDeal para sus
          transacciones.
        </p>
        <a
          href="/search"
          className="inline-block bg-white text-[#4A7CF7] font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
        >
          Explorar Productos
        </a>
      </div>
    </div>
  );
}
