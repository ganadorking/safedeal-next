import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { getProductImageUrl, calculateDiscount } from "@/lib/utils";

export default async function FavoritesPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          originalPrice: true,
          mainImage: true,
          rating: true,
          reviewCount: true,
          seller: { select: { username: true } },
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0F172A]">Mis Favoritos</h1>
        <span className="text-sm text-[#94A3B8]">{favorites.length} productos</span>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#fce4ec] flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-heart text-2xl text-[#E6007E]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Sin favoritos aun</h3>
          <p className="text-sm text-[#94A3B8] mb-4">Guarda los productos que te interesan para verlos despues</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E6007E] to-[#C5006B] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#E6007E] transition-all"
          >
            <i className="fa-solid fa-compass" /> Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((fav) => {
            const product = fav.product;
            const discount = product.originalPrice
              ? calculateDiscount(Number(product.originalPrice), Number(product.price))
              : 0;
            return (
              <Link
                key={fav.id}
                href={`/product/${product.slug}`}
                className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden"
              >
                <div className="relative aspect-[3/4] bg-[#F8FAFC]">
                  <img
                    src={getProductImageUrl(product.mainImage, product.title)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                      -{discount}%
                    </span>
                  )}
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg">No disponible</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-heart text-[#E6007E] text-sm" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#94A3B8] mb-0.5">{product.seller.username}</p>
                  <h3 className="text-sm font-medium text-[#0F172A] line-clamp-2 mb-2 leading-snug">{product.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star text-[10px] ${i < Math.round(Number(product.rating)) ? "text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                    <span className="text-[11px] text-[#94A3B8] ml-1">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#E6007E]">${Number(product.price).toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#94A3B8] line-through">${Number(product.originalPrice).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
