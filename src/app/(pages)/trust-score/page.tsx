import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust Score - SafeDeal",
};

const factors = [
  {
    name: "Verificación de Identidad",
    weight: 20,
    description:
      "Completar el proceso KYC aporta un impulso significativo a tu puntuación de confianza.",
  },
  {
    name: "Historial de Transacciones",
    weight: 25,
    description:
      "Las transacciones completadas exitosamente aumentan tu score progresivamente.",
  },
  {
    name: "Reseñas y Calificaciones",
    weight: 20,
    description:
      "Las calificaciones positivas de compradores y vendedores mejoran tu perfil.",
  },
  {
    name: "Tiempo de Respuesta",
    weight: 10,
    description:
      "Responder rápido a mensajes y pedidos demuestra compromiso con la comunidad.",
  },
  {
    name: "Disputas Resueltas",
    weight: 15,
    description:
      "Un historial limpio de disputas o disputas resueltas favorablemente contribuyen a tu score.",
  },
  {
    name: "Antigüedad de la Cuenta",
    weight: 10,
    description:
      "Las cuentas más antiguas con actividad constante reciben un bonus de confianza.",
  },
];

const scoreRanges = [
  {
    range: "0 - 29",
    label: "Nuevo",
    color: "bg-gray-400",
    description: "Cuenta nueva o con poca actividad. Funcionalidades básicas disponibles.",
  },
  {
    range: "30 - 49",
    label: "En Desarrollo",
    color: "bg-amber-400",
    description: "Actividad inicial detectada. Aumenta tus transacciones para subir de nivel.",
  },
  {
    range: "50 - 69",
    label: "Confiable",
    color: "bg-blue-400",
    description: "Buen historial de transacciones. Acceso a la mayoría de funcionalidades.",
  },
  {
    range: "70 - 89",
    label: "Destacado",
    color: "bg-green-400",
    description: "Excelente reputación. Mayor visibilidad en la plataforma y beneficios adicionales.",
  },
  {
    range: "90 - 100",
    label: "Elite",
    color: "bg-[#4A7CF7]",
    description: "Los usuarios más confiables de SafeDeal. Acceso completo a todas las funcionalidades premium.",
  },
];

const tips = [
  "Completa la verificación KYC para un impulso inmediato de +20 puntos.",
  "Responde a los mensajes de compradores en menos de 1 hora.",
  "Mantén una tasa de disputas por debajo del 2% de tus transacciones.",
  "Acumula reseñas positivas pidiendo feedback después de cada venta.",
  "Mantén tu cuenta activa con transacciones regulares.",
  "Describe tus productos con precisión para evitar disputas.",
];

export default function TrustScorePage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Trust Score
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          El Trust Score es nuestra métrica de confianza. Mide la reputación de
          cada usuario basándose en su actividad y comportamiento en la
          plataforma.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Factores del Trust Score
      </h2>
      <div className="space-y-4 mb-16">
        {factors.map((factor) => (
          <div
            key={factor.name}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#0F172A]">{factor.name}</h3>
              <span className="text-[#4A7CF7] font-bold text-sm">
                {factor.weight}%
              </span>
            </div>
            <p className="text-[#64748B] text-sm mb-3">{factor.description}</p>
            <div className="w-full h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] rounded-full"
                style={{ width: `${factor.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Rangos de Puntuación
      </h2>
      <div className="space-y-4 mb-16">
        {scoreRanges.map((range) => (
          <div
            key={range.range}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 flex items-center gap-5"
          >
            <div className="flex-shrink-0 text-center w-20">
              <div className={`w-4 h-4 rounded-full ${range.color} mx-auto mb-1`} />
              <span className="text-xs font-mono text-[#64748B]">
                {range.range}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A] mb-1">
                {range.label}
              </h3>
              <p className="text-[#64748B] text-sm">{range.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">
          Consejos para Mejorar tu Trust Score
        </h2>
        <ul className="space-y-3">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-3 text-[#64748B] text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EBF0FF] text-[#4A7CF7] flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
