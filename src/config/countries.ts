import type { Locale } from "@/config/locale";

export type WhatsAppRouteId = "english" | "spanish";

export type Market = {
  code: string;
  locale: Locale;
  whatsapp: WhatsAppRouteId;
  name: Record<Locale, string>;
  featured: boolean;
  /** Geographic position for the world map. Not an office or warehouse. */
  lat: number;
  lng: number;
};

/**
 * Markets named by the business. Featured markets appear on the international
 * section. This list is not a claim of offices, warehouses, or staff.
 */
export const markets: readonly Market[] = [
  {
    code: "US",
    locale: "en",
    whatsapp: "english",
    name: { en: "United States", es: "Estados Unidos" },
    featured: true,
    lat: 39.8,
    lng: -98.6,
  },
  {
    code: "MX",
    locale: "es",
    whatsapp: "spanish",
    name: { en: "Mexico", es: "México" },
    featured: true,
    lat: 23.6,
    lng: -102.5,
  },
  {
    code: "PA",
    locale: "es",
    whatsapp: "spanish",
    name: { en: "Panama", es: "Panamá" },
    featured: true,
    lat: 8.5,
    lng: -80.8,
  },
  {
    code: "CO",
    locale: "es",
    whatsapp: "spanish",
    name: { en: "Colombia", es: "Colombia" },
    featured: true,
    lat: 4.6,
    lng: -74.1,
  },
  {
    code: "PE",
    locale: "es",
    whatsapp: "spanish",
    name: { en: "Peru", es: "Perú" },
    featured: true,
    lat: -9.2,
    lng: -75,
  },
  {
    code: "PY",
    locale: "es",
    whatsapp: "spanish",
    name: { en: "Paraguay", es: "Paraguay" },
    featured: true,
    lat: -23.4,
    lng: -58.4,
  },
  {
    code: "AE",
    locale: "en",
    whatsapp: "english",
    name: { en: "UAE / Dubai", es: "EAU / Dubái" },
    featured: true,
    lat: 24.5,
    lng: 54.4,
  },
  {
    code: "HK",
    locale: "en",
    whatsapp: "english",
    name: { en: "Hong Kong", es: "Hong Kong" },
    featured: true,
    lat: 22.3,
    lng: 114.2,
  },
  {
    code: "MN",
    locale: "en",
    whatsapp: "english",
    name: { en: "Mongolia", es: "Mongolia" },
    featured: true,
    lat: 46.9,
    lng: 103.8,
  },
  {
    code: "GH",
    locale: "en",
    whatsapp: "english",
    name: { en: "Ghana", es: "Ghana" },
    featured: true,
    lat: 7.9,
    lng: -1,
  },
  {
    code: "SN",
    locale: "en",
    whatsapp: "english",
    name: { en: "Senegal", es: "Senegal" },
    featured: true,
    lat: 14.5,
    lng: -14.5,
  },
] as const;

export function featuredMarkets(): readonly Market[] {
  return markets.filter((market) => market.featured);
}

export function marketByCode(code: string | null | undefined): Market | undefined {
  if (!code) return undefined;
  return markets.find((market) => market.code === code.toUpperCase());
}
