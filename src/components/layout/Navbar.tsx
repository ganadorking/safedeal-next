"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";

interface Profile {
  id: number;
  username: string;
  avatarUrl: string | null;
  balance: string;
  isSeller: boolean;
  isVerified: boolean;
}

interface Suggestion {
  title: string;
  slug: string;
  price: string;
  category: string;
  categorySlug: string;
  image: string | null;
}

const POPULAR_SEARCHES = [
  { label: "Spotify Premium", query: "spotify" },
  { label: "Netflix", query: "netflix" },
  { label: "ChatGPT Plus", query: "chatgpt" },
  { label: "Windows 11 Pro", query: "windows+11" },
  { label: "Minecraft", query: "minecraft" },
  { label: "Discord Nitro", query: "discord+nitro" },
];

const SIDEBAR_CATEGORIES = [
  { section: "Gaming", items: [
    { slug: "videojuegos", label: "Videojuegos", icon: "fa-gamepad", badge: "HOT", badgeColor: "hot" },
    { slug: "skins-items", label: "Skins & Items", icon: "fa-shield-alt" },
    { slug: "monedas-recursos", label: "Monedas & Recursos", icon: "fa-coins" },
    { slug: "cuentas-gaming", label: "Cuentas Gaming", icon: "fa-user-shield" },
    { slug: "trading-cards", label: "Trading Cards", icon: "fa-layer-group", badge: "NEW", badgeColor: "new" },
  ]},
  { section: "Entretenimiento", items: [
    { slug: "streaming-video", label: "Streaming Video", icon: "fa-tv" },
    { slug: "streaming-musica", label: "Streaming Música", icon: "fa-music" },
    { slug: "streaming-live", label: "Streaming en Vivo", icon: "fa-broadcast-tower" },
  ]},
  { section: "Productos Digitales", items: [
    { slug: "gift-cards", label: "Gift Cards", icon: "fa-gift" },
    { slug: "suscripciones", label: "Suscripciones", icon: "fa-sync-alt" },
    { slug: "software", label: "Software", icon: "fa-laptop-code" },
    { slug: "cuentas", label: "Cuentas Digitales", icon: "fa-user-circle" },
  ]},
  { section: "Tecnología & IA", items: [
    { slug: "inteligencia-artificial", label: "Inteligencia Artificial", icon: "fa-robot", badge: "NEW", badgeColor: "new" },
    { slug: "automatizacion-bots", label: "Automatización & Bots", icon: "fa-cogs" },
    { slug: "desarrollo-web", label: "Desarrollo Web", icon: "fa-code" },
    { slug: "cloud-computing", label: "Cloud Computing", icon: "fa-cloud" },
  ]},
  { section: "Business & Finanzas", items: [
    { slug: "criptomonedas", label: "Criptomonedas", icon: "fa-bitcoin", iconPrefix: "fab", badge: "HOT", badgeColor: "hot" },
    { slug: "herramientas-trading", label: "Herramientas Trading", icon: "fa-chart-bar" },
    { slug: "marketing-digital", label: "Marketing Digital", icon: "fa-bullhorn" },
    { slug: "redes-sociales", label: "Redes Sociales", icon: "fa-share-alt" },
    { slug: "web3-metaverso", label: "Web3 & Metaverso", icon: "fa-globe" },
  ]},
  { section: "Servicios & Educación", items: [
    { slug: "servicios", label: "Servicios", icon: "fa-concierge-bell" },
    { slug: "educacion", label: "Educación", icon: "fa-graduation-cap" },
    { slug: "diseno-creativo", label: "Diseño & Creatividad", icon: "fa-palette" },
    { slug: "otros", label: "Otros Digitales", icon: "fa-th-large" },
  ]},
];

const CAT_BAR_ITEMS = [
  { slug: "videojuegos", label: "Videojuegos", icon: "fa-gamepad" },
  { slug: "gift-cards", label: "Gift Cards", icon: "fa-gift" },
  { slug: "software", label: "Software", icon: "fa-laptop-code" },
  { slug: "suscripciones", label: "Suscripciones", icon: "fa-play-circle" },
  { slug: "cuentas", label: "Cuentas", icon: "fa-user-circle" },
  { slug: "servicios", label: "Servicios", icon: "fa-briefcase" },
  { slug: "desarrollo-web", label: "Desarrollo Web", icon: "fa-code" },
  { slug: "criptomonedas", label: "Criptomonedas", icon: "fa-coins" },
  { slug: "educacion", label: "Educacion", icon: "fa-graduation-cap" },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  // Dropdowns
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasText, setHasText] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggActive, setSuggActive] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [catPanelOpen, setCatPanelOpen] = useState(false);
  const [hamOpen, setHamOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch profile
  useEffect(() => {
    if (user) {
      fetch("/api/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data) setProfile(data); })
        .catch(() => {});
    } else {
      setProfile(null);
    }
  }, [user]);

  // Click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(t)) {
        setSearchOpen(false);
        setExpanded(false);
      }
      if (userRef.current && !userRef.current.contains(t)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(t)) {
        setNotifOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(t)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Fetch suggestions
  const fetchSuggestions = useCallback((q: string) => {
    fetch(`/api/search-suggestions?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => {
        const s = d.suggestions || [];
        setSuggestions(s);
        setSuggActive(true);
      })
      .catch(() => {
        setSuggActive(false);
      });
  }, []);

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    const trimmed = val.trim();
    setHasText(trimmed.length > 0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (trimmed.length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(trimmed), 220);
    } else {
      setSuggActive(false);
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setExpanded(false);
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    setHasText(false);
    setSuggActive(false);
    setSuggestions([]);
  };

  const handleSearchCancel = () => {
    setSearchQuery("");
    setHasText(false);
    setSearchOpen(false);
    setExpanded(false);
    setSuggActive(false);
    setSuggestions([]);
  };

  const toggleCatPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (catPanelOpen) {
      setCatPanelOpen(false);
      setHamOpen(false);
    } else {
      setCatPanelOpen(true);
      setHamOpen(true);
    }
  };

  const closeCatPanel = () => {
    setCatPanelOpen(false);
    setHamOpen(false);
  };

  const initials = profile?.username
    ? profile.username.slice(0, 1).toUpperCase()
    : "S";

  return (
    <>
      {/* CSS in globals.css */}

      {/* ===== NAV ===== */}
      {/* ===== NAV ===== */}
      <nav className={`sd-nav${expanded ? " expanded" : ""}`} id="sdNav">
        <div className="sd-nav-inner">

          {/* ROW 1 */}
          <div className="sd-mob-row1">
            <button
              className={`sd-nav-ham${hamOpen ? " open" : ""}`}
              onClick={toggleCatPanel}
              title="Categorías"
              aria-label="Menú"
            >
              <span className="sd-ham-icon">
                <span></span><span></span><span></span>
              </span>
            </button>

            <Link href="/" className="sd-nav-logo">
              <span className="sd-logo-txt">
                <span style={{ color: "#fff" }}>Safe</span>
                <span style={{ color: "#E6007E" }}>Deal</span>
              </span>
            </Link>

            <div className="sd-nav-right">
              {/* Globe / Settings */}
              <div className={`sd-cur-wrap${settingsOpen ? " open" : ""}`} ref={settingsRef}>
                <button
                  className="sd-nav-cur"
                  title="Configuracion"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSettingsOpen(!settingsOpen);
                    setNotifOpen(false);
                    setUserMenuOpen(false);
                  }}
                >
                  <i className="fas fa-globe"></i>
                </button>
                <div className="sd-settings-dd">
                  <div className="sd-set-header">
                    <h3><i className="fas fa-sliders-h"></i> Configuracion</h3>
                  </div>
                  <Link href="/settings" className="sd-set-item" onClick={() => setSettingsOpen(false)}>
                    <i className="fas fa-language"></i>
                    <span>Idioma</span>
                    <span className="sd-set-val">Espanol</span>
                  </Link>
                  <Link href="/settings" className="sd-set-item" onClick={() => setSettingsOpen(false)}>
                    <i className="fas fa-coins"></i>
                    <span>Divisa</span>
                    <span className="sd-set-val">USD $</span>
                  </Link>
                  <Link href="/settings" className="sd-set-item" onClick={() => setSettingsOpen(false)}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Region</span>
                    <span className="sd-set-val">America Latina</span>
                  </Link>
                </div>
              </div>

              {user && profile ? (
                <>
                  <Link href="/favorites" className="sd-nav-icon" title="Favoritos">
                    <i className="far fa-heart"></i>
                  </Link>

                  {/* Messages */}
                  <Link href="/messages" className="sd-nav-icon" title="Mensajes">
                    <i className="far fa-comment-dots"></i>
                  </Link>

                  {/* Notifications */}
                  <div className={`sd-nav-notif${notifOpen ? " open" : ""}`} ref={notifRef}>
                    <button
                      className="sd-nav-icon"
                      title="Notificaciones"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifOpen(!notifOpen);
                        setUserMenuOpen(false);
                        setSettingsOpen(false);
                      }}
                    >
                      <i className="far fa-bell"></i>
                    </button>
                    <div className="sd-nav-notif-dd">
                      <div className="sd-notif-header">
                        <span className="sd-notif-h">Notificaciones</span>
                        <Link href="/notifications" className="sd-notif-link" onClick={() => setNotifOpen(false)}>
                          Ver todas
                        </Link>
                      </div>
                      <div className="sd-notif-list">
                        <div className="sd-notif-empty">
                          <i className="far fa-bell-slash"></i>
                          <p>Sin notificaciones</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart */}
                  <Link href="/cart" className="sd-nav-icon" title="Carrito">
                    <i className="fas fa-shopping-cart"></i>
                  </Link>

                  {/* User */}
                  <div className={`sd-nav-user${userMenuOpen ? " open" : ""}`} ref={userRef}>
                    <button
                      className="sd-nav-user-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen(!userMenuOpen);
                        setNotifOpen(false);
                        setSettingsOpen(false);
                      }}
                    >
                      <div className="sd-nav-avatar">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="" />
                        ) : (
                          initials
                        )}
                      </div>
                    </button>
                    <div className="sd-nav-user-menu">
                      <Link href="/profile" className="sd-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-user"></i> Mi perfil
                      </Link>
                      <Link href="/purchases" className="sd-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-shopping-bag"></i> Mis compras
                      </Link>
                      <Link href="/sales" className="sd-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-receipt"></i> Mis ventas
                      </Link>
                      <Link href="/earnings" className="sd-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-coins"></i> Ganancias
                      </Link>
                      <div className="sd-menu-div"></div>
                      <Link href="/my-products" className="sd-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-box"></i> Mis productos
                      </Link>
                      <Link href="/sell" className="sd-menu-item blue" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-plus-circle"></i> Vender producto
                      </Link>
                      <div className="sd-menu-div"></div>
                      <Link href="/safedeal-plus" className="sd-menu-item" style={{ color: "#f55a13" }} onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-crown" style={{ color: "#f55a13" }}></i> SafeDeal+
                      </Link>
                      <Link href="/settings" className="sd-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <i className="fas fa-cog"></i> Configuración
                      </Link>
                      <button
                        className="sd-menu-item red"
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut();
                        }}
                      >
                        <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              ) : !loading ? (
                <>
                  <Link href="/cart" className="sd-nav-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </Link>
                  <div className="sd-nav-auth-wrap">
                    <Link href="/login" className="sd-nav-auth-btn" title="Mi cuenta">
                      <i className="far fa-user"></i>
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* ROW 2: Search */}
          <div className="sd-mob-row2">
            <div
              className={`sd-nav-search${searchOpen ? " open" : ""}${hasText ? " has-text" : ""}`}
              id="sdSearchBox"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} autoComplete="off">
                <input
                  type="text"
                  name="q"
                  placeholder="¿Qué estás buscando?"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => {
                    setSearchOpen(true);
                    if (typeof window !== "undefined" && window.innerWidth <= 768) {
                      setExpanded(true);
                    }
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="sd-nav-search-clear"
                  title="Limpiar"
                  onClick={handleSearchClear}
                >
                  <i className="fas fa-times"></i>
                </button>
                <button type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </form>

              {/* Search dropdown */}
              <div className="sd-search-dd">
                {suggActive && suggestions.length > 0 ? (
                  <>
                    <div className="sd-search-sec">
                      {suggestions.map((s, i) => (
                        <Link
                          key={`${s.slug}-${i}`}
                          href={`/product/${s.slug}`}
                          className="sd-search-item"
                          onClick={() => {
                            setSearchOpen(false);
                            setExpanded(false);
                          }}
                        >
                          {s.image ? (
                            <img className="sd-sugg-img" src={s.image} alt="" loading="lazy" />
                          ) : (
                            <div className="sd-sugg-img-ph">
                              <i className="fas fa-box"></i>
                            </div>
                          )}
                          <div className="sd-sugg-body">
                            <div className="sd-sugg-name">{s.title}</div>
                            <div className="sd-sugg-cat">{s.category}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="sd-sugg-footer"
                      onClick={() => {
                        setSearchOpen(false);
                        setExpanded(false);
                      }}
                    >
                      <i className="fas fa-search"></i> Ver todos los resultados
                    </Link>
                  </>
                ) : suggActive && suggestions.length === 0 ? (
                  <div className="sd-sugg-empty">
                    Sin resultados para &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  /* Default: Popular searches */
                  <div className="sd-search-sec">
                    <div className="sd-search-sec-title">Populares ahora</div>
                    {POPULAR_SEARCHES.map((ps) => (
                      <Link
                        key={ps.query}
                        href={`/search?q=${ps.query}`}
                        className="sd-search-item"
                        onClick={() => {
                          setSearchOpen(false);
                          setExpanded(false);
                        }}
                      >
                        <i className="fas fa-fire fire-icon" style={{ color: "#f55a13", background: "transparent" }}></i>
                        <span>{ps.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className="sd-search-cancel"
              onClick={handleSearchCancel}
            >
              Cancelar
            </button>
          </div>

        </div>
      </nav>

      {/* ===== CATEGORIES BAR ===== */}
      <div className="sd-cat-bar">
        <div className="sd-cat-bar-inner">
          {CAT_BAR_ITEMS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="sd-cat-bar-link"
            >
              <i className={`fas ${cat.icon}`}></i>
              {cat.label}
            </Link>
          ))}
          <Link href="/sell" className="sd-cat-bar-link sell">
            <i className="fas fa-plus"></i>
            Vender
          </Link>
        </div>
      </div>

      {/* ===== CATEGORY SIDEBAR OVERLAY ===== */}
      <div
        className={`sd-cat-overlay${catPanelOpen ? " open" : ""}`}
        onClick={closeCatPanel}
      ></div>

      {/* ===== CATEGORY SIDEBAR PANEL ===== */}
      <div className={`sd-cat-panel${catPanelOpen ? " open" : ""}`}>
        {SIDEBAR_CATEGORIES.map((section, si) => (
          <div key={section.section}>
            {si > 0 && <div className="sd-cat-divider"></div>}
            <div className="sd-cat-section-label">{section.section}</div>
            {section.items.map((item) => (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="sd-cat-link"
                onClick={closeCatPanel}
              >
                <i className={`${item.iconPrefix || "fas"} ${item.icon} sd-cat-icon`}></i>
                <span>{item.label}</span>
                {item.badge && item.badgeColor === "hot" && (
                  <span className="sd-hot">{item.badge}</span>
                )}
                {item.badge && item.badgeColor === "new" && (
                  <span className="sd-new">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
