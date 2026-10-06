import { isLocale, type Locale } from "@/config/locale";
import { localeForCountry } from "@/lib/locale/countryMap";

export type ResolveLocaleInput = {
  /** Locale already present in the path, such as /es/. */
  urlLocale?: string | null;
  /** Saved language choice. */
  cookieLocale?: string | null;
  /** ISO country from the edge host. */
  country?: string | null;
  /** Raw Accept-Language header. */
  acceptLanguage?: string | null;
};

/**
 * Resolution order:
 * 1. Explicit locale in the URL
 * 2. Explicit user selection / locale cookie
 * 3. Edge country
 * 4. Accept-Language
 * 5. English
 *
 * URL locale stays authoritative so a shared link is not overwritten
 * and automatic detection cannot loop.
 */
export function resolveLocale(input: ResolveLocaleInput): Locale {
  if (isLocale(input.urlLocale)) return input.urlLocale;
  if (isLocale(input.cookieLocale)) return input.cookieLocale;

  const fromCountry = localeForCountry(input.country);
  if (fromCountry) return fromCountry;

  const fromHeader = localeFromAcceptLanguage(input.acceptLanguage);
  if (fromHeader) return fromHeader;

  return "en";
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((item) => item.tag && item.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const item of ranked) {
    const primary = item.tag.split("-")[0];
    if (primary === "en" || primary === "es") return primary;
  }

  return null;
}
