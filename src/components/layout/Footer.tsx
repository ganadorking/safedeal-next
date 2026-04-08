import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#1C1C1D",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        WebkitFontSmoothing: "antialiased",
        color: "rgba(255,255,255,0.75)",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
        {/* Trust Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            gap: 12,
            flexWrap: "wrap" as const,
          }}
        >
          {[
            { icon: "fas fa-shield-alt", strong: "Escrow protegido", text: " — tu dinero seguro siempre" },
            { icon: "fas fa-bolt", strong: "Entrega instantanea", text: " — mayoria de productos" },
            { icon: "fas fa-undo-alt", strong: "Garantia 14 dias", text: " — sin preguntas" },
            { icon: "fas fa-headset", strong: "Soporte 24/7", text: "" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}
            >
              <i
                className={item.icon}
                style={{ fontSize: 14, color: "#0075FF" }}
              />
              <span>
                <strong style={{ color: "#fff", fontWeight: 600 }}>
                  {item.strong}
                </strong>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: 48,
            padding: "36px 0 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: -0.4,
                color: "#fff",
                marginBottom: 10,
                textDecoration: "none",
              }}
            >
              Safe
              <span style={{ color: "#E6007E" }}>Deal</span>
            </Link>
            <p
              style={{
                fontSize: 12.5,
                color: "#9AA0B0",
                lineHeight: 1.6,
                maxWidth: 240,
                marginBottom: 18,
                marginTop: 10,
              }}
            >
              El marketplace P2P de productos digitales. Compra y vende con
              seguridad total gracias al sistema escrow integrado.
            </p>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {[
                "fab fa-instagram",
                "fab fa-tiktok",
                "fab fa-twitter",
                "fab fa-youtube",
                "fab fa-telegram-plane",
                "fab fa-discord",
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#282829",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    color: "#9AA0B0",
                    fontSize: 14,
                    transition: "all 0.15s",
                  }}
                >
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h5
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#fff",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Comprar
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { href: "/search?sort=popular", label: "Mas vendidos" },
                { href: "/search?sort=new", label: "Novedades", badge: "NEW", badgeStyle: { background: "rgba(255,255,255,0.1)", color: "#fff" } },
                { href: "/search?sort=discount", label: "Ofertas", badge: "HOT", badgeStyle: { background: "#E6007E", color: "#fff" } },
                { href: "/category/videojuegos", label: "Videojuegos" },
                { href: "/category/gift-cards", label: "Gift Cards" },
                { href: "/category/software", label: "Software" },
                { href: "/category/suscripciones", label: "Streaming" },
                { href: "/how-to-buy", label: "Como comprar" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      padding: "5px 0",
                      transition: "color 0.14s",
                    }}
                  >
                    {item.label}
                    {item.badge && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 4,
                          ...item.badgeStyle,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vender */}
          <div>
            <h5
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#fff",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Vender
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { href: "/sell", label: "Publicar producto" },
                { href: "/fees", label: "Comisiones" },
                { href: "/seller-levels", label: "Niveles de vendedor" },
                {
                  href: "/safedeal-plus",
                  label: "SafeDeal+",
                  prefix: (
                    <i
                      className="fas fa-crown"
                      style={{ fontSize: 9, color: "#E6007E" }}
                    />
                  ),
                  badge: "PRO",
                  badgeStyle: {
                    background: "rgba(230,0,126,0.15)",
                    color: "#E6007E",
                    border: "1px solid rgba(230,0,126,0.2)",
                  },
                },
                { href: "/become-verified", label: "Verificacion" },
                { href: "/payouts", label: "Retiro de ganancias" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      padding: "5px 0",
                      transition: "color 0.14s",
                    }}
                  >
                    {"prefix" in item && item.prefix}
                    {item.label}
                    {"badge" in item && item.badge && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 4,
                          ...(item.badgeStyle || {}),
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SafeDeal */}
          <div>
            <h5
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#fff",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              SafeDeal
            </h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { href: "/help", label: "Centro de ayuda" },
                { href: "/how-it-works", label: "Como funciona el Escrow" },
                { href: "/disputes", label: "Abrir disputa" },
                { href: "/faq", label: "Preguntas frecuentes" },
                { href: "/affiliates", label: "Afiliados" },
                { href: "/about", label: "Sobre nosotros" },
                {
                  href: "/status",
                  label: "Estado",
                  badge: "OK",
                  badgeStyle: {
                    background: "rgba(34,197,94,0.12)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.2)",
                  },
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      padding: "5px 0",
                      transition: "color 0.14s",
                    }}
                  >
                    {item.label}
                    {"badge" in item && item.badge && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 4,
                          ...(item.badgeStyle || {}),
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            gap: 16,
            flexWrap: "wrap" as const,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.07em",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Metodos de pago
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexWrap: "wrap" as const,
              }}
            >
              {[
                { icon: "fab fa-cc-visa", label: "Visa" },
                { icon: "fab fa-cc-mastercard", label: "Mastercard" },
                { icon: "fab fa-cc-paypal", label: "PayPal" },
                { icon: "fab fa-bitcoin", label: "Bitcoin" },
                { icon: "fab fa-ethereum", label: "Ethereum" },
                { icon: "fas fa-dollar-sign", label: "USDT" },
                { icon: "fas fa-university", label: "Transferencia" },
              ].map((method, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "#282829",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 11,
                    color: "#9AA0B0",
                  }}
                >
                  <i className={method.icon} style={{ fontSize: 14 }} />
                  {method.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            gap: 14,
            flexWrap: "wrap" as const,
          }}
          className="footer-bottom"
        >
          <div style={{ fontSize: 12, color: "#3A3A3C" }}>
            &copy; {new Date().getFullYear()}{" "}
            <strong style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
              SafeDeal Technologies
            </strong>
            . Todos los derechos reservados.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11.5,
              color: "#3A3A3C",
            }}
          >
            <i
              className="fas fa-lock"
              style={{ color: "#22c55e", fontSize: 12 }}
            />
            Transacciones protegidas por Escrow SafeDeal
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {[
              { href: "/terms", label: "Terminos" },
              { href: "/privacy", label: "Privacidad" },
              { href: "/cookies", label: "Cookies" },
              { href: "/sitemap", label: "Sitemap" },
            ].map((item, i) => (
              <span key={item.href} style={{ display: "flex", alignItems: "center" }}>
                <Link
                  href={item.href}
                  style={{
                    fontSize: 12,
                    color: "#3A3A3C",
                    padding: "2px 7px",
                    transition: "color 0.14s",
                    borderRadius: 4,
                  }}
                >
                  {item.label}
                </Link>
                {i < 3 && (
                  <span style={{ color: "rgba(255,255,255,0.08)" }}>
                    &middot;
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CSS in globals.css */}
    </footer>
  );
}
