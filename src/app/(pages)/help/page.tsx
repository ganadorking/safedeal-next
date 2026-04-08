import type { Metadata } from "next";
import HelpAccordion from "./HelpAccordion";

export const metadata: Metadata = {
  title: "Centro de Ayuda - SafeDeal",
};

const faqSections = [
  {
    title: "Compras",
    items: [
      {
        question: "¿Cómo puedo comprar un producto?",
        answer:
          "Para comprar un producto, navega por el catálogo o usa la barra de búsqueda. Una vez que encuentres lo que buscas, haz clic en \"Agregar al carrito\" y luego procede al checkout. Elige tu método de pago y confirma la compra. Tu dinero quedará en escrow hasta que confirmes la recepción.",
      },
      {
        question: "¿Qué métodos de pago aceptan?",
        answer:
          "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, transferencias bancarias y criptomonedas (Bitcoin, Ethereum, USDT). Todos los pagos están protegidos con encriptación de extremo a extremo.",
      },
      {
        question: "¿Cuánto tiempo tarda la entrega de productos digitales?",
        answer:
          "Los productos digitales se entregan de forma instantánea después de confirmar el pago. Recibirás acceso inmediato al producto en tu panel de compras y también por correo electrónico.",
      },
      {
        question: "¿Puedo cancelar una compra?",
        answer:
          "Puedes solicitar la cancelación mientras el pedido esté en estado \"Pendiente\". Si el vendedor ya envió el producto o entregó el archivo digital, deberás abrir una disputa. Para productos digitales ya entregados, la cancelación queda a criterio del vendedor.",
      },
      {
        question: "¿Cómo sé si un vendedor es confiable?",
        answer:
          "Cada vendedor tiene un Trust Score basado en su historial de transacciones, verificaciones y reseñas. Busca vendedores con la insignia de verificado y un Trust Score alto. También puedes leer las reseñas de otros compradores.",
      },
    ],
  },
  {
    title: "Ventas",
    items: [
      {
        question: "¿Cómo empiezo a vender?",
        answer:
          "Para empezar a vender, ve a tu panel y selecciona \"Crear Producto\". Completa la información del producto incluyendo fotos, descripción, precio y categoría. Para productos digitales, sube los archivos. Tu listado estará visible después de una breve revisión.",
      },
      {
        question: "¿Cuánto cobra SafeDeal de comisión?",
        answer:
          "SafeDeal cobra una comisión del 5% sobre cada venta completada. No hay costos de publicación ni cuotas mensuales obligatorias. Los vendedores SafeDeal Plus tienen una comisión reducida del 3%.",
      },
      {
        question: "¿Cuándo recibo el dinero de mis ventas?",
        answer:
          "El pago se libera automáticamente cuando el comprador confirma la recepción del producto. Para productos digitales, esto suele ser inmediato. Los fondos están disponibles para retiro en 24-48 horas hábiles.",
      },
      {
        question: "¿Qué hago si un comprador abre una disputa?",
        answer:
          "Cuando se abre una disputa, recibirás una notificación. Tienes 72 horas para responder con evidencia. Nuestro equipo de mediación revisará ambas partes y tomará una decisión justa. Mantén siempre registros de tus envíos y comunicaciones.",
      },
    ],
  },
  {
    title: "Pagos",
    items: [
      {
        question: "¿Qué es el sistema de escrow?",
        answer:
          "El escrow es un sistema de protección donde el dinero del comprador se retiene de forma segura hasta que el producto sea entregado y confirmado. Esto protege tanto al comprador como al vendedor contra fraudes.",
      },
      {
        question: "¿Cómo retiro mis fondos?",
        answer:
          "Ve a tu panel de vendedor y selecciona \"Retirar fondos\". Puedes retirar a tu cuenta bancaria, PayPal o billetera de criptomonedas. El monto mínimo de retiro es de $10 USD. Los retiros se procesan en 1-3 días hábiles.",
      },
      {
        question: "¿Es seguro ingresar mis datos de pago?",
        answer:
          "Sí, utilizamos encriptación SSL/TLS de 256 bits y cumplimos con los estándares PCI DSS nivel 1. Nunca almacenamos los datos completos de tu tarjeta. Todos los pagos se procesan a través de proveedores certificados.",
      },
      {
        question: "¿Puedo pagar con criptomonedas?",
        answer:
          "Sí, aceptamos Bitcoin (BTC), Ethereum (ETH), USDT y otras criptomonedas principales. Los pagos con cripto tienen una comisión reducida del 1%. La conversión se realiza al tipo de cambio del momento.",
      },
    ],
  },
  {
    title: "Disputas",
    items: [
      {
        question: "¿Cómo abro una disputa?",
        answer:
          "Ve a tu historial de pedidos, selecciona la transacción en cuestión y haz clic en \"Abrir disputa\". Describe el problema detalladamente y adjunta evidencia (capturas de pantalla, fotos, etc.). Nuestro equipo revisará tu caso.",
      },
      {
        question: "¿Cuánto tiempo tarda la resolución de una disputa?",
        answer:
          "La mayoría de las disputas se resuelven en 3-7 días hábiles. Casos complejos pueden tomar hasta 14 días. Recibirás actualizaciones por correo electrónico durante todo el proceso.",
      },
      {
        question: "¿Qué pasa con mi dinero durante una disputa?",
        answer:
          "El dinero permanece en escrow durante toda la disputa. No se libera al vendedor hasta que se resuelva. Si la resolución es a tu favor, recibirás un reembolso completo.",
      },
      {
        question: "¿Puedo apelar una decisión de disputa?",
        answer:
          "Sí, tienes 7 días después de la resolución para apelar. Proporciona evidencia adicional que respalde tu caso. La apelación será revisada por un equipo diferente al que tomó la decisión original.",
      },
      {
        question: "¿Qué razones son válidas para una disputa?",
        answer:
          "Las razones válidas incluyen: producto no recibido, producto significativamente diferente a la descripción, producto defectuoso, producto falsificado, y entrega incompleta. Las disputas por arrepentimiento de compra no son válidas.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Centro de Ayuda
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Encuentra respuestas a las preguntas más frecuentes sobre SafeDeal.
          Si no encuentras lo que buscas, no dudes en contactarnos.
        </p>
      </div>

      <HelpAccordion sections={faqSections} />

      <div className="mt-12 bg-white border border-[#E2E8F0] rounded-[14px] p-8 text-center">
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
          ¿No encontraste lo que buscabas?
        </h2>
        <p className="text-[#64748B] mb-6">
          Nuestro equipo de soporte está disponible 24/7 para ayudarte.
        </p>
        <a
          href="/contact"
          className="inline-block bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Contactar Soporte
        </a>
      </div>
    </div>
  );
}
