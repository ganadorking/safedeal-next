"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

const TABS = [
  { href: "/", icon: "fas fa-th-large", label: "Inicio" },
  { href: "/search?sort=popular", icon: "fas fa-fire", label: "Populares" },
  { href: "/category/videojuegos", icon: "fas fa-gamepad", label: "Videojuegos" },
  { href: "/category/gift-cards", icon: "fas fa-gift", label: "Gift Cards" },
  { href: "/category/suscripciones", icon: "fas fa-play-circle", label: "Streaming" },
  { href: "/category/streaming-musica", icon: "fas fa-music", label: "Musica" },
  { href: "/category/software", icon: "fas fa-laptop-code", label: "Software" },
  { href: "/category/inteligencia-artificial", icon: "fas fa-robot", label: "IA" },
  { href: "/category/cuentas", icon: "fas fa-user-circle", label: "Cuentas" },
  { href: "/category/cuentas-gaming", icon: "fas fa-trophy", label: "Gaming Accounts" },
  { href: "/category/criptomonedas", icon: "fab fa-bitcoin", label: "Cripto" },
  { href: "/category/herramientas-trading", icon: "fas fa-chart-line", label: "Trading" },
  { href: "/category/skins-items", icon: "fas fa-tshirt", label: "Skins" },
  { href: "/category/monedas-recursos", icon: "fas fa-coins", label: "Monedas" },
  { href: "/category/servicios", icon: "fas fa-briefcase", label: "Servicios" },
  { href: "/category/marketing-digital", icon: "fas fa-bullhorn", label: "Marketing" },
  { href: "/category/desarrollo-web", icon: "fas fa-code", label: "Desarrollo" },
  { href: "/category/cursos-mentorias", icon: "fas fa-graduation-cap", label: "Cursos" },
  { href: "/category/diseno-creativo", icon: "fas fa-palette", label: "Diseno" },
  { href: "/category/redes-sociales", icon: "fas fa-share-alt", label: "Redes Sociales" },
];

export default function CategoryTabs() {
  const ref = useRef<HTMLElement>(null);
  const [showL, setShowL] = useState(false);
  const [showR, setShowR] = useState(false);

  const update = () => {
    if (!ref.current) return;
    const sl = ref.current.scrollLeft;
    const max = ref.current.scrollWidth - ref.current.clientWidth;
    setShowL(sl > 10);
    setShowR(sl < max - 10);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    setTimeout(update, 100);
    return () => el.removeEventListener("scroll", update);
  }, []);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
    setTimeout(update, 320);
  };

  return (
    <div className="s-hero">
      <div className="sct">
        <div className="s-hero-wrap">
          <button
            className={`s-hero-arr ${showL ? "visible" : ""}`}
            onClick={() => scroll(-1)}
          >
            <i className="fas fa-chevron-left" />
          </button>
          <nav className="s-hero-tabs-in" ref={ref}>
            {TABS.map((tab, i) => (
              <Link
                key={tab.href + i}
                href={tab.href}
                className={i === 0 ? "active" : ""}
              >
                <i className={tab.icon} /> {tab.label}
              </Link>
            ))}
          </nav>
          <button
            className={`s-hero-arr ${showR ? "visible" : ""}`}
            onClick={() => scroll(1)}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
