import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(priceUSD: number, currency = "USD"): string {
  const currencies: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: "$", rate: 1 },
    MXN: { symbol: "$", rate: 17.5 },
    EUR: { symbol: "\u20ac", rate: 0.92 },
    COP: { symbol: "$", rate: 4200 },
    ARS: { symbol: "$", rate: 850 },
    BRL: { symbol: "R$", rate: 5.0 },
  };

  const cur = currencies[currency] || currencies.USD;
  const converted = priceUSD * cur.rate;
  return `${cur.symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function timeAgo(date: Date | string): string {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (diff < 60) return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} d\u00edas`;
  return new Date(date).toLocaleDateString("es-MX");
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-"
    + Math.random().toString(36).substring(2, 8);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getProductImageUrl(
  mainImage: string | null,
  title = "P"
): string {
  if (mainImage) {
    if (mainImage.startsWith("http")) {
      // If Cloudinary URL, add auto-optimization
      if (mainImage.includes("cloudinary")) {
        return mainImage.replace("/upload/", "/upload/w_400,h_533,c_fill,q_auto,f_webp/");
      }
      return mainImage;
    }
    // Legacy local path - shouldn't happen with Cloudinary
    return mainImage;
  }
  const letter = encodeURIComponent(title.charAt(0) || "P");
  return `https://placehold.co/400x533/0d0d1a/555?text=${letter}`;
}

export function calculateDiscount(
  original: number,
  current: number
): number {
  return original > 0
    ? Math.round(((original - current) / original) * 100)
    : 0;
}
