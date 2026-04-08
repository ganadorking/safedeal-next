"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface Slide {
  title: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string | null;
  bgColor?: string;
  subtitle?: string | null;
}

interface SideBanner {
  title: string;
  subtitle?: string | null;
  ctaUrl: string;
  bgColor: string;
  imageUrl?: string | null;
}

interface BannerCarouselProps {
  slides: Slide[];
  sideBanners: SideBanner[];
}

export default function BannerCarousel({
  slides,
  sideBanners,
}: BannerCarouselProps) {
  const [cur, setCur] = useState(0);
  const slidesRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const go = useCallback(
    (n: number) => {
      const next = ((n % total) + total) % total;
      setCur(next);
      if (slidesRef.current) {
        slidesRef.current.style.transform = `translateX(-${next * 100}%)`;
      }
    },
    [total]
  );

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCur((prev) => {
        const next = (prev + 1) % total;
        if (slidesRef.current) {
          slidesRef.current.style.transform = `translateX(-${next * 100}%)`;
        }
        return next;
      });
    }, 4500);
  }, [total]);

  const stopAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // Touch swipe
  const sxRef = useRef(0);

  return (
    <div className="bnr-section">
      <div className="sct">
        <div className="bnr-layout">
          <div className="bnr-main">
            <div
              className="bnr-slides"
              ref={slidesRef}
              onTouchStart={(e) => {
                sxRef.current = e.touches[0].clientX;
                stopAuto();
              }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - sxRef.current;
                if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
                startAuto();
              }}
            >
              {slides.map((sl, i) => (
                <div
                  key={i}
                  className="bnr-slide"
                  style={{
                    background:
                      sl.bgColor || "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
                  }}
                >
                  {sl.imageUrl && (
                    <img
                      className="bnr-slide-img"
                      src={sl.imageUrl}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="bnr-slide-grad" />
                  <div className="bnr-slide-body">
                    <div>
                      <h2
                        dangerouslySetInnerHTML={{
                          __html: sl.title.replace(/\n/g, "<br/>"),
                        }}
                      />
                      {sl.subtitle && <p className="bnr-sub">{sl.subtitle}</p>}
                    </div>
                    {sl.ctaText && sl.ctaUrl && (
                      <Link href={sl.ctaUrl} className="bnr-btn">
                        {sl.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bnr-ctrl">
              <button
                className="bnr-arrow"
                onClick={() => {
                  stopAuto();
                  go(cur - 1);
                  startAuto();
                }}
              >
                <i className="fas fa-chevron-left" />
              </button>
              <button
                className="bnr-arrow"
                onClick={() => {
                  stopAuto();
                  go(cur + 1);
                  startAuto();
                }}
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>

          <div className="bnr-side">
            {sideBanners.map((sb, i) => (
              <Link
                key={i}
                href={sb.ctaUrl}
                className="bnr-small"
                style={{ background: sb.bgColor }}
              >
                {sb.imageUrl && (
                  <img
                    className="bnr-small-img"
                    src={sb.imageUrl}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: "45%",
                      objectFit: "contain",
                      objectPosition: "center right",
                      zIndex: 1,
                    }}
                  />
                )}
                <div className="bnr-small-body">
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: sb.title.replace(/\n/g, "<br/>"),
                    }}
                  />
                  {sb.subtitle && <p>{sb.subtitle}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
