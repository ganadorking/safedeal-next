import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getProductImageUrl } from "@/lib/utils";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard, { type CardProduct } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug },
    select: { title: true, shortDescription: true, mainImage: true },
  });
  if (!product) return { title: "Producto no encontrado - SafeDeal" };
  return {
    title: `${product.title} - SafeDeal`,
    description: product.shortDescription || product.title,
  };
}

function normalizeProduct(p: {
  id: number;
  slug: string;
  title: string;
  price: unknown;
  originalPrice?: unknown;
  mainImage?: string | null;
  deliveryType: string;
  salesCount: number;
  rating: unknown;
  reviewCount: number;
  categoryId: number;
  shortDescription?: string | null;
  seller?: { username: string; isVerified: boolean; sellerLevel: string } | null;
  category?: { name: string; slug: string } | null;
}): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    mainImage: p.mainImage ?? null,
    deliveryType: p.deliveryType,
    salesCount: p.salesCount,
    rating: Number(p.rating) || 0,
    reviewCount: p.reviewCount || 0,
    categoryId: p.categoryId,
    shortDescription: p.shortDescription ?? null,
    seller: p.seller
      ? {
          username: p.seller.username,
          isVerified: p.seller.isVerified,
          sellerLevel: p.seller.sellerLevel || null,
        }
      : undefined,
    category: p.category
      ? { name: p.category.name, slug: p.category.slug }
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          isVerified: true,
          avatarUrl: true,
          createdAt: true,
          sellerLevel: true,
          totalSales: true,
        },
      },
      category: { select: { name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { imageUrl: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { username: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!product) notFound();

  const price = Number(product.price);
  const comparePrice = product.originalPrice
    ? Number(product.originalPrice)
    : 0;
  const discount =
    comparePrice > price
      ? Math.round((1 - price / comparePrice) * 100)
      : 0;
  const rating = Number(product.rating) || 0;
  const reviewCount = product.reviewCount || 0;

  // Build images
  const imageUrls: string[] = [];
  const seen = new Set<string>();
  for (const img of product.images) {
    const url = getProductImageUrl(img.imageUrl, product.title);
    if (!seen.has(url)) {
      imageUrls.push(url);
      seen.add(url);
    }
  }
  if (imageUrls.length === 0) {
    imageUrls.push(getProductImageUrl(product.mainImage, product.title));
  }

  const sellerTotalProducts = await prisma.product.count({
    where: { sellerId: product.sellerId, isActive: true },
  });

  const productInclude = {
    seller: {
      select: { username: true, isVerified: true, sellerLevel: true },
    },
    category: { select: { name: true, slug: true } },
  };

  const [relatedProducts, sellerProducts] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
        stock: { gt: 0 },
      },
      orderBy: { salesCount: "desc" },
      take: 12,
      include: productInclude,
    }),
    prisma.product.findMany({
      where: {
        sellerId: product.sellerId,
        id: { not: product.id },
        isActive: true,
      },
      orderBy: { salesCount: "desc" },
      take: 6,
      include: productInclude,
    }),
  ]);

  const seller = product.seller!;

  // Specs
  const specs: { label: string; value: string; accent?: boolean }[] = [];
  if (product.platform) specs.push({ label: "Plataforma", value: product.platform });
  specs.push({ label: "Region", value: product.region || "GLOBAL" });
  specs.push({
    label: "Entrega",
    value: product.deliveryType === "instant" ? "Instantanea" : "Manual",
    accent: true,
  });
  specs.push({ label: "Stock", value: `${product.stock} disponibles` });
  if (product.duration) specs.push({ label: "Duracion", value: product.duration });

  const normalizedRelated = relatedProducts.map(normalizeProduct);
  const normalizedSeller = sellerProducts.map(normalizeProduct);

  return (
    <main className="pp">
      <div className="pp-ct">
        {/* Breadcrumb */}
        <div className="pp-bc">
          <Link href="/">Inicio</Link>
          <i className="fas fa-chevron-right sep" />
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`}>
                {product.category.name}
              </Link>
              <i className="fas fa-chevron-right sep" />
            </>
          )}
          <span className="cur">{product.title}</span>
        </div>

        <ProductDetailClient
          product={{
            id: product.id,
            title: product.title,
            slug: product.slug,
            price,
            comparePrice,
            discount,
            rating,
            reviewCount,
            salesCount: product.salesCount,
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            deliveryType: product.deliveryType || "",
            categoryName: product.category?.name || "",
            categorySlug: product.category?.slug || "",
          }}
          images={imageUrls}
          specs={specs}
          seller={{
            username: seller.username,
            isVerified: seller.isVerified,
            avatarUrl: seller.avatarUrl,
            sellerLevel: seller.sellerLevel || "",
            totalProducts: sellerTotalProducts,
            totalSales: seller.totalSales,
          }}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            username: r.user?.username || "Usuario",
            rating: r.rating,
            comment: r.comment || "",
            createdAt: r.createdAt.toISOString(),
          }))}
          relatedProducts={normalizedRelated}
          sellerProducts={normalizedSeller}
        />
      </div>

      {/* Seller products — usa ProductCard compartido */}
      {normalizedSeller.length > 0 && (
        <div className="pp-sec">
          <div className="pp-sec-h">
            <div className="pp-sec-title">Mas de {seller.username}</div>
            <Link href={`/seller/${seller.username}`} className="pp-sec-link">
              Ver tienda &rarr;
            </Link>
          </div>
          <div className="pp-grid">
            {normalizedSeller.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Related products — usa ProductCard compartido */}
      {normalizedRelated.length > 0 && (
        <div className="pp-sec">
          <div className="pp-sec-h">
            <div className="pp-sec-title">Productos similares</div>
            <Link href={`/category/${product.category?.slug || ""}`} className="pp-sec-link">
              Ver categoria &rarr;
            </Link>
          </div>
          <div className="pp-grid">
            {normalizedRelated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="pp-sec" id="secReviews">
          <div className="pp-rev-hd-tab">
            Resenas <span className="cnt">{reviewCount}</span>
          </div>
          <div className="pp-rev-summary">
            <span className="pp-rev-big-num">{rating.toFixed(1)}</span>
            <div className="pp-rev-stars-sm">
              {[1, 2, 3, 4, 5].map((s) => (
                <i
                  key={s}
                  className={`fas fa-star ${s <= Math.round(rating) ? "" : "empty"}`}
                />
              ))}
            </div>
            <span className="pp-rev-cnt-sm">{reviewCount} resenas</span>
          </div>
          <div className="pp-rev-cards">
            {product.reviews.map((rv) => (
              <div key={rv.id} className="pp-rev-card">
                <div className="pp-rev-head">
                  <span className="pp-rev-user">{rv.user?.username || "Usuario"}</span>
                  <span className="pp-rev-date">
                    {rv.createdAt.toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="pp-rev-rating">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className={`fas fa-star ${s <= rv.rating ? "" : "empty"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="pp-rev-text">{rv.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="pp-sec">
          <div className="pp-sec-h">
            <div className="pp-sec-title">Descripcion completa</div>
          </div>
          <div className="pp-desc-block">
            <div className="pp-desc-content">{product.description}</div>
            <div className="pp-desc-footer">
              <span className="pp-desc-badge">
                <i className="fas fa-bolt blue" /> Entrega{" "}
                {product.deliveryType === "instant" ? "instantanea" : "manual"}
              </span>
              <span className="pp-desc-badge">
                <i className="fas fa-shield-alt blue" /> Pago escrow SafeDeal
              </span>
              <span className="pp-desc-badge">
                <i className="fas fa-undo" /> Garantia de devolucion
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="pp-divider" />
      <div className="pb64" />

      {/* Sticky mobile buy bar */}
      <div className="pp-sticky-bar">
        <span className="pp-sticky-price">${price.toFixed(2)}</span>
        <Link href={`/checkout?product=${product.id}`} className="pp-sticky-btn">
          Comprar ahora
        </Link>
      </div>
    </main>
  );
}
