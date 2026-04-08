import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function MyProductsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      mainImage: true,
      stock: true,
      salesCount: true,
      isActive: true,
      viewCount: true,
      rating: true,
      reviewCount: true,
      createdAt: true,
      category: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Mis Productos</h1>
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all"
        >
          <i className="fa-solid fa-plus" /> Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-box-open text-2xl text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin productos</h3>
          <p className="text-sm text-[#94A3B8] mb-4">Publica tu primer producto y comienza a vender</p>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4A7CF7] to-[#3A65D4] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#4A7CF7] transition-all"
          >
            <i className="fa-solid fa-plus" /> Publicar Producto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E2E8F0] rounded-[14px] p-4"
            >
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0 overflow-hidden">
                  {product.mainImage ? (
                    <img src={product.mainImage} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <i className="fa-solid fa-box text-[#4A7CF7] text-lg" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#0F172A] truncate">{product.title}</h3>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{product.category.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {product.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-base font-bold text-[#4A7CF7]">${Number(product.price).toFixed(2)}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                      <i className="fa-solid fa-box-open text-[10px]" /> Stock: {product.stock}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                      <i className="fa-solid fa-cart-shopping text-[10px]" /> {product.salesCount} vendidos
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                      <i className="fa-solid fa-eye text-[10px]" /> {product.viewCount} vistas
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                      <i className="fa-solid fa-star text-amber-400 text-[10px]" /> {Number(product.rating).toFixed(1)} ({product.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/sell/${product.id}/edit`}
                    className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#4A7CF7] hover:bg-[#fce4ec] transition-colors"
                    title="Editar"
                  >
                    <i className="fa-solid fa-pen text-sm" />
                  </Link>
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#fce4ec] hover:text-[#4A7CF7] transition-colors"
                    title="Ver"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
