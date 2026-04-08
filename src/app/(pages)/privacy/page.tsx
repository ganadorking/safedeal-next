import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad - SafeDeal",
};

export default function PrivacyPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Política de Privacidad
        </h1>
        <p className="text-[#64748B]">
          Última actualización: 1 de enero de 2026
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Datos que Recopilamos
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Recopilamos información que usted nos proporciona directamente al crear una cuenta, realizar transacciones o comunicarse con nosotros. Esto incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Información de registro: nombre, correo electrónico, contraseña y número de teléfono.</li>
              <li>Información de perfil: foto de perfil, biografía y preferencias de cuenta.</li>
              <li>Información de verificación (KYC): documento de identidad, selfie de verificación y comprobante de domicilio.</li>
              <li>Información de pago: datos de tarjeta de crédito, información bancaria y direcciones de billeteras de criptomonedas.</li>
              <li>Información de transacciones: historial de compras, ventas, disputas y mensajes.</li>
            </ul>
            <p>
              También recopilamos información automáticamente cuando utiliza nuestra plataforma, incluyendo dirección IP, tipo de dispositivo, navegador, sistema operativo, páginas visitadas y tiempo de permanencia.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Uso de Datos
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>Utilizamos su información personal para los siguientes fines:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar, mantener y mejorar nuestros servicios de marketplace y escrow.</li>
              <li>Procesar transacciones y enviar notificaciones relacionadas con sus compras y ventas.</li>
              <li>Verificar su identidad y prevenir fraudes, lavado de dinero y otras actividades ilegales.</li>
              <li>Personalizar su experiencia y mostrar contenido relevante basado en sus preferencias.</li>
              <li>Enviar comunicaciones de marketing, promociones y actualizaciones (con su consentimiento).</li>
              <li>Resolver disputas, solucionar problemas técnicos y hacer cumplir nuestros términos de servicio.</li>
              <li>Cumplir con obligaciones legales y regulatorias aplicables.</li>
            </ul>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Compartir Datos
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              No vendemos su información personal a terceros. Compartimos datos únicamente en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Con otros usuarios:</strong> Información necesaria para completar transacciones (nombre de usuario, calificación, información de envío cuando corresponda).</li>
              <li><strong>Proveedores de servicios:</strong> Compartimos datos con procesadores de pago, servicios de verificación de identidad, proveedores de hosting y herramientas de análisis que nos ayudan a operar la plataforma.</li>
              <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley, orden judicial o autoridad gubernamental competente.</li>
              <li><strong>Protección de derechos:</strong> Cuando sea necesario para proteger los derechos, propiedad o seguridad de SafeDeal, nuestros usuarios u otros.</li>
              <li><strong>Transacciones corporativas:</strong> En caso de fusión, adquisición o venta de activos, sus datos pueden ser transferidos como parte del acuerdo.</li>
            </ul>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Cookies y Tecnologías de Seguimiento
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso de la plataforma y personalizar el contenido. Puede gestionar sus preferencias de cookies en cualquier momento a través de la configuración de su navegador.
            </p>
            <p>
              Para más información sobre las cookies que utilizamos, consulte nuestra{" "}
              <a href="/cookies" className="text-[#4A7CF7] hover:text-[#4A7CF7] underline">
                Política de Cookies
              </a>.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Seguridad
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encriptación SSL/TLS de 256 bits para todas las comunicaciones.</li>
              <li>Cumplimiento con estándares PCI DSS nivel 1 para datos de pago.</li>
              <li>Autenticación de dos factores (2FA) disponible para todas las cuentas.</li>
              <li>Monitoreo continuo de seguridad y detección de intrusiones.</li>
              <li>Acceso restringido a datos personales solo al personal autorizado.</li>
              <li>Auditorías de seguridad regulares realizadas por terceros independientes.</li>
            </ul>
            <p>
              A pesar de nuestros esfuerzos, ningún método de transmisión por Internet es 100% seguro. Si descubre una vulnerabilidad de seguridad, por favor repórtela a security@safedeal.com.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Tus Derechos
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Dependiendo de su jurisdicción, usted puede tener los siguientes derechos sobre sus datos personales:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre usted.</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos personales, sujeto a obligaciones legales de retención.</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y legible por máquina.</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos para fines específicos, como marketing directo.</li>
              <li><strong>Restricción:</strong> Solicitar la limitación del procesamiento de sus datos en determinadas circunstancias.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, envíe un correo a privacy@safedeal.com. Responderemos a su solicitud dentro de los 30 días hábiles.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
