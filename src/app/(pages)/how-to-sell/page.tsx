import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Vender - SafeDeal",
};

const requirements = [
  "Cuenta verificada con correo electrónico confirmado",
  "Completar verificación KYC para montos superiores a $500",
  "Aceptar los términos y condiciones de vendedor",
  "Proporcionar método de pago para recibir fondos",
];

const steps = [
  {
    number: 1,
    title: "Configura tu Perfil de Vendedor",
    description:
      "Completa tu perfil con una foto, descripción y datos de contacto. Verifica tu identidad para obtener la insignia de vendedor verificado y aumentar la confianza de los compradores.",
  },
  {
    number: 2,
    title: "Publica tu Producto",
    description:
      "Crea un listado con fotos de alta calidad, una descripción detallada, precio competitivo y la categoría correcta. Para productos digitales, sube los archivos directamente.",
  },
  {
    number: 3,
    title: "Gestiona tus Pedidos",
    description:
      "Cuando un comprador realice una compra, recibirás una notificación. Para productos digitales, la entrega es automática. Para productos físicos, empaca y envía dentro de las 48 horas.",
  },
  {
    number: 4,
    title: "Espera la Confirmación",
    description:
      "El comprador revisa el producto y confirma la recepción. Para productos digitales, esto suele ser inmediato. Para físicos, el comprador tiene hasta 7 días para confirmar.",
  },
  {
    number: 5,
    title: "Recibe tu Pago",
    description:
      "Una vez confirmada la recepción, el pago se libera automáticamente a tu cuenta. Los fondos estarán disponibles para retiro en 24-48 horas hábiles.",
  },
];

const tips = [
  {
    title: "Fotos de calidad",
    description:
      "Usa imágenes claras y de alta resolución. Los listados con buenas fotos venden hasta 3 veces más.",
  },
  {
    title: "Precios competitivos",
    description:
      "Investiga los precios del mercado. Un precio justo atrae más compradores y genera mejores reseñas.",
  },
  {
    title: "Responde rápido",
    description:
      "Los vendedores que responden en menos de 1 hora tienen un 70% más de probabilidad de cerrar la venta.",
  },
  {
    title: "Descripciones detalladas",
    description:
      "Incluye todas las especificaciones, condiciones y detalles relevantes. La transparencia genera confianza.",
  },
  {
    title: "Mantén tu reputación",
    description:
      "Cada transacción exitosa mejora tu Trust Score. Un puntaje alto te da mayor visibilidad en la plataforma.",
  },
  {
    title: "Ofertas y descuentos",
    description:
      "Usa las herramientas de promoción de SafeDeal para crear ofertas especiales y atraer más compradores.",
  },
];

export default function HowToSellPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Cómo Vender en SafeDeal
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Empieza a vender tus productos en minutos. SafeDeal te ofrece todas
          las herramientas para gestionar tu negocio de forma segura.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 mb-12">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">
          Requisitos para Vender
        </h2>
        <ul className="space-y-3">
          {requirements.map((req) => (
            <li key={req} className="flex items-center gap-3 text-[#64748B]">
              <span className="w-5 h-5 rounded-full bg-[#fce4ec] text-[#E6007E] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Proceso de Venta en 5 Pasos
      </h2>
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
        Consejos para el Éxito
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6"
          >
            <h3 className="font-semibold text-[#0F172A] mb-2">{tip.title}</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
