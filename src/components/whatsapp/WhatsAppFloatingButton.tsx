import type { Locale } from "@/config/locale";
import { whatsappRoutes } from "@/config/whatsapp";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";
import { routeForLocale, whatsAppHref } from "@/lib/whatsapp/link";

export function WhatsAppFloatingButton({ locale, label }: { locale: Locale; label: string }) {
  const route = routeForLocale(locale);
  const href = whatsAppHref(locale);
  if (!href) return null;
  const name = whatsappRoutes[route].displayName;

  return (
    <WhatsAppLink
      href={href}
      route={route}
      label={name ? `${label}, ${name}` : label}
      className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-[#075E54] text-white shadow-lg shadow-black/30 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon />
    </WhatsAppLink>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 14.05c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.25-4.76-4.15-4.9-4.34-.14-.2-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.28.64-.41 1.02-.41.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.33.02.52-.1.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.17-.2.7-.82.89-1.1.19-.28.38-.23.64-.14.26.09 1.66.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
