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

const ITEMS_PER_PAGE = 24;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string; sub?: string }>;
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
  const selectedSub = sp.sub || "";

  // Fetch subcategories
  const subcategories = await prisma.category.findMany({
    where: { parentId: category.id, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

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

  // If a subcategory is selected, filter by it; otherwise show all from parent + children
  const subcategoryIds = subcategories.map((sc) => sc.id);
  const allCategoryIds = [category.id, ...subcategoryIds];

  let filterCategoryIds: number[];
  if (selectedSub) {
    const subCat = subcategories.find((sc) => sc.slug === selectedSub);
    filterCategoryIds = subCat ? [subCat.id] : allCategoryIds;
  } else {
    filterCategoryIds = allCategoryIds;
  }

  const where = {
    categoryId: { in: filterCategoryIds },
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
  const bannerBg = meta?.cardGradient || "linear-gradient(135deg, #4A7CF7, #3A65D4)";
  const accentColor = meta?.color || "#4A7CF7";

  // Build query string helper
  function buildHref(overrides: { sort?: string; page?: number; sub?: string }) {
    const s = overrides.sort ?? sort;
    const p = overrides.page ?? 1;
    const sub = overrides.sub ?? selectedSub;
    const parts = [`/category/${slug}`];
    const qp: string[] = [];
    if (s && s !== "newest") qp.push(`sort=${s}`);
    if (p > 1) qp.push(`page=${p}`);
    if (sub) qp.push(`sub=${sub}`);
    return parts[0] + (qp.length ? `?${qp.join("&")}` : "");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* ===== Banner Header ===== */}
      <div style={{ background: bannerBg, padding: "40px 0 32px" }}>
        <div className="sct">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>{category.name}</span>
          </nav>

          {/* Category info */}
          <div className="flex items-center gap-4">
            {meta?.icon && (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <i className={`fas fa-${meta.icon === "Gamepad2" ? "gamepad" : meta.icon === "Gift" ? "gift" : meta.icon === "MonitorSmartphone" ? "laptop" : meta.icon === "PlayCircle" ? "play-circle" : meta.icon === "Bot" ? "robot" : meta.icon === "TrendingUp" ? "chart-line" : meta.icon === "Code2" ? "code" : meta.icon === "Coins" ? "coins" : meta.icon === "GraduationCap" ? "graduation-cap" : meta.icon === "UserCircle" ? "user-circle" : meta.icon === "Briefcase" ? "briefcase" : "box-open"}`} />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{category.name}</h1>
              {category.description && (
                <p className="text-sm mt-1 max-w-2xl" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {category.description}
                </p>
              )}
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                {total} producto{total !== 1 ? "s" : ""} disponible{total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sct py-6">
        {/* ===== Subcategory Pills ===== */}
        {subcategories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ sub: "", page: 1 })}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={
                  !selectedSub
                    ? {
                        backgroundColor: accentColor,
                        color: "#FFFFFF",
                      }
                    : {
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        color: "#64748B",
                      }
                }
              >
                Todos
              </Link>
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={buildHref({ sub: sub.slug, page: 1 })}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={
                    selectedSub === sub.slug
                      ? {
                          backgroundColor: accentColor,
                          color: "#FFFFFF",
                        }
                      : {
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          color: "#64748B",
                        }
                  }
                >
                  {sub.icon && <i className={sub.icon + " mr-1.5"} />}
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== Toolbar: Count + Sort ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm" style={{ color: "#64748B" }}>
            {products.length > 0
              ? `Mostrando ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, total)} de ${total} productos`
              : `${total} productos`}
          </p>

          {/* Sort pills */}
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => {
              const isActive = sort === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={buildHref({ sort: opt.value, page: 1 })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={
                    isActive
                      ? {
                          backgroundColor: "#4A7CF7",
                          color: "#FFFFFF",
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
              );
            })}
          </div>
        </div>

        {/* ===== Product Grid ===== */}
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
          <div className="text-center py-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <svg className="w-10 h-10" style={{ color: "#94A3B8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "#0F172A" }}>
              No hay productos disponibles
            </h3>
            <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>
              {selectedSub
                ? "No se encontraron productos en esta subcategoria. Prueba con otra o mira todas."
                : "Aun no hay productos en esta categoria. Vuelve pronto."}
            </p>
            {selectedSub && (
              <Link
                href={buildHref({ sub: "", page: 1 })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "#4A7CF7" }}
              >
                Ver todos los productos
              </Link>
            )}
          </div>
        )}

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {/* Previous */}
            {currentPage > 1 && (
              <Link
                href={buildHref({ page: currentPage - 1 })}
                className="h-10 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#64748B",
                }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </Link>
            )}

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 2
              )
              .map((p, idx, arr) => (
                <span key={p} className="inline-flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-sm" style={{ color: "#94A3B8" }}>...</span>
                  )}
                  <Link
                    href={buildHref({ page: p })}
                    className={`w-10 h-10 inline-flex items-center justify-center rounded-lg text-sm font-medium ${
                      p === currentPage ? "text-white" : ""
                    }`}
                    style={
                      p === currentPage
                        ? { backgroundColor: "#4A7CF7", color: "#FFFFFF" }
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

            {/* Next */}
            {currentPage < totalPages && (
              <Link
                href={buildHref({ page: currentPage + 1 })}
                className="h-10 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#64748B",
                }}
              >
                Siguiente
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
