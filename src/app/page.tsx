import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";
import Link from "next/link";
import type { CardProduct } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

const CAT_ICONS: Record<number, string> = {
  1: "fas fa-gamepad",
  2: "fas fa-gift",
  3: "fas fa-laptop-code",
  4: "fas fa-play-circle",
  5: "fas fa-robot",
  6: "fas fa-chart-line",
  7: "fas fa-code",
  8: "fas fa-coins",
  9: "fas fa-graduation-cap",
  10: "fas fa-user-circle",
  11: "fas fa-concierge-bell",
  12: "fas fa-box-open",
};

const DEFAULT_SLIDES = [
  {
    title: "Juegos Steam\nhasta 70% off",
    ctaText: "Ver ofertas",
    ctaUrl: "/category/videojuegos",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#0d1b4b 0%,#1a3a8f 55%,#0075FF 100%)",
  },
  {
    title: "Gift Cards\ndesde $1 USD",
    ctaText: "Ver Gift Cards",
    ctaUrl: "/category/gift-cards",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#1a1202 0%,#4a3500 55%,#ca8a04 100%)",
  },
  {
    title: "Netflix, Spotify\ny Disney+",
    ctaText: "Ver streaming",
    ctaUrl: "/category/suscripciones",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#1a0533 0%,#3b0764 55%,#9333ea 100%)",
  },
  {
    title: "ChatGPT Plus\ny Midjourney",
    ctaText: "Explorar IA",
    ctaUrl: "/category/inteligencia-artificial",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#001a0d 0%,#003d20 55%,#10b981 100%)",
  },
  {
    title: "Criptomonedas\nBTC · ETH · USDT",
    ctaText: "Comprar cripto",
    ctaUrl: "/category/criptomonedas",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#1a0505 0%,#4a0a0a 55%,#dc2626 100%)",
  },
  {
    title: "Software y\nAntivirus al mejor precio",
    ctaText: "Ver software",
    ctaUrl: "/category/software",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#020a1a 0%,#052040 55%,#0a5aad 100%)",
  },
  {
    title: "Skins & Items\npara CS2, Fortnite y mas",
    ctaText: "Ver skins",
    ctaUrl: "/category/skins-items",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#0a0a1a 0%,#1a1035 55%,#6d28d9 100%)",
  },
  {
    title: "Cuentas Gaming\ncon rango y nivel",
    ctaText: "Ver cuentas",
    ctaUrl: "/category/cuentas-gaming",
    imageUrl: null,
    bgColor:
      "linear-gradient(135deg,#0a1a0a 0%,#1a3a1a 55%,#16a34a 100%)",
  },
];

const DEFAULT_SIDE = [
  {
    title: "Conviertete en vendedor",
    subtitle: "Vende productos digitales y gana dinero sin limites",
    ctaUrl: "/register",
    bgColor:
      "linear-gradient(135deg,#0a1828 0%,#0d2a4a 50%,#0075FF 100%)",
    imageUrl: null,
  },
  {
    title: "Recomienda y gana",
    subtitle: "Invita amigos y obten comision por cada compra que hagan",
    ctaUrl: "/referrals",
    bgColor:
      "linear-gradient(135deg,#150a28 0%,#2a1050 50%,#9333ea 100%)",
    imageUrl: null,
  },
];

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

async function getHomeData() {
  const productInclude = {
    seller: {
      select: {
        username: true,
        isVerified: true,
        sellerLevel: true,
      },
    },
    category: { select: { name: true, slug: true } },
  };

  const [bestsellers, recentProducts, banners, categories] =
    await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 } },
        orderBy: { salesCount: "desc" },
        take: 12,
        include: productInclude,
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 } },
        orderBy: { createdAt: "desc" },
        take: 12,
        include: productInclude,
      }),
      prisma.homepageBanner
        .findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          take: 8,
        })
        .catch(() => []),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          products: {
            where: { isActive: true, stock: { gt: 0 } },
            orderBy: { salesCount: "desc" },
            take: 6,
            include: productInclude,
          },
        },
      }),
    ]);

  const heroSlides = banners
    .filter((b) => b.slot === "hero")
    .map((b) => ({
      title: b.title || "",
      ctaText: b.ctaText || undefined,
      ctaUrl: b.ctaUrl || undefined,
      imageUrl: b.imageUrl,
      bgColor: b.bgColor || undefined,
      subtitle: b.subtitle,
    }));

  const sideSlides = banners
    .filter((b) => b.slot === "side")
    .map((b) => ({
      title: b.title || "",
      subtitle: b.subtitle,
      ctaUrl: b.ctaUrl || "/sell",
      bgColor: b.bgColor || "linear-gradient(135deg,#0a1828,#0075FF)",
      imageUrl: b.imageUrl,
    }));

  return {
    bestsellers: bestsellers.map(normalizeProduct),
    recentProducts: recentProducts.map(normalizeProduct),
    bannerSlides: heroSlides.length > 0 ? heroSlides : DEFAULT_SLIDES,
    sideBanners: sideSlides.length > 0 ? sideSlides : DEFAULT_SIDE,
    categorySections: categories
      .filter((c) => c.products.length > 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: CAT_ICONS[c.id] || "fas fa-tag",
        products: c.products.map(normalizeProduct),
      })),
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="main-content">
      <HomeClient
        bannerSlides={data.bannerSlides}
        sideBanners={data.sideBanners}
        bestsellers={data.bestsellers}
        recentProducts={data.recentProducts}
        categorySections={data.categorySections}
      />

      {/* CTA */}
      <section style={{ padding: "20px 0 40px" }}>
        <div className="sct">
          <div className="cta-section">
            <h2>Listo para vender?</h2>
            <p>
              Publica tus productos digitales y llega a miles de compradores.
              Comisiones bajas, pagos rapidos y soporte dedicado.
            </p>
            <Link href="/sell" className="btn btn-lg">
              Comenzar a vender
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
