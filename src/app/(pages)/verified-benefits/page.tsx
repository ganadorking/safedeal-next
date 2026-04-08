import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beneficios de Verificación - SafeDeal",
};

const benefits = [
  {
    title: "Insignia de Verificado",
    description:
      "Obtén la insignia de verificado que se muestra en tu perfil y en todos tus listados. Los compradores confían más en vendedores verificados.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    title: "Trust Score +20",
    description:
      "La verificación KYC incrementa tu Trust Score automáticamente en 20 puntos, mejorando tu visibilidad y credibilidad en la plataforma.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Transacciones de Alto Valor",
    description:
      "Accede a transacciones superiores a $500 USD. Los usuarios verificados pueden comprar y vender sin límites de monto.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Retiros Prioritarios",
    description:
      "Los fondos de usuarios verificados se procesan con prioridad. Retiros disponibles en 12-24 horas en lugar de 1-3 días hábiles.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: "Disputas con Prioridad",
    description:
      "En caso de disputa, los usuarios verificados reciben atención prioritaria con resolución en un máximo de 48 horas.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Mayor Visibilidad",
    description:
      "Los listados de vendedores verificados aparecen más arriba en los resultados de búsqueda y con un indicador de confianza.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

const comparison = [
  { feature: "Trust Score máximo", unverified: "80", verified: "100" },
  { feature: "Límite de transacción", unverified: "$500", verified: "Ilimitado" },
  { feature: "Tiempo de retiro", unverified: "1-3 días", verified: "12-24 horas" },
  { feature: "Resolución de disputas", unverified: "3-7 días", verified: "< 48 horas" },
  { feature: "Insignia de verificado", unverified: "No", verified: "Si" },
  { feature: "Prioridad en búsqueda", unverified: "Normal", verified: "Alta" },
  { feature: "Soporte prioritario", unverified: "No", verified: "Si" },
];

export default function VerifiedBenefitsPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Beneficios de la Verificación
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Los usuarios verificados disfrutan de beneficios exclusivos que
          mejoran su experiencia y aumentan su éxito en SafeDeal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6"
          >
            <div className="w-12 h-12 rounded-lg bg-[#EBF0FF] flex items-center justify-center text-[#4A7CF7] mb-4">
              {benefit.icon}
            </div>
            <h3 className="font-semibold text-[#0F172A] mb-2 text-lg">
              {benefit.title}
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-8">
        Comparación: Verificado vs No Verificado
      </h2>
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Característica
                </th>
                <th className="text-center px-6 py-3 font-semibold text-[#64748B]">
                  Sin Verificar
                </th>
                <th className="text-center px-6 py-3 font-semibold text-[#4A7CF7]">
                  Verificado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {comparison.map((row) => (
                <tr key={row.feature}>
                  <td className="px-6 py-3 text-[#0F172A]">{row.feature}</td>
                  <td className="px-6 py-3 text-center text-[#64748B]">
                    {row.unverified}
                  </td>
                  <td className="px-6 py-3 text-center font-medium text-[#4A7CF7]">
                    {row.verified}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] rounded-[14px] p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Verifica tu Cuenta Ahora
        </h2>
        <p className="text-white/80 mb-6">
          El proceso toma menos de 5 minutos y desbloquea todos estos
          beneficios de inmediato.
        </p>
        <a
          href="/kyc"
          className="inline-block bg-white text-[#4A7CF7] font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
        >
          Iniciar Verificación KYC
        </a>
      </div>
    </div>
  );
}
