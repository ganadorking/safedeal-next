import Link from "next/link";

const navItems = [
  { href: "/profile", label: "Perfil", icon: "fa-user" },
  { href: "/purchases", label: "Compras", icon: "fa-shopping-bag" },
  { href: "/sales", label: "Ventas", icon: "fa-chart-line" },
  { href: "/my-products", label: "Productos", icon: "fa-box-open" },
  { href: "/earnings", label: "Ganancias", icon: "fa-coins" },
  { href: "/favorites", label: "Favoritos", icon: "fa-heart" },
  { href: "/wallet", label: "Billetera", icon: "fa-wallet" },
  { href: "/messages", label: "Mensajes", icon: "fa-envelope" },
  { href: "/notifications", label: "Notificaciones", icon: "fa-bell" },
  { href: "/disputes", label: "Disputas", icon: "fa-gavel" },
  { href: "/payout-settings", label: "Payout", icon: "fa-building-columns" },
  { href: "/settings", label: "Configuracion", icon: "fa-gear" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#F5F5F7", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px", display: "flex", gap: 24 }}>
        {/* Sidebar */}
        <aside className="dashboard-sidebar" style={{ width: 220, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 12px", marginBottom: 8 }}>
              Mi Cuenta
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 8,
                    color: "#64748B",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: 13, color: "#94A3B8", width: 18, textAlign: "center" }} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      <style>{`
        .dashboard-sidebar a:hover {
          background: #EBEBED !important;
          color: #0F172A !important;
        }
        @media (max-width: 820px) {
          .dashboard-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
