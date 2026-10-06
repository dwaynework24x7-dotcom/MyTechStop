import { marketByCode } from "@/config/countries";
import type { Locale } from "@/config/locale";

/**
 * Spanish-speaking countries receive Spanish even when they are not featured
 * markets. That is a language choice, not a claim of local operations.
 * Brazil and other non-Spanish markets are intentionally omitted.
 */
const SPANISH_COUNTRIES = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

/**
 * Countries with an explicit English locale. These win over Accept-Language.
 * Example: a Spanish browser in the United States still starts in English.
 */
const ENGLISH_COUNTRIES = new Set(["US", "AE", "HK", "MN", "GH", "SN"]);

export function localeForCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  const code = country.trim().toUpperCase();
  const market = marketByCode(code);
  if (market) return market.locale;
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (ENGLISH_COUNTRIES.has(code)) return "en";
  return null;
}

export function whatsappRouteForCountry(country: string | null | undefined): "english" | "spanish" | null {
  const market = marketByCode(country);
  if (market) return market.whatsapp;
  const locale = localeForCountry(country);
  if (locale === "es") return "spanish";
  if (locale === "en") return "english";
  return null;
}
