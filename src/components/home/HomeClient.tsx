"use client";

import { useState } from "react";
import BannerCarousel from "./BannerCarousel";
import CategoryTabs from "./CategoryTabs";
import ProductSection from "./ProductSection";
import QuickViewModal from "@/components/product/QuickViewModal";
import type { CardProduct } from "@/components/product/ProductCard";

interface HomeClientProps {
  bannerSlides: {
    title: string;
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string | null;
    bgColor?: string;
    subtitle?: string | null;
  }[];
  sideBanners: {
    title: string;
    subtitle?: string | null;
    ctaUrl: string;
    bgColor: string;
    imageUrl?: string | null;
  }[];
  bestsellers: CardProduct[];
  recentProducts: CardProduct[];
  categorySections: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    products: CardProduct[];
  }[];
}

export default function HomeClient({
  bannerSlides,
  sideBanners,
  bestsellers,
  recentProducts,
  categorySections,
}: HomeClientProps) {
  const [quickView, setQuickView] = useState<CardProduct | null>(null);

  return (
    <>
      <BannerCarousel slides={bannerSlides} sideBanners={sideBanners} />

      <CategoryTabs />

      {/* Features */}
      <section className="s-feats">
        <div className="sct">
          <div className="s-feats-g">
            {[
              { icon: "fas fa-shield-alt", title: "100% Escrow", desc: "Tu dinero protegido" },
              { icon: "fas fa-bolt", title: "Entrega Instantanea", desc: "La mayoria de productos" },
              { icon: "fas fa-undo-alt", title: "14 Dias Garantia", desc: "Sin preguntas" },
              { icon: "fas fa-headset", title: "Soporte 24/7", desc: "Siempre disponible" },
            ].map((feat, i) => (
              <div key={i} className="s-feat">
                <div className="s-feat-ico">
                  <i className={feat.icon} />
                </div>
                <div>
                  <h4>{feat.title}</h4>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <ProductSection
          title="Los mas vendidos"
          icon="fas fa-fire-alt"
          products={bestsellers}
          viewAllHref="/search?sort=popular"
          layout="grid"
          onQuickView={setQuickView}
        />
      )}

      {/* Recent */}
      {recentProducts.length > 0 && (
        <ProductSection
          title="Recien agregados"
          icon="fas fa-clock"
          products={recentProducts}
          viewAllHref="/search?sort=newest"
          layout="scroll"
          onQuickView={setQuickView}
        />
      )}

      {/* Category sections */}
      {categorySections.map((cs) => (
        <ProductSection
          key={cs.id}
          title={cs.name}
          icon={cs.icon}
          products={cs.products}
          viewAllHref={`/category/${cs.slug}`}
          layout="scroll"
          onQuickView={setQuickView}
        />
      ))}

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
