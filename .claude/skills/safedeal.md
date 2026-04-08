---
name: safedeal
description: |
  SafeDeal es una fintech P2P de custodia de activos digitales — el marketplace más seguro del mundo para productos digitales.
  Usa este skill siempre que trabajes en SafeDeal: features, páginas, APIs, diseño, estrategia, pricing, onboarding, disputas, pagos, verificación, o cualquier componente del ecosistema.
  
  Stack: Next.js 16 + TypeScript + Tailwind CSS + Prisma + Supabase (PostgreSQL + Auth) + Cloudinary + Stripe + Resend.
  El usuario es el fundador/CEO y desarrollador principal. Conoce el código — sé directo, no expliques lo básico, propón soluciones robustas de nivel enterprise.
---

# SafeDeal — Skill de Producto y Desarrollo

## Visión

**SafeDeal es el primer marketplace P2P de productos digitales con escrow garantizado para el mercado informal global.**

El mercado informal de productos digitales mueve miles de millones de dólares al año y es profundamente inseguro: estafas, chargebacks, cuentas baneadas, sin garantías. SafeDeal lo formaliza con un modelo de custodia (escrow) donde el dinero nunca toca al vendedor hasta que el comprador confirma la entrega.

**Misión:** Convertir el mercado digital informal más inseguro del mundo en el más seguro y confiable.

---

## Verificación y Protección al Usuario

SafeDeal protege activamente a cada usuario mediante un sistema híbrido de verificación:

### Verificación con IA
- **Moderación de contenido** — IA analiza títulos, descripciones e imágenes para detectar productos fraudulentos, ilegales o que violen las políticas
- **Detección de patrones** — Machine learning identifica comportamientos sospechosos: cuentas nuevas con precios extremadamente bajos, múltiples disputas, velocity de ventas anómala
- **Categorización inteligente** — IA sugiere categoría, plataforma, región y tags desde el título del producto
- **Análisis de riesgo** — Risk scoring automático por transacción que puede bloquear o escalar a revisión manual

### Verificación con personas reales
- **Equipo de Trust & Safety** — Agentes humanos revisan transacciones flaggeadas por la IA
- **Verificación manual de productos** — Para categorías de alto riesgo (cuentas, software), un agente confirma la autenticidad antes de liberar fondos
- **Resolución de disputas** — Equipo especializado media entre comprador y vendedor con acceso a evidencia de ambas partes
- **KYC verificado** — Proceso de verificación de identidad (documento + selfie) para vendedores que quieran badge de verificado

### Garantías
- **Escrow 100%** — El dinero del comprador NUNCA llega al vendedor sin confirmación
- **Garantía de 14 días** — Reembolso completo si el producto no es como se describió
- **Soporte 24/7** — Chat en vivo y tickets con tiempo de respuesta < 2 horas
- **Protección contra chargebacks** — El escrow absorbe el riesgo, no el vendedor

---

## Modelo de negocio

### Fuentes de ingreso
- **Comisión por transacción** — 5% sobre cada venta completada (configurable por categoría)
- **SafeDeal Plus** — Suscripción premium: $9.99/mes o $89.99/año (menor comisión 3%, listings destacados, analytics avanzado, badge PRO)
- **Afiliados** — Comisiones multinivel: signup bonus + % primera compra + % recurrente por 6 meses
- **API B2B** — Acceso para resellers y plataformas externas
- **Escrow float** — Intereses generados por fondos retenidos (largo plazo)

### Categorías de producto

| Grupo | Subcategorías clave |
|---|---|
| 🎮 Gaming | Claves/juegos, Skins & Items, Monedas in-game, Cuentas gaming |
| 📺 Entretenimiento | Streaming video/música/live, Gift Cards |
| 💻 Software | Licencias, Suscripciones, Cuentas premium |
| 🤖 IA & Tech | ChatGPT/Midjourney/Claude, Bots, Cloud computing |
| 📈 Business | Cripto & DeFi, Trading tools, Marketing digital |
| 🎓 Educación | Cursos, Ebooks, Mentorías |
| 🛠️ Servicios | Freelance, Diseño, Desarrollo web |

---

## Arquitectura técnica

### Stack
```
safedeal-next/
├── prisma/schema.prisma          ← PostgreSQL schema (Supabase)
├── src/
│   ├── app/
│   │   ├── (auth)/               ← Login, Register, Forgot/Reset Password
│   │   ├── (dashboard)/          ← Profile, Purchases, Sales, Wallet, Settings, etc.
│   │   ├── (pages)/              ← Info pages: Terms, Privacy, Help, Fees, etc.
│   │   ├── api/                  ← API routes (REST)
│   │   │   ├── auth/             ← Register, Callback, 2FA setup/verify/disable
│   │   │   ├── cart/             ← GET/POST/DELETE cart items
│   │   │   ├── checkout/         ← Create order + payment
│   │   │   ├── favorites/        ← Toggle favorites
│   │   │   ├── payment/          ← Stripe PaymentIntent (in-house)
│   │   │   ├── products/         ← CRUD products + [id]
│   │   │   ├── reviews/          ← Create reviews
│   │   │   ├── upload/           ← Cloudinary image upload
│   │   │   └── webhooks/stripe/  ← Stripe webhook handler
│   │   ├── product/[slug]/       ← Product detail
│   │   ├── category/[slug]/      ← Category page
│   │   ├── search/               ← Search with filters
│   │   ├── seller/[username]/    ← Seller profile
│   │   ├── checkout/             ← In-house payment UI (Stripe Elements)
│   │   └── order/[id]/           ← Order detail
│   ├── components/
│   │   ├── layout/               ← Navbar, Footer
│   │   ├── product/              ← ProductCard
│   │   └── ui/                   ← Modal
│   └── lib/
│       ├── prisma.ts             ← Prisma client singleton
│       ├── supabase/             ← Server + Client + Middleware clients
│       ├── auth-helpers.ts       ← getUser(), getUserLight(), requireAuth()
│       ├── cloudinary.ts         ← Upload, delete, URL optimization
│       ├── email.ts              ← Resend email templates (6 types)
│       ├── constants.ts          ← Category meta, currencies
│       └── utils.ts              ← formatPrice, timeAgo, createSlug, etc.
├── middleware.ts                  ← Auth protection + session refresh
└── .env                          ← All credentials (NEVER commit)
```

### Servicios externos
| Servicio | Uso | Config |
|---|---|---|
| **Supabase** | PostgreSQL + Auth (email/password + Google OAuth) | NEXT_PUBLIC_SUPABASE_URL, ANON_KEY |
| **Cloudinary** | Imágenes CDN (25GB free, auto-webp, resize) | CLOUDINARY_CLOUD_NAME, API_KEY, SECRET |
| **Stripe** | Pagos con tarjeta (Elements embebido, SIN branding Stripe) | STRIPE_SECRET_KEY, PUBLISHABLE_KEY, WEBHOOK_SECRET |
| **Resend** | Emails transaccionales (bienvenida, compra, venta, etc.) | RESEND_API_KEY |

### Base de datos (PostgreSQL via Supabase)
Tablas principales en Prisma:
- `users` — compradores/vendedores, supabaseId, balance, 2FA, KYC
- `products` — title, slug, price, stock, deliveryType, rating, seller relation
- `categories` — name, slug, icon, sortOrder
- `orders` + `order_items` — orderNumber, status, payment method, delivery data
- `reviews` — rating 1-5, comment, user relation
- `cart_items` + `favorites` — user-product relations
- `transactions` — wallet movements (deposit, withdrawal, sale, purchase, commission)
- `deposits` + `withdrawals` — payment flows
- `messages` + `conversations` — user messaging
- `notifications` — in-app notifications
- `disputes` — buyer-seller dispute resolution
- `affiliates` + commissions — referral system
- `homepage_banners` — promo banners
- `audit_logs` — system audit trail

---

## Flujo de escrow (core del producto)

```
① Comprador paga → ② Fondos en custodia SafeDeal → ③ Vendedor entrega →
④ Comprador confirma → ⑤ Fondos liberados (- 5% comisión)
                          ↕
                   ? Disputa → IA + Equipo humano resuelve en 24h
```

**Reglas:**
- El dinero NUNCA llega al vendedor sin confirmación del comprador
- Entrega automática (instant): código/key enviado al pagar
- Entrega manual: vendedor contacta al comprador
- Disputas resueltas por IA + equipo Trust & Safety
- Garantía 14 días de reembolso

---

## Diseño UI/UX — Gaming Theme

### Paleta de colores
```typescript
// Fondos
background: '#fafafe'        // main page bg
card: '#ffffff'              // card/panel bg  
input: '#f8f7ff'             // input bg
hover: '#f5f3ff'             // hover states

// Texto
text: '#1a1025'              // primary (headings)
textSecondary: '#6b5f7d'     // secondary (body)
textMuted: '#9389a3'         // muted (captions)

// Brand
primary: '#8b5cf6'           // purple (main accent)
primaryHover: '#7c3aed'      // purple dark
secondary: '#ec4899'         // pink (secondary accent)
accent: '#06b6d4'            // cyan (tertiary)

// Funcional
price: '#f97316'             // orange (precios siempre en naranja)
success: '#10b981'           // green
danger: '#ef4444'            // red
warning: '#f59e0b'           // amber

// Border
border: '#e8e4f0'            // subtle purple-tinted gray
```

### Navbar
- Background: `#1a1025` (dark purple)
- Logo: "Safe" white + "Deal" gradient purple→pink
- Search: white/10 bg, purple focus ring
- Icons: gray-300, hover white

### Cards
- White bg, border `#e8e4f0`, rounded-[14px]
- Hover: shadow-lg shadow-purple-500/10, border-purple-300
- Product images: aspect-ratio 3/4

### Buttons
- Primary: `bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl`
- Outline: white bg, purple border
- CSS class: `.btn-primary` (see globals.css)

### Inputs
- `bg-[#f8f7ff] border-[#e8e4f0] rounded-[10px] h-11`
- Focus: `border-purple-500 ring-2 ring-purple-500/10`
- CSS class: `.input-field`

### Footer
- Dark bg `#1a1025`
- Trust bar (escrow, entrega, garantía, soporte)
- Payment methods (Visa, Mastercard, PayPal, Bitcoin, Ethereum, USDT)

---

## Auth System

### Supabase Auth
- Email/password registration + login
- Google OAuth (via Supabase provider)
- Password reset flow (Supabase + Resend emails)
- Session managed by Supabase SSR cookies

### 2FA (Google Authenticator)
- TOTP via `otplib` package
- QR code generation via `qrcode` package
- Setup → Verify → Enable flow
- Stored in `twoFactorSecret` field (encrypted)

### Auth Helpers
```typescript
// Server-side (API routes, server components)
import { getUser } from "@/lib/auth-helpers";      // Full user
import { getUserLight } from "@/lib/auth-helpers";  // Light user (select fields)

// Client-side (React components)
import { useAuth } from "@/app/providers";          // { user, loading, signOut }
```

---

## Pagos — 100% In-House (Sin branding externo)

### Stripe Elements (tarjeta)
- NO se usa Stripe Checkout (redirect) — se usa CardElement embebido
- El usuario NUNCA ve el logo de Stripe
- Flow: createPaymentIntent → CardElement → confirmCardPayment → /api/payment/confirm
- Todo se ve como "Pago seguro por SafeDeal"

### Wallet (balance interno)
- Usuarios depositan fondos → balance en `users.balance`
- Compras se descuentan del balance
- Vendedores reciben fondos al completar venta (- comisión)

### Crypto (CoinPayments — próximamente en producción)
- Placeholder en checkout, activar post-deploy

### Webhooks
- `/api/webhooks/stripe` — maneja payment success/failure
- Actualiza orders, stock, envía emails, crea notificaciones

---

## Email System (Resend)

Templates disponibles en `src/lib/email.ts`:
- `sendWelcomeEmail` — Bienvenida al registrarse
- `sendPurchaseConfirmation` — Compra confirmada con detalles
- `sendSaleNotification` — Notificación al vendedor de nueva venta
- `sendOrderDelivered` — Producto entregado
- `sendDisputeOpened` — Disputa abierta
- `sendPasswordReset` — Link de reset de contraseña

Todos con HTML inline styled, branding SafeDeal (gradient purple→pink header).

---

## Convenciones de código

### TypeScript/Next.js
```typescript
// Server components (default)
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

// Client components
"use client";
import { useAuth } from "@/app/providers";
import { createClient } from "@/lib/supabase/client";

// API routes (Next.js 16 — params es Promise)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
}

// searchParams también es Promise
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
}
```

### Prisma
```typescript
// Always use prisma singleton
import prisma from "@/lib/prisma";

// Decimal fields need Number() conversion for display
Number(product.price).toFixed(2)

// Transactions for atomic operations
await prisma.$transaction([...]);
```

### Images (Cloudinary)
```typescript
import { uploadImage, getCloudinaryUrl } from "@/lib/cloudinary";
import { getProductImageUrl } from "@/lib/utils";  // With fallback

// Upload: POST /api/upload (multipart form data)
// Display: getProductImageUrl(mainImage, title)
// Cloudinary auto-optimization: webp, resize, CDN
```

### Utilities
```typescript
import { formatPrice, timeAgo, createSlug, calculateDiscount, truncate } from "@/lib/utils";

formatPrice(29.99)           // "$29.99"
timeAgo(new Date())          // "Hace un momento"
createSlug("Mi producto")    // "mi-producto-a3f8k2"
calculateDiscount(50, 30)    // 40 (percent)
```

---

## Rutas del proyecto (53 total)

### Públicas
`/` `/product/[slug]` `/category/[slug]` `/search` `/seller/[username]` `/checkout` `/order/[id]`

### Auth
`/login` `/register` `/forgot-password` `/reset-password`

### Dashboard (protegidas por middleware)
`/profile` `/purchases` `/sales` `/wallet` `/earnings` `/favorites` `/notifications` `/messages` `/messages/[userId]` `/messages/new` `/my-products` `/sell` `/sell/[id]/edit` `/settings` `/disputes` `/open-dispute` `/tracking` `/review/[id]` `/coupons` `/payout-settings`

### Info
`/how-it-works` `/how-to-buy` `/how-to-sell` `/help` `/terms` `/privacy` `/cookies` `/contact` `/fees` `/docs` `/safedeal-plus` `/kyc` `/trust-score` `/verified-benefits`

### APIs
`/api/me` `/api/auth/register` `/api/auth/callback` `/api/auth/2fa/setup` `/api/auth/2fa/verify` `/api/auth/2fa/disable` `/api/categories` `/api/products` `/api/products/[id]` `/api/cart` `/api/favorites` `/api/checkout` `/api/payment/create-intent` `/api/payment/confirm` `/api/reviews` `/api/upload` `/api/webhooks/stripe`

---

## Seguridad

- Auth via Supabase (JWT tokens, httpOnly cookies)
- Middleware protege rutas dashboard
- CSRF implícito via Supabase session cookies
- Rate limiting via Supabase (configurable)
- Image validation: type check + size limit (5MB) before Cloudinary upload
- SQL injection: imposible con Prisma parameterized queries
- XSS: React auto-escapes by default
- Stripe webhook signature verification
- .env NEVER committed (in .gitignore)
- Service role key ONLY used server-side

---

## Métricas clave (North Star)

- **GMV** — Volumen total de transacciones
- **Take rate** — Comisión promedio / GMV
- **Dispute rate** — % disputas / transacciones (objetivo < 2%)
- **Seller retention** — Vendedores activos mes a mes
- **Time to delivery** — Tiempo promedio de entrega
- **Trust score promedio** — Vendedores verificados
- **Conversion rate** — Visitantes → compradores

---

## Para cada nueva feature, verificar:

1. ¿Funciona el escrow? ¿El dinero está seguro?
2. ¿Hay validación server-side? (nunca confiar solo en cliente)
3. ¿Se usa `getUser()` o `getUserLight()` para auth?
4. ¿Next.js 16 params como Promise con `await`?
5. ¿Las imágenes pasan por Cloudinary?
6. ¿Se envían emails relevantes (Resend)?
7. ¿La UI sigue el Design System? (colores, tipografía, componentes)
8. ¿Se crean notificaciones in-app para las acciones?
9. ¿Stripe NO muestra su branding? (todo se ve SafeDeal)
10. ¿La verificación IA + humana está contemplada en el flujo?

---

## Roadmap

### Corto plazo
- [ ] Subastas en tiempo real (WebSocket/polling)
- [ ] Panel de afiliados completo
- [ ] Notificaciones push (web push API)
- [ ] Búsqueda semántica con embeddings
- [ ] Chat en tiempo real con Supabase Realtime

### Mediano plazo
- [ ] App móvil (React Native o PWA)
- [ ] CoinPayments integración completa
- [ ] Sistema de bundles
- [ ] API pública documentada para resellers
- [ ] Verificación KYC con Didit

### Largo plazo
- [ ] SafeDeal Pro (plan enterprise)
- [ ] Integración Web3 wallets
- [ ] Marketplace de servicios con milestones
- [ ] SafeDeal Card (tarjeta de débito para vendedores)
- [ ] Expansión LATAM (OXXO, PIX, PSE, etc.)
- [ ] Anti-fraude con IA avanzada
