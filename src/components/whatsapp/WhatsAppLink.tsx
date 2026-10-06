"use client";

import { track } from "@/lib/analytics/track";
import type { WhatsAppRouteId } from "@/config/countries";

type Props = {
  href: string;
  route: WhatsAppRouteId;
  className?: string;
  children: React.ReactNode;
  label: string;
};

export function WhatsAppLink({ href, route, className, children, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
      onClick={() => track(route === "english" ? "whatsapp_english_click" : "whatsapp_spanish_click", { route })}
    >
      {children}
    </a>
  );
}
