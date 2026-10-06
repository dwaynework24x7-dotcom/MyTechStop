import type { Locale, Localized } from "@/config/locale";

/**
 * Approved facts the assistant is allowed to use.
 * If a question is not covered here, the assistant must not guess.
 */

export type ApprovedFact = {
  id: string;
  keywords: Record<Locale, readonly string[]>;
  answer: Localized;
};

export const salesConfirmation: Localized = {
  en: "A sales representative will confirm current availability and pricing.",
  es: "Un representante de ventas confirmará la disponibilidad y el precio actuales.",
};

export const approvedFacts: readonly ApprovedFact[] = [
  {
    id: "what",
    keywords: {
      en: ["what is my tech stop", "who are you", "about the company"],
      es: ["que es my tech stop", "quienes son", "sobre la empresa"],
    },
    answer: {
      en: "My Tech Stop is a U.S. wholesale electronics business. We buy devices and we sell devices to retailers, resellers, distributors, and international buyers.",
      es: "My Tech Stop es una empresa de electrónica al por mayor en Estados Unidos. Compramos dispositivos y los vendemos a tiendas, revendedores, distribuidores y compradores internacionales.",
    },
  },
  {
    id: "products",
    keywords: {
      en: ["what do you sell", "which products", "product categories", "do you sell iphone", "do you sell samsung"],
      es: ["que venden", "que productos", "categorias", "venden iphone", "venden samsung"],
    },
    answer: {
      en: "Core categories are iPhone, Samsung, iPad, MacBook, and Apple Watch, plus other high-demand mobile electronics. Conditions can include new, sealed, open box, activated, non-activated, used, graded, unlocked, and carrier devices. Stock changes constantly.",
      es: "Las categorías principales son iPhone, Samsung, iPad, MacBook y Apple Watch, además de otra electrónica móvil de alta demanda. Las condiciones pueden incluir nuevo, sellado, caja abierta, activado, sin activar, usado, con grado, liberado y con operador. El inventario cambia constantemente.",
    },
  },
  {
    id: "price",
    keywords: {
      en: ["price", "pricing", "cost", "how much", "quote"],
      es: ["precio", "precios", "costo", "cuánto", "cuanto", "cotización", "cotizacion"],
    },
    answer: salesConfirmation,
  },
  {
    id: "buy-from-us",
    keywords: {
      en: ["buy from you", "purchase", "wholesale"],
      es: ["comprarles", "comprar", "mayoreo", "por mayor"],
    },
    answer: {
      en: "Yes. We sell mobile devices and electronics in bulk. Use Get Pricing or the sales assistant so the team can confirm today’s inventory.",
      es: "Sí. Vendemos dispositivos móviles y electrónica por volumen. Use Pedir precios o el asistente para que el equipo confirme el inventario de hoy.",
    },
  },
  {
    id: "sell-to-us",
    keywords: {
      en: ["sell to you", "do you buy", "buy my", "we buy"],
      es: ["les vendo", "compran", "venderles", "compran inventario"],
    },
    answer: {
      en: "Yes. We buy inventory from phone stores, wholesalers, distributors, repair shops, brokers, liquidators, corporate IT teams, businesses, and high-volume sellers.",
      es: "Sí. Compramos inventario a tiendas de teléfonos, mayoristas, distribuidores, talleres de reparación, intermediarios, liquidadores, equipos de TI corporativos, empresas y vendedores de alto volumen.",
    },
  },
  {
    id: "markets",
    keywords: {
      en: ["which countries", "international buyers", "do you export", "do you have an office", "warehouse"],
      es: ["que paises", "compradores internacionales", "exportan", "tienen oficina", "bodega"],
    },
    answer: {
      en: "We serve international wholesale buyers, including the United States, Colombia, Peru, Paraguay, Mexico, Panama, the UAE, Hong Kong, Mongolia, Ghana, and Senegal. Export inquiries are welcome. This site does not list offices or warehouses outside the United States.",
      es: "Atendemos a compradores mayoristas internacionales, incluidos Estados Unidos, Colombia, Perú, Paraguay, México, Panamá, los Emiratos Árabes Unidos, Hong Kong, Mongolia, Ghana y Senegal. Las consultas de exportación son bienvenidas. Este sitio no indica oficinas ni bodegas fuera de Estados Unidos.",
    },
  },
  {
    id: "language",
    keywords: {
      en: ["spanish", "english", "language", "idioma"],
      es: ["español", "espanol", "inglés", "ingles", "idioma"],
    },
    answer: {
      en: "English and Spanish are available on the website and with the sales team.",
      es: "El sitio y el equipo de ventas atienden en inglés y en español.",
    },
  },
];

export function answerFromKnowledge(question: string, locale: Locale): string | null {
  const normalized = normalize(question);
  if (normalized.length < 3) return null;

  let best: { length: number; answer: string } | null = null;
  for (const fact of approvedFacts) {
    for (const keyword of fact.keywords[locale]) {
      const needle = normalize(keyword);
      if (needle.length < 3 || !normalized.includes(needle)) continue;
      if (!best || needle.length > best.length) {
        best = { length: needle.length, answer: fact.answer[locale] };
      }
    }
  }

  return best?.answer ?? null;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}
