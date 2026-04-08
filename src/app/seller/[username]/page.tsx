import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import prisma from "@/lib/prisma";
import ProductCard, { type CardProduct } from "@/components/product/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const seller = await prisma.user.findUnique({
    where: { username },
    select: { username: true },
  });

  if (!seller) return { title: "Vendedor no encontrado - SafeDeal" };

  return {
    title: `${seller.username} - Vendedor en SafeDeal`,
    description: `Perfil del vendedor ${seller.username} en SafeDeal. Compra productos digitales con confianza.`,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function SellerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const seller = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      rating: true,
      totalSales: true,
      isVerified: true,
      isPlus: true,
      sellerLevel: true,
      successRate: true,
      createdAt: true,
      isSeller: true,
      products: {
        where: { isActive: true, stock: { gt: 0 } },
        orderBy: { salesCount: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  if (!seller || !seller.isSeller) {
    notFound();
  }

  const totalProducts = seller.products.length;

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E6007E] via-[#E6007E] to-[#C5006B] pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Vendedor</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-[rgba(255,255,255,0.3)]">
              {seller.avatarUrl ? (
                <img
                  src={seller.avatarUrl}
                  alt={seller.username}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                seller.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-white">
                  {seller.username}
                </h1>
                {seller.isVerified && (
                  <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {seller.isPlus && (
                  <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-md">
                    PLUS
                  </span>
                )}
              </div>
              {seller.sellerLevel && (
                <p className="text-[rgba(255,255,255,0.7)] text-sm mt-1">
                  Nivel: {seller.sellerLevel}
                </p>
              )}
              <p className="text-[rgba(255,255,255,0.6)] text-xs mt-1">
                Miembro desde{" "}
                {new Date(seller.createdAt).toLocaleDateString("es-MX", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <StarRating rating={Number(seller.rating)} />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">
              {Number(seller.rating).toFixed(1)}
            </p>
            <p className="text-xs text-[#94A3B8]">Calificación</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0F172A]">
              {seller.totalSales}
            </p>
            <p className="text-xs text-[#94A3B8]">Ventas totales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0F172A]">
              {totalProducts}
            </p>
            <p className="text-xs text-[#94A3B8]">Productos activos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Number(seller.successRate).toFixed(0)}%
            </p>
            <p className="text-xs text-[#94A3B8]">Tasa de éxito</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">
          Productos de {seller.username} ({totalProducts})
        </h2>

        {seller.products.length > 0 ? (
          <div className="products-grid">
            {seller.products.map((product) => {
              const normalizedProduct: CardProduct = {
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: Number(product.price),
                originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                mainImage: product.mainImage,
                deliveryType: product.deliveryType,
                salesCount: product.salesCount,
                rating: Number(product.rating),
                reviewCount: product.reviewCount,
                categoryId: product.categoryId,
                shortDescription: product.shortDescription,
                seller: {
                  username: seller.username,
                  isVerified: seller.isVerified,
                  sellerLevel: seller.sellerLevel,
                },
                category: {
                  name: product.category.name,
                  slug: product.category.slug,
                },
              };

              return <ProductCard key={product.id} product={normalizedProduct} />;
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
              Sin productos
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Este vendedor aún no tiene productos activos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
