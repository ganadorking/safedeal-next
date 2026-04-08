import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio - SafeDeal",
};

export default function TermsPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Términos de Servicio
        </h1>
        <p className="text-[#64748B]">
          Última actualización: 1 de enero de 2026
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            1. Condiciones Generales
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Bienvenido a SafeDeal. Al acceder y utilizar nuestra plataforma, usted acepta estar sujeto a estos Términos de Servicio. SafeDeal es un marketplace que facilita transacciones entre compradores y vendedores mediante un sistema de escrow para proteger ambas partes.
            </p>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al momento de su publicación en la plataforma. Es su responsabilidad revisar periódicamente estos términos. El uso continuado de la plataforma después de cualquier modificación constituye su aceptación de los nuevos términos.
            </p>
            <p>
              SafeDeal actúa únicamente como intermediario entre compradores y vendedores. No somos parte de las transacciones realizadas a través de la plataforma, excepto en lo que respecta al servicio de escrow y mediación de disputas.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            2. Cuentas de Usuario
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Para utilizar SafeDeal, debe crear una cuenta proporcionando información veraz y actualizada. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta.
            </p>
            <p>
              Debe tener al menos 18 años de edad para crear una cuenta. SafeDeal se reserva el derecho de suspender o eliminar cuentas que violen estos términos, proporcionen información falsa, o participen en actividades fraudulentas.
            </p>
            <p>
              Los vendedores que procesen transacciones superiores a $500 USD deberán completar el proceso de verificación de identidad (KYC). La verificación es obligatoria para retiros y ayuda a mantener la seguridad de la plataforma.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            3. Productos y Listados
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Los vendedores son responsables de la exactitud de sus listados, incluyendo descripciones, fotos, precios y condiciones de los productos. Está prohibido publicar productos falsificados, robados, ilegales o que infrinjan derechos de propiedad intelectual.
            </p>
            <p>
              SafeDeal se reserva el derecho de eliminar cualquier listado que viole nuestras políticas sin previo aviso. Los productos digitales deben cumplir con las leyes de derechos de autor aplicables. Los vendedores garantizan que tienen los derechos necesarios para vender los productos listados.
            </p>
            <p>
              Categorías prohibidas incluyen, pero no se limitan a: armas, sustancias controladas, información personal de terceros, software malicioso, y cualquier producto o servicio que viole leyes locales o internacionales.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            4. Pagos y Escrow
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Todas las transacciones en SafeDeal se procesan a través de nuestro sistema de escrow. Cuando un comprador realiza un pago, los fondos se retienen de forma segura hasta que el producto sea entregado y el comprador confirme la recepción satisfactoria.
            </p>
            <p>
              SafeDeal cobra una comisión del 5% sobre el precio de venta, que se deduce del pago al vendedor. No se cobran comisiones a los compradores. Los vendedores con suscripción SafeDeal Plus disfrutan de una comisión reducida del 3%.
            </p>
            <p>
              Los fondos se liberan al vendedor automáticamente cuando el comprador confirma la recepción, o después de 14 días si el comprador no reporta ningún problema. En caso de disputa, los fondos permanecen en escrow hasta la resolución.
            </p>
            <p>
              Los reembolsos se procesan en un plazo de 5-10 días hábiles, dependiendo del método de pago original. SafeDeal no es responsable de las comisiones cobradas por los procesadores de pago externos.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            5. Disputas y Resolución
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              Cualquiera de las partes puede abrir una disputa dentro de los 14 días posteriores a la entrega del producto. Las disputas se gestionan a través de nuestro sistema de mediación, donde ambas partes pueden presentar evidencia.
            </p>
            <p>
              SafeDeal actuará como mediador imparcial. Nuestras decisiones se basan en la evidencia presentada, las políticas de la plataforma y las leyes aplicables. Las decisiones de mediación son vinculantes, aunque pueden ser apeladas dentro de los 7 días siguientes.
            </p>
            <p>
              En caso de fraude comprobado, SafeDeal tomará medidas inmediatas, incluyendo el reembolso al comprador, la suspensión de la cuenta del vendedor y, si corresponde, la notificación a las autoridades competentes.
            </p>
          </div>
        </section>

        <section className="bg-white border border-[#E2E8F0] rounded-[14px] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            6. Limitación de Responsabilidad
          </h2>
          <div className="text-[#64748B] leading-relaxed space-y-4 text-sm">
            <p>
              SafeDeal proporciona la plataforma &quot;tal como está&quot; y no garantiza la disponibilidad ininterrumpida del servicio. No somos responsables de las acciones de los usuarios, la calidad de los productos vendidos, ni los daños indirectos que puedan surgir del uso de la plataforma.
            </p>
            <p>
              Nuestra responsabilidad máxima en cualquier reclamación está limitada al monto de las comisiones pagadas por el usuario en los últimos 12 meses. Esta limitación no aplica en casos de negligencia grave o conducta intencional por parte de SafeDeal.
            </p>
            <p>
              Los usuarios indemnizan a SafeDeal contra cualquier reclamación de terceros derivada del uso de la plataforma, la violación de estos términos o la infracción de derechos de terceros.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
