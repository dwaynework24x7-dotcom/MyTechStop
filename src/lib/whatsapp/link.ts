import type { Locale } from "@/config/locale";
import type { WhatsAppRouteId } from "@/config/countries";
import { digitsOnly, whatsappRoutes } from "@/config/whatsapp";

export function routeForLocale(locale: Locale): WhatsAppRouteId {
  return locale === "es" ? "spanish" : "english";
}

export function buildWhatsAppLink(phone: string, message: string): string | null {
  const digits = digitsOnly(phone);
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function whatsAppHref(locale: Locale, extra?: string): string | null {
  const route = whatsappRoutes[routeForLocale(locale)];
  const message = extra?.trim() ? `${route.defaultMessage} ${extra.trim()}` : route.defaultMessage;
  return buildWhatsAppLink(route.phone, message);
}
