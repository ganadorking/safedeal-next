export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "SafeDeal";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CATEGORY_META: Record<
  number,
  {
    gradient: string;
    icon: string;
    color: string;
    label: string;
    tagColor: string;
    tagBg: string;
    btnColor: string;
    cardGradient: string;
  }
> = {
  1: {
    gradient: "from-indigo-900 to-blue-800",
    icon: "Gamepad2",
    color: "#9b8df8",
    label: "Videojuego",
    tagColor: "#9b8df8",
    tagBg: "rgba(155,141,248,0.1)",
    btnColor: "#9b8df8",
    cardGradient: "linear-gradient(135deg, #0f0c29, #302b63)",
  },
  2: {
    gradient: "from-indigo-950 to-blue-900",
    icon: "Gift",
    color: "#c77dff",
    label: "Gift Card",
    tagColor: "#c77dff",
    tagBg: "rgba(199,125,255,0.1)",
    btnColor: "#c77dff",
    cardGradient: "linear-gradient(135deg, #1c1c3a, #2d1b5e)",
  },
  3: {
    gradient: "from-blue-950 to-blue-800",
    icon: "MonitorSmartphone",
    color: "#4ea8de",
    label: "Software",
    tagColor: "#4ea8de",
    tagBg: "rgba(78,168,222,0.1)",
    btnColor: "#4ea8de",
    cardGradient: "linear-gradient(135deg, #0a1628, #0d2e4a)",
  },
  4: {
    gradient: "from-blue-950 to-blue-800",
    icon: "PlayCircle",
    color: "#d084ff",
    label: "Streaming",
    tagColor: "#d084ff",
    tagBg: "rgba(208,132,255,0.1)",
    btnColor: "#d084ff",
    cardGradient: "linear-gradient(135deg, #1a0533, #3b0764)",
  },
  5: {
    gradient: "from-blue-950 to-indigo-900",
    icon: "Bot",
    color: "#4cc9f0",
    label: "IA / AI",
    tagColor: "#4cc9f0",
    tagBg: "rgba(76,201,240,0.1)",
    btnColor: "#4cc9f0",
    cardGradient: "linear-gradient(135deg, #050510, #0d0d30)",
  },
  6: {
    gradient: "from-emerald-950 to-green-800",
    icon: "TrendingUp",
    color: "#52b788",
    label: "Trading",
    tagColor: "#52b788",
    tagBg: "rgba(82,183,136,0.1)",
    btnColor: "#52b788",
    cardGradient: "linear-gradient(135deg, #071410, #0f3320)",
  },
  7: {
    gradient: "from-gray-900 to-gray-800",
    icon: "Code2",
    color: "#79c0ff",
    label: "Desarrollo",
    tagColor: "#79c0ff",
    tagBg: "rgba(121,192,255,0.1)",
    btnColor: "#79c0ff",
    cardGradient: "linear-gradient(135deg, #0d1117, #161b22)",
  },
  8: {
    gradient: "from-amber-950 to-orange-900",
    icon: "Coins",
    color: "#f7931a",
    label: "Cripto",
    tagColor: "#f7931a",
    tagBg: "rgba(247,147,26,0.1)",
    btnColor: "#f7931a",
    cardGradient: "linear-gradient(135deg, #1a0a00, #3d1c00)",
  },
  9: {
    gradient: "from-blue-950 to-indigo-800",
    icon: "GraduationCap",
    color: "#6495ed",
    label: "Curso",
    tagColor: "#6495ed",
    tagBg: "rgba(100,149,237,0.1)",
    btnColor: "#6495ed",
    cardGradient: "linear-gradient(135deg, #080830, #12125e)",
  },
  10: {
    gradient: "from-blue-950 to-blue-900",
    icon: "UserCircle",
    color: "#5cabf2",
    label: "Cuenta",
    tagColor: "#5cabf2",
    tagBg: "rgba(92,171,242,0.1)",
    btnColor: "#5cabf2",
    cardGradient: "linear-gradient(135deg, #0d1b2a, #162742)",
  },
  11: {
    gradient: "from-gray-900 to-gray-700",
    icon: "Briefcase",
    color: "#aaaaaa",
    label: "Servicio",
    tagColor: "#aaaaaa",
    tagBg: "rgba(170,170,170,0.1)",
    btnColor: "#aaaaaa",
    cardGradient: "linear-gradient(135deg, #141414, #2d2d3a)",
  },
  12: {
    gradient: "from-gray-800 to-gray-700",
    icon: "Package",
    color: "#9ca3af",
    label: "Producto Digital",
    tagColor: "#9ca3af",
    tagBg: "rgba(156,163,175,0.1)",
    btnColor: "#9ca3af",
    cardGradient: "linear-gradient(135deg, #111827, #1f2937)",
  },
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "Dólar", flag: "us" },
  { code: "MXN", symbol: "$", name: "Peso Mexicano", flag: "mx" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "eu" },
  { code: "COP", symbol: "$", name: "Peso Colombiano", flag: "co" },
  { code: "ARS", symbol: "$", name: "Peso Argentino", flag: "ar" },
  { code: "BRL", symbol: "R$", name: "Real", flag: "br" },
];
