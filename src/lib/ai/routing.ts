import type { Locale } from "@/config/locale";
import { routeForLocale } from "@/lib/whatsapp/link";
import type { WhatsAppRouteId } from "@/config/countries";

/** Language choice inside the buyer flow overrides the page locale for routing. */
export function routeLead(preferredLanguage: string | undefined, pageLocale: Locale): WhatsAppRouteId {
  if (preferredLanguage === "es") return "spanish";
  if (preferredLanguage === "en") return "english";
  return routeForLocale(pageLocale);
}
