import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comisiones y Tarifas - SafeDeal",
};

const highlights = [
  {
    value: "0%",
    label: "Para Compradores",
    description: "Compra sin costos adicionales. El precio que ves es el precio que pagas.",
    color: "from-green-400 to-emerald-500",
  },
  {
    value: "5%",
    label: "Comisión Vendedor",
    description: "Solo pagas cuando vendes. Sin costos ocultos ni cuotas mensuales.",
    color: "from-[#E6007E] to-[#C5006B]",
  },
  {
    value: "$0",
    label: "Publicar Productos",
    description: "Lista todos los productos que quieras sin ningún costo de publicación.",
    color: "from-cyan-400 to-blue-500",
  },
];

const feeBreakdown = [
  { concept: "Comisión por venta (estándar)", rate: "5%", notes: "Se deduce del pago al vendedor" },
  { concept: "Comisión por venta (SafeDeal Plus)", rate: "3%", notes: "Para suscriptores Plus" },
  { concept: "Publicar productos", rate: "Gratis", notes: "Sin límite de listados" },
  { concept: "Comisión para compradores", rate: "0%", notes: "Sin cargos adicionales" },
  { concept: "Retiro de fondos (banco)", rate: "Gratis", notes: "1-3 días hábiles" },
  { concept: "Retiro de fondos (PayPal)", rate: "1%", notes: "Mínimo $0.50 USD" },
  { concept: "Retiro de fondos (cripto)", rate: "0.5%", notes: "Red fee incluido" },
  { concept: "Disputa / Mediación", rate: "Gratis", notes: "Sin costo para ambas partes" },
];

const paymentMethods = [
  { method: "Tarjeta de crédito/débito", fee: "2.9% + $0.30", processor: "Stripe" },
  { method: "PayPal", fee: "3.4% + $0.30", processor: "PayPal" },
  { method: "Transferencia bancaria", fee: "1%", processor: "Directo" },
  { method: "Bitcoin (BTC)", fee: "1%", processor: "Red Bitcoin" },
  { method: "Ethereum (ETH)", fee: "1%", processor: "Red Ethereum" },
  { method: "USDT", fee: "0.5%", processor: "Red Tron/Ethereum" },
];

export default function FeesPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#0F172A] mb-4">
          Comisiones y Tarifas
        </h1>
        <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
          Transparencia total en nuestras tarifas. Sin costos ocultos, sin
          sorpresas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 text-center"
          >
            <div
              className={`text-4xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}
            >
              {item.value}
            </div>
            <h3 className="font-semibold text-[#0F172A] mb-2">{item.label}</h3>
            <p className="text-[#64748B] text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden mb-8">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#0F172A]">
            Desglose de Tarifas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Concepto
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Tarifa
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {feeBreakdown.map((fee) => (
                <tr key={fee.concept}>
                  <td className="px-6 py-3 text-[#0F172A]">{fee.concept}</td>
                  <td className="px-6 py-3 font-semibold text-[#E6007E]">
                    {fee.rate}
                  </td>
                  <td className="px-6 py-3 text-[#64748B]">{fee.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#0F172A]">
            Comisiones por Método de Pago
          </h2>
          <p className="text-[#64748B] text-sm mt-1">
            Estas comisiones son cobradas por los procesadores de pago y se
            aplican adicionalmente a la comisión de SafeDeal.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Método de Pago
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Comisión
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[#0F172A]">
                  Procesador
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paymentMethods.map((pm) => (
                <tr key={pm.method}>
                  <td className="px-6 py-3 text-[#0F172A]">{pm.method}</td>
                  <td className="px-6 py-3 font-semibold text-[#E6007E]">
                    {pm.fee}
                  </td>
                  <td className="px-6 py-3 text-[#64748B]">{pm.processor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
