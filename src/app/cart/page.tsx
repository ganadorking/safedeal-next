import Link from "next/link";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          seller: { select: { username: true } },
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <div className="sct" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 24 }}>
          <i className="fas fa-shopping-cart" style={{ color: "#4A7CF7", marginRight: 10 }} />
          Mi carrito
        </h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: 48, color: "#E2E8F0", marginBottom: 16, display: "block" }} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>
              Tu carrito esta vacio
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 20 }}>
              Explora nuestros productos y agrega los que te gusten.
            </p>
            <Link
              href="/search"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", background: "#4A7CF7", color: "#fff",
                borderRadius: 10, fontSize: 14, fontWeight: 700,
              }}
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cartItems.map((item) => {
                const price = Number(item.product.price);
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex", gap: 16, padding: 16,
                      border: "1px solid #E2E8F0", borderRadius: 14,
                      background: "#fff",
                    }}
                  >
                    <div style={{
                      width: 80, height: 100, borderRadius: 10,
                      background: "#F8FAFC", overflow: "hidden", flexShrink: 0,
                    }}>
                      {item.product.mainImage && (
                        <img
                          src={item.product.mainImage}
                          alt={item.product.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        href={`/product/${item.product.slug}`}
                        style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}
                      >
                        {item.product.title}
                      </Link>
                      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                        {item.product.seller.username} &middot; {item.product.category.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#4A7CF7" }}>
                        ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{
              border: "1px solid #E2E8F0", borderRadius: 14,
              padding: 20, background: "#fff", position: "sticky", top: 110,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
                Resumen
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}>
                <span>Subtotal ({cartItems.length} productos)</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: "#E2E8F0", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                <span>Total</span>
                <span style={{ color: "#4A7CF7" }}>${total.toFixed(2)}</span>
              </div>
              <Link
                href={`/checkout`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", height: 44, background: "#4A7CF7", color: "#fff",
                  borderRadius: 10, fontSize: 14, fontWeight: 700,
                }}
              >
                Pagar ahora
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
