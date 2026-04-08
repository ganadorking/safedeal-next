"use client";

import { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

type Product = Parameters<typeof ProductCard>[0]["product"];

interface ProductSectionProps {
  title: string;
  icon: string;
  products: Product[];
  viewAllHref?: string;
  layout?: "grid" | "scroll";
  onQuickView?: (product: Product) => void;
}

export default function ProductSection({
  title,
  icon,
  products,
  viewAllHref,
  layout = "grid",
  onQuickView,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    if (!scrollRef.current) return;
    const item = scrollRef.current.querySelector(".spc") as HTMLElement;
    const step = item ? (item.offsetWidth + 12) * 3 : 300;
    scrollRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="s-sec">
      <div className="sct">
        <div className="s-sec-h">
          <h2>
            <i className={icon} /> {title}
          </h2>
          <div className="s-sec-h-right">
            {viewAllHref && (
              <Link href={viewAllHref}>
                Ver todos <i className="fas fa-chevron-right s-sec-arr-ico" />
              </Link>
            )}
            {layout === "scroll" && (
              <>
                <button className="s-sec-arr" onClick={() => scrollBy(-1)}>
                  <i className="fas fa-chevron-left" />
                </button>
                <button className="s-sec-arr" onClick={() => scrollBy(1)}>
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
          </div>
        </div>
        {layout === "grid" ? (
          <div className="s-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        ) : (
          <div className="s-scroll-wrap">
            <div className="s-scroll" ref={scrollRef}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
