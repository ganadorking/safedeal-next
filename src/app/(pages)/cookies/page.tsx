import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies - SafeDeal",
};

const cookieTypes = [
  {
    type: "Esenciales",
    description:
      "Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.",
    cookies: [
      {
        name: "session_id",
        purpose: "Mantener la sesión del usuario activa",
        duration: "Sesión",
      },
      {
        name: "csrf_token",
        purpose: "Protección contra ataques CSRF",
        duration: "Sesión",
      },
      {
        name: "cookie_consent",
        purpose: "Recordar las preferencias de cookies del usuario",
        duration: "1 año",
      },
      {
        name: "auth_token",
        purpose: "Autenticación del usuario",
        duration: "30 días",
      },
    ],
  },
  {
    type: "Funcionales",
    description:
      "Mejoran la funcionalidad del sitio recordando preferencias del usuario.",
    cookies: [
      {
        name: "lang",
        purpose: "Preferencia de idioma del usuario",
        duration: "1 año",
      },
      {
        name: "theme",
        purpose: "Preferencia de tema (claro/oscuro)",
        duration: "1 año",
      },
      {
        name: "recent_searches",
        purpose: "Almacenar búsquedas recientes",
        duration: "90 días",
      },
      {
        name: "cart_items",
        purpose: "Mantener los productos del carrito",
        duration: "30 días",
      },
    ],
  },
  {
    type: "Analíticas",
    description:
      "Nos ayudan a entender cómo los usuarios interactúan con el sitio para mejorarlo.",
    cookies: [
      {
        name: "_ga",
        purpose: "Identificación de usuarios únicos (Google Analytics)",
        duration: "2 años",
      },
      {
        name: "_gid",
        purpose: "Identificación de sesión (Google Analytics)",
        duration: "24 horas",
      },
      {
        name: "_sd_analytics",
        purpose: "Análisis interno de uso de la plataforma",
        duration: "1 año",
      },
      {
        name: "performance_id",
        purpose: "Medición de rendimiento de la plataforma",
        duration: "30 días",
      },
    ],
  },
];

export default function CookiesPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Política de Cookies
        </h1>
        <p className="text-[#64748B]">
          Última actualización: 1 de enero de 2026
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 mb-8">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">
          ¿Qué son las cookies?
        </h2>
        <p className="text-[#64748B] text-sm leading-relaxed">
          Las cookies son pequeños archivos de texto que se almacenan en su
          dispositivo cuando visita un sitio web. Se utilizan ampliamente para
          hacer que los sitios funcionen correctamente, mejorar la experiencia
          del usuario y proporcionar información a los propietarios del sitio.
          SafeDeal utiliza cookies para garantizar el funcionamiento seguro de
          la plataforma, recordar sus preferencias y mejorar nuestros servicios.
        </p>
      </div>

      <div className="space-y-8">
        {cookieTypes.map((category) => (
          <div key={category.type}>
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden">
              <div className="p-6 border-b border-[#E2E8F0]">
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                  Cookies {category.type}
                </h2>
                <p className="text-[#64748B] text-sm">{category.description}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                        Cookie
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                        Propósito
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {category.cookies.map((cookie) => (
                      <tr key={cookie.name}>
                        <td className="px-6 py-3 font-mono text-[#E6007E] text-xs">
                          {cookie.name}
                        </td>
                        <td className="px-6 py-3 text-[#64748B]">
                          {cookie.purpose}
                        </td>
                        <td className="px-6 py-3 text-[#64748B] whitespace-nowrap">
                          {cookie.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 mt-8">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">
          Cómo gestionar las cookies
        </h2>
        <div className="text-[#64748B] text-sm leading-relaxed space-y-4">
          <p>
            Puede controlar y gestionar las cookies de varias formas. Tenga en
            cuenta que eliminar o bloquear cookies puede afectar su experiencia
            en SafeDeal y es posible que algunas funcionalidades no estén
            disponibles.
          </p>
          <p>
            La mayoría de los navegadores le permiten ver, gestionar, eliminar y
            bloquear cookies desde la configuración. Consulte la ayuda de su
            navegador para obtener instrucciones específicas. También puede
            configurar su navegador para que le notifique cuando se establezca
            una cookie.
          </p>
          <p>
            Para desactivar las cookies analíticas de Google, puede instalar el{" "}
            <span className="text-[#E6007E]">
              complemento de inhabilitación de Google Analytics
            </span>{" "}
            en su navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
