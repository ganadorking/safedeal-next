import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const normalized = normalize(q);
  const words = normalized.split(/\s+/).filter(Boolean);

  // Build OR conditions for fuzzy matching
  const conditions = [
    { title: { contains: q, mode: "insensitive" as const } },
    ...words.map((w) => ({
      title: { contains: w, mode: "insensitive" as const },
    })),
    ...words.map((w) => ({
      tags: { contains: w, mode: "insensitive" as const },
    })),
  ];

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: { gt: 0 },
      OR: conditions,
    },
    orderBy: [{ isFeatured: "desc" }, { salesCount: "desc" }],
    take: 6,
    select: {
      title: true,
      slug: true,
      price: true,
      mainImage: true,
      category: { select: { name: true, slug: true } },
    },
  });

  const suggestions = products.map((p) => ({
    title: p.title,
    slug: p.slug,
    price: `$${Number(p.price).toFixed(2)}`,
    category: p.category.name,
    categorySlug: p.category.slug,
    image: p.mainImage || null,
  }));

  return NextResponse.json({ suggestions });
}
