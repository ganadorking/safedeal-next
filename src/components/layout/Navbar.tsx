"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  // New dropdowns
  const [favOpen, setFavOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favItems, setFavItems] = useState<{id:number;title:string;slug:string;price:string;image:string|null}[]>([]);
  const [cartItems, setCartItems] = useState<{id:number;title:string;slug:string;price:string;image:string|null;quantity:number}[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Auth popup
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authPanel, setAuthPanel] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Register fields
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const favRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
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
      if (favRef.current && !favRef.current.contains(t)) {
        setFavOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(t)) {
        setMsgOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(t)) {
        setCartOpen(false);
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

  const fetchFavorites = useCallback(() => {
    fetch("/api/favorites")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.favorites) {
          setFavItems(d.favorites.slice(0, 5).map((f: { product: { id: number; title: string; slug: string; price: string; mainImage: string | null } }) => ({
            id: f.product.id,
            title: f.product.title,
            slug: f.product.slug,
            price: f.product.price,
            image: f.product.mainImage,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const fetchCartItems = useCallback(() => {
    fetch("/api/cart")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.cartItems) {
          const items = d.cartItems.slice(0, 5).map((c: { product: { id: number; title: string; slug: string; price: string; mainImage: string | null }; quantity: number }) => ({
            id: c.product.id,
            title: c.product.title,
            slug: c.product.slug,
            price: c.product.price,
            image: c.product.mainImage,
            quantity: c.quantity,
          }));
          setCartItems(items);
          setCartTotal(d.cartItems.reduce((s: number, c: { product: { price: string }; quantity: number }) => s + Number(c.product.price) * c.quantity, 0));
        }
      })
      .catch(() => {});
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

  const closeAllDropdowns = () => {
    setUserMenuOpen(false);
    setNotifOpen(false);
    setSettingsOpen(false);
    setFavOpen(false);
    setMsgOpen(false);
    setCartOpen(false);
  };

  const closeCatPanel = () => {
    setCatPanelOpen(false);
    setHamOpen(false);
  };

  // Password strength
  const passStrength = (() => {
    let s = 0;
    if (regPassword.length >= 8) s++;
    if (/[A-Z]/.test(regPassword)) s++;
    if (/[0-9]/.test(regPassword)) s++;
    if (/[^a-zA-Z0-9]/.test(regPassword)) s++;
    return s;
  })();
  const strengthLabel = ["", "Debil", "Regular", "Buena", "Fuerte"][passStrength] || "";
  const strengthColor = ["#EBEBEC", "#ef4444", "#f59e0b", "#4A7CF7", "#10b981"][passStrength] || "#EBEBEC";

  function closeAuthPopup() {
    setAuthPopupOpen(false);
    setAuthError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        if (error.message.includes("Invalid login")) {
          setAuthError("Email o contrasena incorrectos");
        } else if (error.message.includes("Email not confirmed")) {
          setAuthError("Debes confirmar tu email antes de iniciar sesion");
        } else {
          setAuthError(error.message);
        }
        return;
      }
      closeAuthPopup();
      setLoginEmail("");
      setLoginPassword("");
      router.push("/");
      router.refresh();
    } catch {
      setAuthError("Error inesperado. Intenta de nuevo.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    // Validate
    if (!regFirstName.trim() || !regLastName.trim()) {
      setAuthError("Nombre y apellido son obligatorios");
      return;
    }
    if (regUsername.length < 3) {
      setAuthError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(regUsername)) {
      setAuthError("El nombre de usuario solo puede contener letras, numeros y guion bajo");
      return;
    }
    if (regPassword.length < 8) {
      setAuthError("La contrasena debe tener al menos 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(regPassword)) {
      setAuthError("La contrasena debe tener al menos una letra mayuscula");
      return;
    }
    if (!/[0-9]/.test(regPassword)) {
      setAuthError("La contrasena debe tener al menos un numero");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError("Las contrasenas no coinciden");
      return;
    }
    setAuthLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: { data: { username: regUsername } },
      });
      if (authError) {
        if (authError.message.includes("already registered")) {
          setAuthError("Este email ya esta registrado");
        } else {
          setAuthError(authError.message);
        }
        return;
      }
      if (!authData.user) {
        setAuthError("Error al crear la cuenta. Intenta de nuevo.");
        return;
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          firstName: regFirstName.trim(),
          lastName: regLastName.trim(),
          supabaseId: authData.user.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setAuthError(data.error || "Error al crear el perfil");
        return;
      }
      closeAuthPopup();
      router.push("/login?registered=1");
    } catch {
      setAuthError("Error inesperado. Intenta de nuevo.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleAuth() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/api/auth/callback",
      },
    });
  }

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
                <span style={{ color: "#4A7CF7" }}>Deal</span>
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
                    const opening = !settingsOpen;
                    closeAllDropdowns();
                    setSettingsOpen(opening);
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
                  {/* Favorites dropdown */}
                  <div className={`sd-nav-notif${favOpen ? " open" : ""}`} ref={favRef}>
                    <button
                      className="sd-nav-icon"
                      title="Favoritos"
                      onClick={(e) => {
                        e.stopPropagation();
                        const opening = !favOpen;
                        closeAllDropdowns();
                        setFavOpen(opening);
                        if (opening) fetchFavorites();
                      }}
                    >
                      <i className="far fa-heart"></i>
                    </button>
                    <div className="sd-nav-notif-dd">
                      <div className="sd-notif-header">
                        <span className="sd-notif-h">Favoritos</span>
                        <Link href="/favorites" className="sd-notif-link" onClick={() => setFavOpen(false)}>Ver todos</Link>
                      </div>
                      <div className="sd-notif-list">
                        {favItems.length === 0 ? (
                          <div className="sd-notif-empty">
                            <i className="far fa-heart" style={{fontSize:24,marginBottom:6,display:"block",color:"#E5E7EB"}}></i>
                            <p>Sin favoritos aun</p>
                          </div>
                        ) : (
                          favItems.map(f => (
                            <Link key={f.id} href={`/product/${f.slug}`} className="sd-search-item" onClick={() => setFavOpen(false)}>
                              {f.image ? (
                                <img className="sd-sugg-img" src={f.image} alt="" loading="lazy" />
                              ) : (
                                <div className="sd-sugg-img-ph"><i className="fas fa-box"></i></div>
                              )}
                              <div className="sd-sugg-body">
                                <div className="sd-sugg-name">{f.title}</div>
                                <div style={{fontSize:13,fontWeight:700,color:"#4A7CF7"}}>${Number(f.price).toFixed(2)}</div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="sd-notif-footer">
                        <Link href="/favorites" onClick={() => setFavOpen(false)}>Ver todos los favoritos</Link>
                      </div>
                    </div>
                  </div>

                  {/* Messages dropdown */}
                  <div className={`sd-nav-notif${msgOpen ? " open" : ""}`} ref={msgRef}>
                    <button
                      className="sd-nav-icon"
                      title="Mensajes"
                      onClick={(e) => {
                        e.stopPropagation();
                        const opening = !msgOpen;
                        closeAllDropdowns();
                        setMsgOpen(opening);
                      }}
                    >
                      <i className="far fa-comment-dots"></i>
                    </button>
                    <div className="sd-nav-notif-dd">
                      <div className="sd-notif-header">
                        <span className="sd-notif-h">Mensajes</span>
                        <Link href="/messages" className="sd-notif-link" onClick={() => setMsgOpen(false)}>Ver todos</Link>
                      </div>
                      <div className="sd-notif-list">
                        <div className="sd-notif-empty">
                          <i className="far fa-comment-dots" style={{fontSize:24,marginBottom:6,display:"block",color:"#E5E7EB"}}></i>
                          <p>Sin mensajes nuevos</p>
                        </div>
                      </div>
                      <div className="sd-notif-footer">
                        <Link href="/messages/new" onClick={() => setMsgOpen(false)}>Nuevo mensaje</Link>
                      </div>
                    </div>
                  </div>

                  {/* Notifications dropdown */}
                  <div className={`sd-nav-notif${notifOpen ? " open" : ""}`} ref={notifRef}>
                    <button
                      className="sd-nav-icon"
                      title="Notificaciones"
                      onClick={(e) => {
                        e.stopPropagation();
                        const opening = !notifOpen;
                        closeAllDropdowns();
                        setNotifOpen(opening);
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

                  {/* Cart dropdown */}
                  <div className={`sd-nav-notif${cartOpen ? " open" : ""}`} ref={cartRef}>
                    <button
                      className="sd-nav-icon"
                      title="Carrito"
                      onClick={(e) => {
                        e.stopPropagation();
                        const opening = !cartOpen;
                        closeAllDropdowns();
                        setCartOpen(opening);
                        if (opening) fetchCartItems();
                      }}
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <div className="sd-nav-notif-dd" style={{width:380}}>
                      <div className="sd-notif-header">
                        <span className="sd-notif-h">Carrito</span>
                        <Link href="/cart" className="sd-notif-link" onClick={() => setCartOpen(false)}>Ver carrito</Link>
                      </div>
                      <div className="sd-notif-list">
                        {cartItems.length === 0 ? (
                          <div className="sd-notif-empty">
                            <i className="fas fa-shopping-cart" style={{fontSize:24,marginBottom:6,display:"block",color:"#E5E7EB"}}></i>
                            <p>Tu carrito esta vacio</p>
                          </div>
                        ) : (
                          cartItems.map(c => (
                            <Link key={c.id} href={`/product/${c.slug}`} className="sd-search-item" onClick={() => setCartOpen(false)}>
                              {c.image ? (
                                <img className="sd-sugg-img" src={c.image} alt="" loading="lazy" />
                              ) : (
                                <div className="sd-sugg-img-ph"><i className="fas fa-box"></i></div>
                              )}
                              <div className="sd-sugg-body">
                                <div className="sd-sugg-name">{c.title}</div>
                                <div style={{fontSize:13,fontWeight:700,color:"#4A7CF7"}}>${Number(c.price).toFixed(2)} x{c.quantity}</div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                      {cartItems.length > 0 && (
                        <div style={{padding:"12px 16px",borderTop:"1px solid #F5F5F6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:14,fontWeight:700,color:"#0A0A0B"}}>Total: ${cartTotal.toFixed(2)}</span>
                          <Link href="/checkout" onClick={() => setCartOpen(false)} style={{fontSize:13,color:"#fff",background:"#4A7CF7",padding:"8px 16px",borderRadius:8,fontWeight:700,textDecoration:"none"}}>
                            Comprar
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User */}
                  <div className={`sd-nav-user${userMenuOpen ? " open" : ""}`} ref={userRef}>
                    <button
                      className="sd-nav-user-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const opening = !userMenuOpen;
                        closeAllDropdowns();
                        setUserMenuOpen(opening);
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
                  <button className="sd-nav-icon" onClick={() => { setAuthPopupOpen(true); setAuthPanel("login"); setAuthError(""); }} title="Carrito">
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                  <div className="sd-nav-auth-wrap">
                    <button
                      className="sd-nav-auth-btn"
                      title="Mi cuenta"
                      onClick={() => {
                        setAuthPopupOpen(true);
                        setAuthPanel("login");
                        setAuthError("");
                      }}
                    >
                      <i className="far fa-user"></i>
                    </button>
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

      {/* ===== AUTH POPUP ===== */}
      {authPopupOpen && (
        <div className="sd-auth-overlay show" onClick={closeAuthPopup}>
          <div
            className="sd-auth-popup open"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sd-mob-handle"></div>
            <div className="sd-ap-header">
              <button
                className="sd-ap-close"
                onClick={closeAuthPopup}
                aria-label="Cerrar"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* LOGIN PANEL */}
            <div className={`sd-ap-panel${authPanel === "login" ? " active" : ""}`}>
              <div className="sd-ap-title">Bienvenido de vuelta</div>
              <div className="sd-ap-sub">Ingresa a tu cuenta SafeDeal</div>

              {authError && authPanel === "login" && (
                <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13 }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="sd-ap-field">
                  <i className="fas fa-envelope sd-input-icon"></i>
                  <input
                    type="email"
                    placeholder=" "
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <label>Correo electrónico</label>
                </div>
                <div className="sd-ap-field">
                  <i className="fas fa-lock sd-input-icon"></i>
                  <input
                    type="password"
                    placeholder=" "
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <label>Contraseña</label>
                </div>
                <Link href="/forgot-password" className="sd-ap-forgot" onClick={closeAuthPopup}>
                  ¿Olvidaste tu contraseña?
                </Link>
                <button type="submit" className="sd-ap-submit" disabled={authLoading}>
                  {authLoading ? "Iniciando sesion..." : "Iniciar sesión"}
                </button>
              </form>

              <div className="sd-ap-or"><span>o continúa con</span></div>
              <button type="button" className="sd-ap-google" onClick={handleGoogleAuth}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>
              <div className="sd-ap-switch">
                ¿No tienes cuenta?{" "}
                <a onClick={() => { setAuthPanel("register"); setAuthError(""); }}>
                  Regístrate gratis
                </a>
              </div>
            </div>

            {/* REGISTER PANEL */}
            <div className={`sd-ap-panel${authPanel === "register" ? " active" : ""}`}>
              <div className="sd-ap-title">Crear cuenta</div>
              <div className="sd-ap-sub">Es gratis y solo toma un minuto</div>

              {authError && authPanel === "register" && (
                <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13 }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="sd-ap-row">
                  <div className="sd-ap-field">
                    <input
                      type="text"
                      placeholder=" "
                      required
                      className="no-icon"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                    />
                    <label className="no-icon">Nombre</label>
                  </div>
                  <div className="sd-ap-field">
                    <input
                      type="text"
                      placeholder=" "
                      required
                      className="no-icon"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                    />
                    <label className="no-icon">Apellido</label>
                  </div>
                </div>
                <div className="sd-ap-field">
                  <input
                    type="text"
                    placeholder=" "
                    required
                    autoComplete="username"
                    className="no-icon"
                    pattern="[a-zA-Z0-9_]{3,20}"
                    title="3-20 caracteres, solo letras, números y _"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase())}
                  />
                  <label className="no-icon">Nombre de usuario</label>
                </div>
                <div className="sd-ap-field">
                  <i className="fas fa-envelope sd-input-icon"></i>
                  <input
                    type="email"
                    placeholder=" "
                    required
                    autoComplete="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                  <label>Correo electrónico</label>
                </div>
                {/* Password with toggle */}
                <div className="sd-ap-field sd-pass-wrap">
                  <i className="fas fa-lock sd-input-icon"></i>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    placeholder=" "
                    required
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <label>Contraseña</label>
                  <button
                    type="button"
                    className="sd-pass-toggle"
                    tabIndex={-1}
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    <i className={`far ${showRegPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {/* Strength bar */}
                {regPassword.length > 0 && (
                  <>
                    <div className="sd-strength-bar">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className="sd-strength-seg"
                          style={{ background: i <= passStrength ? strengthColor : "#EBEBEC" }}
                        ></div>
                      ))}
                    </div>
                    <div className="sd-strength-lbl" style={{ color: strengthColor }}>{strengthLabel}</div>
                    <div className="sd-pass-reqs">
                      <div className={`sd-req${regPassword.length >= 8 ? " met" : ""}`}>
                        <i className="fas fa-circle"></i> Mínimo 8 caracteres
                      </div>
                      <div className={`sd-req${/[A-Z]/.test(regPassword) ? " met" : ""}`}>
                        <i className="fas fa-circle"></i> Una letra mayúscula
                      </div>
                      <div className={`sd-req${/[0-9]/.test(regPassword) ? " met" : ""}`}>
                        <i className="fas fa-circle"></i> Un número
                      </div>
                      <div className={`sd-req${/[^a-zA-Z0-9]/.test(regPassword) ? " met" : ""}`}>
                        <i className="fas fa-circle"></i> Un carácter especial (!@#$...)
                      </div>
                    </div>
                  </>
                )}
                {/* Confirm password */}
                <div className="sd-ap-field sd-pass-wrap">
                  <i className="fas fa-lock sd-input-icon"></i>
                  <input
                    type={showRegConfirm ? "text" : "password"}
                    placeholder=" "
                    required
                    autoComplete="new-password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                  <label>Confirmar contraseña</label>
                  <button
                    type="button"
                    className="sd-pass-toggle"
                    tabIndex={-1}
                    onClick={() => setShowRegConfirm(!showRegConfirm)}
                  >
                    <i className={`far ${showRegConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {regConfirmPassword.length > 0 && (
                  <div
                    className="sd-confirm-msg"
                    style={{ color: regPassword === regConfirmPassword ? "#10b981" : "#ef4444" }}
                  >
                    {regPassword === regConfirmPassword
                      ? "Las contrasenas coinciden"
                      : "Las contrasenas no coinciden"}
                  </div>
                )}
                <button type="submit" className="sd-ap-submit" disabled={authLoading}>
                  {authLoading ? "Creando cuenta..." : "Crear cuenta gratis"}
                </button>
              </form>

              <div className="sd-ap-or"><span>o regístrate con</span></div>
              <button type="button" className="sd-ap-google" onClick={handleGoogleAuth}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>
              <div className="sd-ap-switch">
                ¿Ya tienes cuenta?{" "}
                <a onClick={() => { setAuthPanel("login"); setAuthError(""); }}>
                  Inicia sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
