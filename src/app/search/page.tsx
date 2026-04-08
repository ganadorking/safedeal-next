import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" - Buscar en SafeDeal` : "Buscar - SafeDeal",
  };
}

const SORT_OPTIONS = [
  { value: "popular", label: "Mas vendidos" },
  { value: "newest", label: "Mas recientes" },
  { value: "price_asc", label: "Precio: menor" },
  { value: "price_desc", label: "Precio: mayor" },
  { value: "rating", label: "Mejor calificados" },
];

const ITEMS_PER_PAGE = 24;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    category?: string;
    price_min?: string;
    price_max?: string;
    delivery?: string;
  }>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const sort = sp.sort || "popular";
  const currentPage = Math.max(1, parseInt(sp.page || "1"));
  const categorySlug = sp.category || "";
  const priceMin = sp.price_min ? parseFloat(sp.price_min) : undefined;
  const priceMax = sp.price_max ? parseFloat(sp.price_max) : undefined;
  const delivery = sp.delivery || "";

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    stock: { gt: 0 },
  };

  if (query) {
    const words = query.split(/\s+/).filter(Boolean);
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      ...words.map((w) => ({ title: { contains: w, mode: "insensitive" as const } })),
      ...words.map((w) => ({ tags: { contains: w, mode: "insensitive" as const } })),
      { shortDescription: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  if (priceMin !== undefined) where.price = { ...(where.price as object || {}), gte: priceMin };
  if (priceMax !== undefined) where.price = { ...(where.price as object || {}), lte: priceMax };
  if (delivery === "instant") where.deliveryType = "instant";

  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price_asc": orderBy = { price: "asc" }; break;
    case "price_desc": orderBy = { price: "desc" }; break;
    case "newest": orderBy = { createdAt: "desc" }; break;
    case "rating": orderBy = { rating: "desc" }; break;
    default: orderBy = { salesCount: "desc" };
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        seller: { select: { username: true, isVerified: true, sellerLevel: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true, id: true, _count: { select: { products: { where: { isActive: true, stock: { gt: 0 } } } } } },
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  function buildUrl(params: Record<string, string>) {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (categorySlug && !("category" in params)) p.set("category", categorySlug);
    if (sort !== "popular" && !("sort" in params)) p.set("sort", sort);
    if (sp.price_min && !("price_min" in params)) p.set("price_min", sp.price_min);
    if (sp.price_max && !("price_max" in params)) p.set("price_max", sp.price_max);
    if (delivery && !("delivery" in params)) p.set("delivery", delivery);
    Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); else p.delete(k); });
    p.delete("page");
    return `/search?${p.toString()}`;
  }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      {/* Search header */}
      <div style={{ background: "#F8FAFC", padding: "24px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
            <Link href="/" style={{ color: "#64748B" }}>Inicio</Link>
            <span>/</span>
            <span style={{ color: "#0F172A" }}>Buscar</span>
          </nav>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>
            {query ? (
              <>Resultados para <span style={{ color: "#E6007E" }}>&ldquo;{query}&rdquo;</span></>
            ) : (
              "Explorar productos"
            )}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
            {total} producto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px", display: "flex", gap: 24 }}>
        {/* Filters sidebar */}
        <aside className="search-sidebar" style={{ width: 220, flexShrink: 0 }}>
          {/* Categories */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Categorias</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Link href={buildUrl({ category: "" })} style={{
                padding: "7px 10px", fontSize: 13, borderRadius: 8,
                color: !categorySlug ? "#E6007E" : "#64748B",
                fontWeight: !categorySlug ? 600 : 400,
                background: !categorySlug ? "rgba(230,0,126,0.06)" : "transparent",
              }}>
                Todas
              </Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={buildUrl({ category: cat.slug })} style={{
                  padding: "7px 10px", fontSize: 13, borderRadius: 8,
                  color: categorySlug === cat.slug ? "#E6007E" : "#64748B",
                  fontWeight: categorySlug === cat.slug ? 600 : 400,
                  background: categorySlug === cat.slug ? "rgba(230,0,126,0.06)" : "transparent",
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span>{cat.name}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{cat._count.products}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Precio</h3>
            <form method="GET" action="/search" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {query && <input type="hidden" name="q" value={query} />}
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              {sort !== "popular" && <input type="hidden" name="sort" value={sort} />}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input name="price_min" type="number" placeholder="Min" defaultValue={sp.price_min || ""}
                  style={{ width: "100%", height: 36, padding: "0 10px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, outline: "none", background: "#F8FAFC" }} />
                <span style={{ color: "#94A3B8" }}>—</span>
                <input name="price_max" type="number" placeholder="Max" defaultValue={sp.price_max || ""}
                  style={{ width: "100%", height: 36, padding: "0 10px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, outline: "none", background: "#F8FAFC" }} />
              </div>
              <button type="submit" style={{ height: 34, background: "#E6007E", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}>
                Aplicar precio
              </button>
            </form>
          </div>

          {/* Delivery filter */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Entrega</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Link href={buildUrl({ delivery: "" })} style={{
                padding: "7px 10px", fontSize: 13, borderRadius: 8,
                color: !delivery ? "#E6007E" : "#64748B", fontWeight: !delivery ? 600 : 400,
                background: !delivery ? "rgba(230,0,126,0.06)" : "transparent",
              }}>Todas</Link>
              <Link href={buildUrl({ delivery: "instant" })} style={{
                padding: "7px 10px", fontSize: 13, borderRadius: 8, display: "flex", alignItems: "center", gap: 6,
                color: delivery === "instant" ? "#E6007E" : "#64748B", fontWeight: delivery === "instant" ? 600 : 400,
                background: delivery === "instant" ? "rgba(230,0,126,0.06)" : "transparent",
              }}>
                <i className="fas fa-bolt" style={{ fontSize: 11 }} /> Instantanea
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sort controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SORT_OPTIONS.map((opt) => (
                <Link key={opt.value} href={buildUrl({ sort: opt.value === "popular" ? "" : opt.value })} style={{
                  padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                  background: sort === opt.value ? "#E6007E" : "#F1F5F9",
                  color: sort === opt.value ? "#fff" : "#64748B",
                  transition: "background 0.2s, color 0.2s",
                }}>
                  {opt.label}
                </Link>
              ))}
            </div>
            {/* Active filter chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categorySlug && (
                <Link href={buildUrl({ category: "" })} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(230,0,126,0.08)", color: "#E6007E", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                  {categories.find((c) => c.slug === categorySlug)?.name} ×
                </Link>
              )}
              {(priceMin !== undefined || priceMax !== undefined) && (
                <Link href={buildUrl({ price_min: "", price_max: "" })} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(230,0,126,0.08)", color: "#E6007E", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                  ${priceMin || 0} - ${priceMax || "∞"} ×
                </Link>
              )}
            </div>
          </div>

          {/* Product grid */}
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => {
                const normalizedProduct = {
                  id: product.id,
                  slug: product.slug,
                  title: product.title,
                  price: Number(product.price),
                  originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
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
                return (
                  <ProductCard key={product.id} product={normalizedProduct} />
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <i className="fas fa-search" style={{ fontSize: 40, color: "#E2E8F0", marginBottom: 16, display: "block" }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>No se encontraron productos</h3>
              <p style={{ fontSize: 14, color: "#94A3B8" }}>Intenta con otros terminos o ajusta los filtros.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32 }}>
              {currentPage > 1 && (
                <Link href={`${buildUrl({})}&page=${currentPage - 1}`} style={{ padding: "8px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#64748B", transition: "background 0.2s" }}>Anterior</Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p: number;
                if (totalPages <= 7) p = i + 1;
                else if (currentPage <= 4) p = i + 1;
                else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
                else p = currentPage - 3 + i;
                return (
                  <Link key={p} href={`${buildUrl({})}&page=${p}`} style={{
                    width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: p === currentPage ? "#E6007E" : "#FFFFFF",
                    color: p === currentPage ? "#fff" : "#64748B",
                    border: p === currentPage ? "none" : "1px solid #E2E8F0",
                    transition: "background 0.2s, color 0.2s",
                  }}>{p}</Link>
                );
              })}
              {currentPage < totalPages && (
                <Link href={`${buildUrl({})}&page=${currentPage + 1}`} style={{ padding: "8px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#64748B", transition: "background 0.2s" }}>Siguiente</Link>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
