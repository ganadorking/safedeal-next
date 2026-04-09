"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductData {
  id: number;
  title: string;
  slug: string;
  price: number;
  comparePrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  description: string;
  shortDescription: string;
  deliveryType: string;
  categoryName: string;
  categorySlug: string;
}

interface Spec {
  label: string;
  value: string;
  accent?: boolean;
}

interface SellerData {
  username: string;
  isVerified: boolean;
  avatarUrl: string | null;
  sellerLevel: string;
  totalProducts: number;
  totalSales: number;
}

interface ReviewData {
  id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  product: ProductData;
  images: string[];
  specs: Spec[];
  seller: SellerData;
  reviews: ReviewData[];
  relatedProducts: any[];
  sellerProducts: any[];
}

export default function ProductDetailClient({
  product,
  images,
  specs,
  seller,
}: Props) {
  const router = useRouter();
  const [curImg, setCurImg] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [accOpen, setAccOpen] = useState<number | null>(null);
  const [addingCart, setAddingCart] = useState(false);

  async function handleAddToCart() {
    setAddingCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.ok) {
        router.push("/cart");
      }
    } catch {
      // silent
    } finally {
      setAddingCart(false);
    }
  }

  const setImg = useCallback(
    (idx: number) => {
      setShowVideo(false);
      setCurImg(Math.max(0, Math.min(idx, images.length - 1)));
    },
    [images.length]
  );

  const totalMedia = images.length;
  const lvlClass = seller.sellerLevel
    ? `pp-st-lvl ${seller.sellerLevel}`
    : "";

  return (
    <div className="pp-top">
      {/* Col 1: Vertical thumbnails (desktop) */}
      <div className="pp-thumbs">
        {images.map((src, i) => (
          <div
            key={i}
            className={`pp-thumb ${i === curImg && !showVideo ? "on" : ""}`}
            onClick={() => setImg(i)}
            onMouseEnter={() => setImg(i)}
          >
            <img src={src} loading={i === 0 ? "eager" : "lazy"} alt="" />
          </div>
        ))}
      </div>

      {/* Col 2: Main image + dots + mobile buy */}
      <div className="pp-media">
        <div className="pp-imgw">
          <img
            className="pp-img"
            src={images[curImg] || images[0]}
            loading="eager"
            alt={product.title}
          />
          {totalMedia > 1 && (
            <span className="pp-img-ctr">
              {curImg + 1} / {totalMedia}
            </span>
          )}
        </div>

        {totalMedia > 1 && (
          <div className="pp-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`pp-dot ${i === curImg ? "on" : ""}`}
                onClick={() => setImg(i)}
              />
            ))}
          </div>
        )}

        {/* Mobile buy block */}
        <div className="pp-mob-buy">
          <div className="pp-price-row">
            <span className="pp-price-main">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="pp-price-old">
                  ${product.comparePrice.toFixed(2)}
                </span>
                <span className="pp-price-disc">-{product.discount}%</span>
              </>
            )}
          </div>
          <div className="pp-btns">
            <Link
              href={`/checkout?product=${product.id}`}
              className="pp-btn pp-btn-buy"
            >
              Comprar ahora
            </Link>
            <button className="pp-btn pp-btn-cart" onClick={handleAddToCart} disabled={addingCart}>
              {addingCart ? "Agregando..." : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>

      {/* Col 3: Info + Sidebar */}
      <div className="pp-right">
        {/* Info */}
        <div>
          <h1 className="pp-title">{product.title}</h1>
          <div className="pp-sku">
            SKU: SF{product.id} &middot; {product.categoryName}
          </div>
          <div className="pp-stars">
            {product.reviewCount > 0 ? (
              <>
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className={`fas fa-star ${s <= Math.round(product.rating) ? "lit" : ""}`}
                  />
                ))}
                <span className="pp-stars-val">
                  {product.rating.toFixed(1)}
                </span>
                <span className="pp-stars-dot">&middot;</span>
                <a href="#secReviews" className="pp-stars-link">
                  {product.reviewCount} resenas
                </a>
                <span className="pp-stars-dot">&middot;</span>
              </>
            ) : (
              <>
                <span>Sin resenas aun</span>
                <span className="pp-stars-dot">&middot;</span>
              </>
            )}
            <span className="pp-stars-sales">
              <i className="fas fa-box-open" /> {product.salesCount} vendidos
            </span>
          </div>

          {/* Specs table */}
          <div className="pp-specs">
            {specs.map((spec, i) => (
              <div key={i} className="pp-spec">
                <span className="pp-spec-l">{spec.label}</span>
                <span className="pp-spec-dots" />
                <span className={`pp-spec-v ${spec.accent ? "acc" : ""}`}>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="pp-side">
          {/* Buy card */}
          <div className="pp-buy-card">
            <div className="pp-price-row">
              <span className="pp-price-main">${product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="pp-price-old">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                  <span className="pp-price-disc">-{product.discount}%</span>
                </>
              )}
            </div>

            <div className="pp-btns">
              <Link
                href={`/checkout?product=${product.id}`}
                className="pp-btn pp-btn-buy"
              >
                Comprar ahora
              </Link>
              <button className="pp-btn pp-btn-cart" onClick={handleAddToCart} disabled={addingCart}>
              {addingCart ? "Agregando..." : "Agregar al carrito"}
            </button>
            </div>

            {/* Seller mini */}
            <Link href={`/seller/${seller.username}`} className="pp-sell-mini">
              <div className="pp-sell-mini-av">
                {seller.avatarUrl ? (
                  <img src={seller.avatarUrl} alt="" />
                ) : (
                  seller.username.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="pp-sell-mini-info">
                <div className="pp-sell-mini-name">
                  {seller.username}
                  {seller.isVerified && (
                    <i className="fas fa-check-circle pp-verified-ico" />
                  )}
                  {lvlClass && (
                    <span className={lvlClass}>
                      {seller.sellerLevel.charAt(0).toUpperCase() +
                        seller.sellerLevel.slice(1)}
                    </span>
                  )}
                </div>
                <div className="pp-sell-mini-sub">
                  {seller.totalSales > 0 && (
                    <>{seller.totalSales} ventas &middot; </>
                  )}
                  {seller.totalProducts} productos
                </div>
              </div>
              <i className="fas fa-chevron-right pp-sell-mini-arrow" />
            </Link>
          </div>

          {/* Trust accordion */}
          <div className="pp-safe-card">
            {[
              {
                icon: "fas fa-shield-alt",
                label: "Compra sin preocupaciones",
                text: "Tu pago queda retenido en escrow hasta confirmar la recepcion del producto.",
                link: "/how-it-works",
                linkText: "Como funciona el escrow",
              },
              {
                icon: "fas fa-hands-helping",
                label: "Promesa al comprador",
                text: "Si el producto no corresponde o el vendedor no entrega, abrimos disputa y recuperas tu dinero.",
                link: "/terms",
                linkText: "Politica de proteccion",
              },
              {
                icon: "fas fa-route",
                label: "Nuestro proceso",
                text: "Pagas → escrow retiene → vendedor entrega → confirmas recepcion → vendedor cobra.",
                link: "/how-to-buy",
                linkText: "Ver proceso completo",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div
                  className="pp-acc-row"
                  onClick={() => setAccOpen(accOpen === idx ? null : idx)}
                >
                  <span className="pp-acc-ico">
                    <i className={item.icon} />
                  </span>
                  <span className="pp-acc-label">{item.label}</span>
                  <i
                    className={`fas fa-chevron-down pp-acc-chev ${accOpen === idx ? "open" : ""}`}
                  />
                </div>
                <div className={`pp-acc-body ${accOpen === idx ? "open" : ""}`}>
                  <div className="pp-acc-body-inner">
                    <p>{item.text}</p>
                    <Link href={item.link} className="pp-acc-link">
                      {item.linkText} <i className="fas fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
