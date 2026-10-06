import type { Locale } from "@/config/locale";
import { whatsappRoutes } from "@/config/whatsapp";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";
import { routeForLocale, whatsAppHref } from "@/lib/whatsapp/link";

type Props = {
  locale: Locale;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp" | "paper";
  className?: string;
  category?: string;
};

export function WhatsAppButton({ locale, label, variant = "secondary", className = "", category }: Props) {
  const route = routeForLocale(locale);
  const href = whatsAppHref(locale, category);
  if (!href) return null;
  const name = whatsappRoutes[route].displayName;

  return (
    <WhatsAppLink href={href} route={route} label={name ? `${label}, ${name}` : label} className={buttonClass(variant, className)}>
      <span>{label}</span>
      {name ? (
        <span aria-hidden="true" className="normal-case tracking-normal text-white/75">
          {name}
        </span>
      ) : null}
    </WhatsAppLink>
  );
}
