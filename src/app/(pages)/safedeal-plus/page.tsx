import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeDeal Plus - SafeDeal",
};

const benefits = [
  {
    title: "Comisión Reducida",
    description: "Solo 3% de comisión por venta en lugar del 5% estándar.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    title: "Insignia Plus",
    description: "Destaca con la insignia exclusiva en tu perfil y listados.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: "Soporte Prioritario",
    description: "Acceso a soporte dedicado con tiempos de respuesta menores a 2 horas.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Listados Destacados",
    description: "Tus productos aparecen primero en los resultados de búsqueda.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: "Análisis Avanzados",
    description: "Dashboard con métricas detalladas de ventas, visitas y conversiones.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
  },
  {
    title: "API Extendida",
    description: "Límites de API ampliados: 120 req/min y 10,000 req/día.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Retiros Rápidos",
    description: "Retiros procesados en menos de 12 horas, incluyendo fines de semana.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    title: "Disputas Prioritarias",
    description: "Resolución de disputas en un máximo de 48 horas.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

const comparison = [
  { feature: "Publicar productos", free: "Ilimitado", plus: "Ilimitado" },
  { feature: "Comisión por venta", free: "5%", plus: "3%" },
  { feature: "Soporte", free: "24-48h", plus: "< 2h" },
  { feature: "Listados destacados", free: "No", plus: "Si" },
  { feature: "Análisis avanzados", free: "Básicos", plus: "Completos" },
  { feature: "API requests/día", free: "1,000", plus: "10,000" },
  { feature: "Tiempo de retiro", free: "1-3 días", plus: "< 12h" },
  { feature: "Resolución de disputas", free: "3-7 días", plus: "< 48h" },
  { feature: "Insignia Plus", free: "No", plus: "Si" },
];

export default function SafeDealPlusPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#4A7CF7] via-[#4A7CF7] to-[#3A65D4] rounded-[14px] p-10 text-center text-white mb-12">
        <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
          SafeDeal Plus
        </div>
        <h1 className="text-[32px] font-bold mb-4">
          Lleva tu Negocio al Siguiente Nivel
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Desbloquea funcionalidades premium, reduce tus comisiones y destaca
          frente a la competencia con SafeDeal Plus.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-8">
        Beneficios Exclusivos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EBF0FF] flex items-center justify-center text-[#4A7CF7] mb-4">
              {benefit.icon}
            </div>
            <h3 className="font-semibold text-[#0F172A] mb-2">
              {benefit.title}
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-8">
        Elige tu Plan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 text-center">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
            Mensual
          </h3>
          <div className="text-4xl font-bold text-[#0F172A] mb-1">
            $9.99
          </div>
          <p className="text-[#64748B] text-sm mb-6">USD / mes</p>
          <a
            href="/checkout?plan=plus-monthly"
            className="block w-full py-3 rounded-xl border-2 border-[#4A7CF7] text-[#4A7CF7] font-semibold hover:bg-[#EBF0FF] transition-colors"
          >
            Empezar Ahora
          </a>
        </div>
        <div className="bg-white border-2 border-[#4A7CF7] rounded-[14px] p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white text-xs font-bold">
            AHORRA 25%
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
            Anual
          </h3>
          <div className="text-4xl font-bold text-[#0F172A] mb-1">
            $89.99
          </div>
          <p className="text-[#64748B] text-sm mb-1">USD / año</p>
          <p className="text-[#4A7CF7] text-sm font-medium mb-6">
            Equivale a $7.50/mes
          </p>
          <a
            href="/checkout?plan=plus-annual"
            className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Empezar Ahora
          </a>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-8">
        Comparación de Planes
      </h2>
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Característica
                </th>
                <th className="text-center px-6 py-3 font-semibold text-[#0F172A]">
                  Gratis
                </th>
                <th className="text-center px-6 py-3 font-semibold text-[#4A7CF7]">
                  Plus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {comparison.map((row) => (
                <tr key={row.feature}>
                  <td className="px-6 py-3 text-[#0F172A]">{row.feature}</td>
                  <td className="px-6 py-3 text-center text-[#64748B]">
                    {row.free}
                  </td>
                  <td className="px-6 py-3 text-center font-medium text-[#4A7CF7]">
                    {row.plus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] rounded-[14px] p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Únete a SafeDeal Plus Hoy
        </h2>
        <p className="text-white/80 mb-6">
          Más de 5,000 vendedores ya disfrutan de los beneficios de SafeDeal
          Plus. Pruébalo gratis por 14 días.
        </p>
        <a
          href="/checkout?plan=plus-trial"
          className="inline-block bg-white text-[#4A7CF7] font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
        >
          Prueba Gratis 14 Días
        </a>
      </div>
    </div>
  );
}
