"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import type { CardProduct } from "./ProductCard";

interface QuickViewModalProps {
  product: CardProduct | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (product) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [product, handleEsc]);

  if (!product) return null;

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isInstant = product.deliveryType === "instant";
  const url = `/product/${product.slug}`;
  const imgUrl = product.mainImage || "";
  const catName = product.category?.name || "";
  const sellerName = product.seller?.username || "Vendedor";
  const rating = product.rating ? Number(product.rating) : 0;

  return (
    <div className="s-modal open" onClick={onClose}>
      <div className="s-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Media */}
        <div className="s-modal-media">
          {imgUrl ? (
            <img src={imgUrl} alt={product.title} className="on" />
          ) : (
            <div className="s-modal-bg">
              <i className="fas fa-box-open" />
            </div>
          )}
          {discountPercent > 0 && (
            <span className="s-modal-disc">-{discountPercent}%</span>
          )}
        </div>

        {/* Info */}
        <div className="s-modal-info">
          <div className="s-modal-top">
            <div className="s-modal-seller">
              {product.seller?.isVerified && (
                <i className="fas fa-check-circle spc-verified" />
              )}
              <span>{sellerName}</span>
              {rating > 0 && (
                <span className="s-modal-rating-pill">
                  <i className="fas fa-star" /> {rating.toFixed(1)}
                </span>
              )}
            </div>
            <button className="s-modal-close" onClick={onClose} aria-label="Cerrar">
              &times;
            </button>
          </div>

          <div className="s-modal-title">{product.title}</div>

          <div className="s-modal-prices">
            <span className="s-modal-now">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="s-modal-old">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          {catName && <div className="s-modal-cat">{catName}</div>}

          {product.shortDescription && (
            <div className="s-modal-desc">{product.shortDescription}</div>
          )}

          <div className="s-modal-tags">
            {isInstant && (
              <span className="s-modal-tag">
                <i className="fas fa-bolt" /> Instantaneo
              </span>
            )}
            <span className="s-modal-tag">
              <i className="fas fa-shield-alt" /> Escrow
            </span>
          </div>

          <div className="s-modal-btns">
            <Link href={url} className="s-modal-btn pri">
              <i className="fas fa-shopping-cart" /> Comprar ahora
            </Link>
            <Link href={url} className="s-modal-btn sec">
              Ver producto completo
            </Link>
          </div>

          <div className="s-modal-note">
            <i className="fas fa-shield-alt" /> Escrow SafeDeal &middot; 14 dias de garantia
          </div>
        </div>
      </div>
    </div>
  );
}
