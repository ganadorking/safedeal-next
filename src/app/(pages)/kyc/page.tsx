import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificación KYC - SafeDeal",
};

const steps = [
  {
    number: 1,
    title: "Sube tu Documento de Identidad",
    description:
      "Toma una foto clara de tu documento de identidad oficial (INE, pasaporte o licencia de conducir). Asegúrate de que el texto sea legible y la foto esté bien iluminada.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Selfie de Verificación",
    description:
      "Tómate una selfie sosteniendo tu documento de identidad junto a tu rostro. Esto nos permite confirmar que el documento te pertenece.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Espera la Revisión",
    description:
      "Nuestro equipo revisará tu documentación en un plazo de 24-48 horas. Recibirás una notificación por correo electrónico cuando el proceso se complete.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

const verificationBenefits = [
  "Mayor confianza de compradores y vendedores",
  "Acceso a transacciones de mayor valor",
  "Retiros de fondos más rápidos",
  "Insignia de verificado en tu perfil",
  "Prioridad en resolución de disputas",
  "Trust Score mejorado automáticamente",
];

export default function KYCPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Verificación de Identidad (KYC)
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Verifica tu identidad para desbloquear todas las funcionalidades de
          SafeDeal y aumentar la confianza en tu perfil.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-[#0F172A]">Estado de Verificación</h2>
            <p className="text-amber-500 font-medium text-sm">
              Pendiente de verificación
            </p>
          </div>
        </div>
        <p className="text-[#64748B] text-sm">
          Tu cuenta aún no ha sido verificada. Completa el proceso de KYC para
          desbloquear todas las funcionalidades de la plataforma.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Proceso de Verificación
      </h2>
      <div className="space-y-6 mb-12">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 flex items-start gap-6"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#E6007E] to-[#C5006B] flex items-center justify-center text-white font-bold text-lg">
              {step.number}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#E6007E]">{step.icon}</span>
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {step.title}
                </h3>
              </div>
              <p className="text-[#64748B] text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 mb-12">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">
          Beneficios de la Verificación
        </h2>
        <ul className="space-y-3">
          {verificationBenefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-[#64748B] text-sm">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <a
          href="/dashboard/kyc"
          className="inline-block bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg"
        >
          Iniciar Verificación
        </a>
        <p className="text-[#94A3B8] text-sm mt-4">
          El proceso toma menos de 5 minutos
        </p>
      </div>
    </div>
  );
}
