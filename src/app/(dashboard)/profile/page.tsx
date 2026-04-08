import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const stats = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      totalPurchases: true,
      totalSales: true,
      rating: true,
      balance: true,
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Mi Perfil</h1>

      {/* Profile Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E6007E] to-[#C5006B] flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#0F172A]">{user.username}</h2>
            <p className="text-[#64748B]">{user.email}</p>
            <p className="text-sm text-[#94A3B8] mt-1">
              <i className="fa-solid fa-calendar-days mr-1.5" />
              Miembro desde {new Date(user.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long" })}
            </p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  <i className="fa-solid fa-circle-check text-[10px]" /> Verificado
                </span>
              )}
              {user.isSeller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce4ec] text-[#C5006B]">
                  <i className="fa-solid fa-store text-[10px]" /> Vendedor
                </span>
              )}
              {user.isPlus && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                  <i className="fa-solid fa-crown text-[10px]" /> Plus
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <i className="fa-solid fa-shopping-bag text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F172A]">{stats?.totalPurchases ?? 0}</p>
              <p className="text-xs text-[#94A3B8]">Compras</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F172A]">{stats?.totalSales ?? 0}</p>
              <p className="text-xs text-[#94A3B8]">Ventas</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <i className="fa-solid fa-star text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F172A]">{Number(stats?.rating ?? 0).toFixed(1)}</p>
              <p className="text-xs text-[#94A3B8]">Calificacion</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fce4ec] flex items-center justify-center">
              <i className="fa-solid fa-wallet text-[#E6007E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E6007E]">${Number(stats?.balance ?? 0).toFixed(2)}</p>
              <p className="text-xs text-[#94A3B8]">Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6">
        <h3 className="text-lg font-semibold text-[#0F172A] mb-5">Editar Informacion</h3>
        <form action="/api/me" method="POST" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">Nombre</label>
              <input
                type="text"
                name="firstName"
                defaultValue={user.firstName ?? ""}
                placeholder="Tu nombre"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">Apellido</label>
              <input
                type="text"
                name="lastName"
                defaultValue={user.lastName ?? ""}
                placeholder="Tu apellido"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">Telefono</label>
              <input
                type="tel"
                name="phone"
                defaultValue={user.phone ?? ""}
                placeholder="+52 123 456 7890"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">Pais</label>
              <select
                name="countryCode"
                defaultValue={user.countryCode}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] h-11 px-4 text-sm text-[#0F172A] focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/10 outline-none transition-colors"
              >
                <option value="MX">Mexico</option>
                <option value="CO">Colombia</option>
                <option value="AR">Argentina</option>
                <option value="CL">Chile</option>
                <option value="PE">Peru</option>
                <option value="EC">Ecuador</option>
                <option value="US">Estados Unidos</option>
                <option value="ES">Espana</option>
                <option value="BR">Brasil</option>
              </select>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#E6007E] transition-all text-sm"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
