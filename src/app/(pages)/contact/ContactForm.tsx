"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#0F172A] mb-2">
          Mensaje enviado
        </h3>
        <p className="text-[#64748B]">
          Hemos recibido tu mensaje. Te responderemos en un plazo de 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E2E8F0] rounded-[14px] p-8"
    >
      <h2 className="text-xl font-bold text-[#0F172A] mb-6">
        Envíanos un Mensaje
      </h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-11 px-4 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-11 px-4 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors"
            placeholder="tu@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Asunto
          </label>
          <select
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full h-11 px-4 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] text-[#0F172A] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors"
          >
            <option value="">Selecciona un asunto</option>
            <option value="compras">Problema con una compra</option>
            <option value="ventas">Problema con una venta</option>
            <option value="pagos">Problema con pagos</option>
            <option value="cuenta">Problema con mi cuenta</option>
            <option value="verificacion">Verificación KYC</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Mensaje
          </label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] rounded-[10px] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4A7CF7] focus:ring-2 focus:ring-[#4A7CF7]/10 outline-none transition-colors resize-none"
            placeholder="Describe tu consulta con el mayor detalle posible..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Enviar Mensaje
        </button>
      </div>
    </form>
  );
}
