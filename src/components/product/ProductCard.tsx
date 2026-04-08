"use client";

import Link from "next/link";
import { CATEGORY_META } from "@/lib/constants";
import { getProductImageUrl } from "@/lib/utils";

export interface CardProduct {
  id: number;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  mainImage?: string | null;
  deliveryType?: string;
  salesCount?: number;
  rating?: number;
  reviewCount?: number;
  categoryId: number;
  shortDescription?: string | null;
  seller?: {
    username: string;
    isVerified?: boolean;
    sellerLevel?: string | null;
  };
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: CardProduct;
  onQuickView?: (product: CardProduct) => void;
}

/* Seller seal SVG — matches PHP makeSealSvg() */
function SellerSeal({ level, id }: { level: string; id: number }) {
  const colors: Record<string, [string, string, string]> = {
    pro: ["#60b8ff", "#1a7fff", "#003d99"],
    gold: ["#ffe87a", "#f5c200", "#a06800"],
    platino: ["#c8b8ff", "#9966ff", "#4c1d95"],
  };
  const c = colors[level];
  if (!c) return null;
  const uid = `sg${level[0]}${id}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c[0]} />
          <stop offset="50%" stopColor={c[1]} />
          <stop offset="100%" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <path d="M22.51,13.76a3,3,0,0,1,0-3.52l.76-1.05a1,1,0,0,0,.14-.9,1.018,1.018,0,0,0-.64-.64l-1.23-.4A2.987,2.987,0,0,1,19.47,4.4V3.1a1,1,0,0,0-1.31-.95l-1.24.4a3,3,0,0,1-3.35-1.09L12.81.41a1.036,1.036,0,0,0-1.62,0l-.76,1.05A3,3,0,0,1,7.08,2.55l-1.24-.4a1,1,0,0,0-1.31.95V4.4A2.987,2.987,0,0,1,2.46,7.25l-1.23.4a1.018,1.018,0,0,0-.64.64,1,1,0,0,0,.14.9l.76,1.05a3,3,0,0,1,0,3.52L.73,14.81a1,1,0,0,0-.14.9,1.018,1.018,0,0,0,.64.64l1.23.4A2.987,2.987,0,0,1,4.53,19.6v1.3a1,1,0,0,0,1.31.95l1.23-.4a2.994,2.994,0,0,1,3.36,1.09l.76,1.05a1.005,1.005,0,0,0,1.62,0l.76-1.05a3,3,0,0,1,3.36-1.09l1.23.4a1,1,0,0,0,1.31-.95V19.6a2.987,2.987,0,0,1,2.07-2.85l1.23-.4a1.018,1.018,0,0,0,.64-.64,1,1,0,0,0-.14-.9Z" fill={`url(#${uid})`} />
      <path d="M16.71,10.707l-5,5a1,1,0,0,1-1.414,0l-3-3a1,1,0,1,1,1.414-1.414L11,13.586l4.293-4.293a1,1,0,0,1,1.414,1.414Z" fill="#fff" />
    </svg>
  );
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const catMeta = CATEGORY_META[product.categoryId] || CATEGORY_META[12];
  const imgUrl = product.mainImage
    ? getProductImageUrl(product.mainImage, product.title)
    : "";
  const sellerName = product.seller?.username || "Vendedor";
  const sellerLevel = product.seller?.sellerLevel || "";
  const isVerified = product.seller?.isVerified && !!sellerLevel;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="spc"
      data-id={product.id}
    >
      {/* Image */}
      <div className="spc-img" style={{ background: catMeta.cardGradient }}>
        <div className="spc-bg">
          <i className="fas fa-box-open" style={{ color: catMeta.color }} />
        </div>
        {imgUrl && <img src={imgUrl} alt={product.title} loading="lazy" />}
        <button
          className="spc-fav"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label="Favorito"
        >
          <i className="far fa-heart" />
        </button>
        <button
          className="spc-qv"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView?.(product);
          }}
        >
          Vista rapida
        </button>
      </div>

      {/* Info — exact PHP order: prices → meta (seal+seller / title) → btn */}
      <div className="spc-info">
        <div className="spc-prices">
          <i className="fas fa-wallet spc-wallet" />
          <strong className="spc-now">${price.toFixed(2)}</strong>
          {hasDiscount && (
            <s className="spc-old">${originalPrice.toFixed(2)}</s>
          )}
        </div>
        <div className="spc-meta">
          {isVerified && (
            <SellerSeal level={sellerLevel} id={product.id} />
          )}
          <span className="spc-store">{sellerName}</span>
          <span className="spc-sep">/</span>
          <span className="spc-metitle">{product.title}</span>
        </div>
        <div
          className="spc-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="fas fa-shopping-cart" /> Comprar
        </div>
      </div>
    </Link>
  );
}
