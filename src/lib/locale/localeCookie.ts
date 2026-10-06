import { isLocale, type Locale } from "@/config/locale";

/** Shared with next-intl so a manual choice survives the next visit. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function readLocaleCookie(cookieHeader: string | null | undefined): Locale | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName !== LOCALE_COOKIE) continue;
    const value = decodeURIComponent(rest.join("="));
    return isLocale(value) ? value : null;
  }
  return null;
}

export function serializeLocaleCookie(locale: Locale, secure = false): string {
  const flags = [`Path=/`, `Max-Age=${LOCALE_COOKIE_MAX_AGE}`, "SameSite=Lax"];
  if (secure) flags.push("Secure");
  return `${LOCALE_COOKIE}=${locale}; ${flags.join("; ")}`;
}
