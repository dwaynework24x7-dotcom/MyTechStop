"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import type { Locale } from "@/config/locale";
import { primaryNav } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

type Props = {
  locale: Locale;
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ locale, open, onClose }: Props) {
  const nav = useTranslations("nav");
  const home = useTranslations("home");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id="mobile-navigation" className="fixed inset-0 z-[45] overflow-y-auto bg-ink pt-20 min-[1380px]:hidden">
      <nav aria-label={nav("primary")} className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pb-16">
        <ul className="grid gap-1">
          {primaryNav.map((item) => (
            <li key={item.id}>
              <Link href={item.href} onClick={onClose} className="block py-2 text-2xl font-medium tracking-tight text-white">
                {nav(item.id)}
              </Link>
            </li>
          ))}
        </ul>
        <LanguageSwitcher />
        <div className="grid gap-3 sm:grid-cols-2">
          <OpenInquiry intent="buy" className={buttonClass("primary", "w-full")} >
            {nav("pricing")}
          </OpenInquiry>
          <WhatsAppButton locale={locale} label={home("hero.whatsappSales")} className="w-full" />
        </div>
      </nav>
    </div>
  );
}
