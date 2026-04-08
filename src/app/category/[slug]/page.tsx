import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CATEGORY_META } from "@/lib/constants";
import ProductCard, { type CardProduct } from "@/components/product/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) return { title: "Categoria no encontrada - SafeDeal" };

  return {
    title: `${category.name} - SafeDeal`,
    description: category.description || `Compra ${category.name} en SafeDeal`,
  };
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mas recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "bestsellers", label: "Mas vendidos" },
  { value: "rating", label: "Mejor calificados" },
];

const ITEMS_PER_PAGE = 20;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  const currentPage = Math.max(1, parseInt(sp.page || "1"));
  const sort = sp.sort || "newest";

  let orderBy: Record<string, string>;
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "bestsellers":
      orderBy = { salesCount: "desc" };
      break;
    case "rating":
      orderBy = { rating: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const where = {
    categoryId: category.id,
    isActive: true,
    stock: { gt: 0 },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            rating: true,
            isVerified: true,
            sellerLevel: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const meta = CATEGORY_META[category.id];
  const bannerBg = meta?.cardGradient || "linear-gradient(135deg, #E6007E, #C5006B)";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Banner */}
      <div style={{ background: bannerBg, padding: "48px 0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            {category.icon && (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <i className={category.icon} />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{category.name}</h1>
              {category.description && (
                <p className="text-white/80 text-sm mt-1 max-w-xl">
                  {category.description}
                </p>
              )}
              <p className="text-white/60 text-sm mt-1">
                {total} producto{total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sort info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: "#64748B" }}>
            Mostrando {products.length} de {total} productos
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "#94A3B8" }}>Ordenar por:</span>
            <div className="relative">
              <select
                defaultValue={sort}
                className="appearance-none rounded-[10px] h-10 pl-3 pr-8 text-sm focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#0F172A",
                }}
                disabled
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sort links (server-side friendly) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/category/${slug}?sort=${opt.value}`}
              className={`px-4 py-2 rounded-[10px] text-sm font-medium ${
                sort === opt.value
                  ? "text-white"
                  : ""
              }`}
              style={
                sort === opt.value
                  ? {
                      background: "linear-gradient(to right, #E6007E, #C5006B)",
                      boxShadow: "0 4px 6px rgba(230, 0, 126, 0.2)",
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      color: "#64748B",
                    }
              }
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => {
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
                  username: product.seller.username,
                  isVerified: product.seller.isVerified,
                  sellerLevel: product.seller.sellerLevel,
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
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <svg className="w-10 h-10" style={{ color: "#94A3B8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>No hay productos</h3>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              Aun no hay productos en esta categoria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {currentPage > 1 && (
              <Link
                href={`/category/${slug}?sort=${sort}&page=${currentPage - 1}`}
                className="px-4 py-2 rounded-[10px] text-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#64748B",
                }}
              >
                Anterior
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 2
              )
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1" style={{ color: "#94A3B8" }}>...</span>
                  )}
                  <Link
                    href={`/category/${slug}?sort=${sort}&page=${p}`}
                    className={`w-10 h-10 inline-flex items-center justify-center rounded-[10px] text-sm font-medium ${
                      p === currentPage ? "text-white" : ""
                    }`}
                    style={
                      p === currentPage
                        ? {
                            background: "linear-gradient(to right, #E6007E, #C5006B)",
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            color: "#64748B",
                          }
                    }
                  >
                    {p}
                  </Link>
                </span>
              ))}

            {currentPage < totalPages && (
              <Link
                href={`/category/${slug}?sort=${sort}&page=${currentPage + 1}`}
                className="px-4 py-2 rounded-[10px] text-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#64748B",
                }}
              >
                Siguiente
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
