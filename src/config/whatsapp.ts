import type { WhatsAppRouteId } from "@/config/countries";

/**
 * Public WhatsApp routes.
 * Phone numbers come from the environment. Components must not hard-code them.
 * A route without a usable number is treated as unavailable.
 */
export type WhatsAppRoute = {
  id: WhatsAppRouteId;
  displayName: string;
  phone: string;
  defaultMessage: string;
};

function route(id: WhatsAppRouteId, displayName: string, phone: string | undefined, defaultMessage: string): WhatsAppRoute {
  return {
    id,
    displayName,
    phone: phone?.trim() ?? "",
    defaultMessage,
  };
}

export const whatsappRoutes = {
  english: route(
    "english",
    "",
    process.env.NEXT_PUBLIC_WHATSAPP_ENGLISH,
    "Hi My Tech Stop, I’m interested in wholesale device pricing.",
  ),
  spanish: route(
    "spanish",
    "Melissa",
    process.env.NEXT_PUBLIC_WHATSAPP_SPANISH,
    "Hola My Tech Stop, estoy interesado en comprar celulares al por mayor.",
  ),
} as const;

export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isWhatsAppConfigured(routeId: WhatsAppRouteId): boolean {
  return digitsOnly(whatsappRoutes[routeId].phone).length >= 8;
}
