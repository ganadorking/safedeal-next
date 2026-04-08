import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Categories
  const categories = [
    { name: "Videojuegos", slug: "videojuegos", icon: "fas fa-gamepad", description: "Juegos, DLCs, monedas y claves para todas las plataformas.", sortOrder: 1 },
    { name: "Gift Cards", slug: "gift-cards", icon: "fas fa-gift", description: "Tarjetas de regalo para gaming, streaming, compras.", sortOrder: 2 },
    { name: "Software", slug: "software", icon: "fas fa-laptop-code", description: "Licencias de software, sistemas operativos, seguridad.", sortOrder: 3 },
    { name: "Suscripciones", slug: "streaming", icon: "fas fa-play-circle", description: "Servicios de streaming, m\u00fasica y entretenimiento.", sortOrder: 4 },
    { name: "Cuentas", slug: "cuentas", icon: "fas fa-user-circle", description: "Cuentas premium de streaming, dise\u00f1o, software.", sortOrder: 5 },
    { name: "Servicios", slug: "servicios", icon: "fas fa-concierge-bell", description: "Dise\u00f1o gr\u00e1fico, desarrollo web, edici\u00f3n de video.", sortOrder: 6 },
    { name: "Desarrollo Web", slug: "desarrollo-web", icon: "fas fa-code", description: "Plantillas, plugins, temas y componentes.", sortOrder: 7 },
    { name: "Criptomonedas", slug: "criptomonedas", icon: "fas fa-coins", description: "Trading tools, se\u00f1ales y herramientas cripto.", sortOrder: 8 },
    { name: "Educaci\u00f3n", slug: "educacion", icon: "fas fa-graduation-cap", description: "Cursos, ebooks y recursos de aprendizaje.", sortOrder: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("Categories seeded:", categories.length);

  // Demo user (seller)
  const seller = await prisma.user.upsert({
    where: { email: "demo@safedeal.com" },
    update: {},
    create: {
      username: "SafeDealStore",
      email: "demo@safedeal.com",
      passwordHash: "supabase-managed",
      isSeller: true,
      isVerified: true,
      sellerLevel: "pro",
      rating: 4.8,
      totalSales: 150,
      successRate: 98.5,
      status: "active",
      emailVerified: true,
    },
  });

  // Demo products
  const catMap = await prisma.category.findMany();
  const products = [
    { title: "Minecraft Java & Bedrock Edition - Key Global", slug: "minecraft-java-bedrock-key-" + Date.now(), price: 19.99, originalPrice: 29.99, categorySlug: "videojuegos", deliveryType: "instant", stock: 50, salesCount: 89, rating: 4.7, reviewCount: 34, shortDescription: "Key oficial de Minecraft Java + Bedrock para PC. Activaci\u00f3n global instant\u00e1nea." },
    { title: "Netflix Premium 4K - 1 Mes", slug: "netflix-premium-4k-1mes-" + Date.now(), price: 4.99, originalPrice: 9.99, categorySlug: "streaming", deliveryType: "instant", stock: 100, salesCount: 234, rating: 4.5, reviewCount: 89, shortDescription: "Cuenta Netflix Premium 4K por 1 mes. Entrega instant\u00e1nea." },
    { title: "Spotify Premium - 3 Meses", slug: "spotify-premium-3meses-" + Date.now(), price: 7.99, originalPrice: 14.99, categorySlug: "streaming", deliveryType: "instant", stock: 80, salesCount: 156, rating: 4.6, reviewCount: 67, shortDescription: "Suscripci\u00f3n Spotify Premium por 3 meses." },
    { title: "Windows 11 Pro - Licencia Digital", slug: "windows-11-pro-key-" + Date.now(), price: 12.99, originalPrice: 29.99, categorySlug: "software", deliveryType: "instant", stock: 200, salesCount: 312, rating: 4.8, reviewCount: 145, shortDescription: "Licencia digital de Windows 11 Pro. Activaci\u00f3n online." },
    { title: "Discord Nitro - 1 A\u00f1o", slug: "discord-nitro-1year-" + Date.now(), price: 39.99, originalPrice: 49.99, categorySlug: "gift-cards", deliveryType: "instant", stock: 30, salesCount: 67, rating: 4.4, reviewCount: 23, shortDescription: "C\u00f3digo de Discord Nitro por 1 a\u00f1o. Emojis, stickers y m\u00e1s." },
    { title: "ChatGPT Plus - 1 Mes", slug: "chatgpt-plus-1mes-" + Date.now(), price: 14.99, originalPrice: 20.00, categorySlug: "cuentas", deliveryType: "instant", stock: 40, salesCount: 98, rating: 4.3, reviewCount: 41, shortDescription: "Acceso a ChatGPT Plus (GPT-4) por 1 mes." },
    { title: "Curso Completo React + Next.js", slug: "curso-react-nextjs-" + Date.now(), price: 9.99, originalPrice: 49.99, categorySlug: "educacion", deliveryType: "instant", stock: 999, salesCount: 45, rating: 4.9, reviewCount: 18, shortDescription: "Curso completo de React y Next.js. +40 horas de contenido." },
    { title: "Adobe Creative Cloud - 1 A\u00f1o", slug: "adobe-cc-1year-" + Date.now(), price: 29.99, originalPrice: 59.99, categorySlug: "software", deliveryType: "manual", stock: 15, salesCount: 23, rating: 4.6, reviewCount: 11, shortDescription: "Suscripci\u00f3n Adobe Creative Cloud completa por 1 a\u00f1o." },
    { title: "Steam Gift Card $50 USD", slug: "steam-giftcard-50usd-" + Date.now(), price: 42.99, originalPrice: 50.00, categorySlug: "gift-cards", deliveryType: "instant", stock: 60, salesCount: 178, rating: 4.8, reviewCount: 92, shortDescription: "Tarjeta de regalo Steam por $50 USD. C\u00f3digo digital." },
    { title: "Dise\u00f1o de Logo Profesional", slug: "diseno-logo-profesional-" + Date.now(), price: 24.99, originalPrice: 49.99, categorySlug: "servicios", deliveryType: "manual", stock: 10, salesCount: 34, rating: 4.7, reviewCount: 15, shortDescription: "Logo profesional con 3 propuestas y revisiones ilimitadas." },
    { title: "Xbox Game Pass Ultimate 3 Meses", slug: "xbox-gamepass-3meses-" + Date.now(), price: 22.99, originalPrice: 44.99, categorySlug: "videojuegos", deliveryType: "instant", stock: 45, salesCount: 89, rating: 4.5, reviewCount: 37, shortDescription: "Xbox Game Pass Ultimate por 3 meses. EA Play incluido." },
    { title: "Canva Pro - 1 A\u00f1o", slug: "canva-pro-1year-" + Date.now(), price: 8.99, originalPrice: 19.99, categorySlug: "software", deliveryType: "instant", stock: 70, salesCount: 112, rating: 4.6, reviewCount: 48, shortDescription: "Canva Pro con acceso a todas las funciones premium por 1 a\u00f1o." },
  ];

  for (const p of products) {
    const cat = catMap.find((c) => c.slug === p.categorySlug);
    if (!cat) continue;
    await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: cat.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        deliveryType: p.deliveryType,
        stock: p.stock,
        salesCount: p.salesCount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        shortDescription: p.shortDescription,
        description: p.shortDescription + "\n\nEntrega segura con protecci\u00f3n escrow de SafeDeal. Tu compra est\u00e1 100% protegida.",
        isActive: true,
      },
    });
  }
  console.log("Products seeded:", products.length);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
