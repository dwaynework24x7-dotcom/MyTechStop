"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/config/locale";
import { isCurrent, primaryNav } from "@/config/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

export function Header({ locale }: { locale: Locale }) {
  const nav = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 border-b ${solid || menuOpen ? "border-white/10 bg-ink/95 backdrop-blur" : "border-transparent bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-3 md:h-[4.5rem] md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-white">
          <Mark />
          <span className="whitespace-nowrap text-[11px] font-medium tracking-[0.14em] sm:text-[12px] sm:tracking-[0.16em]">MY TECH STOP</span>
        </Link>

        <nav aria-label={nav("primary")} className="ml-5 hidden items-center gap-3 min-[1380px]:flex">
          {primaryNav.map((item) => {
            const active = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap text-[11px] tracking-[0.12em] uppercase ${active ? "text-signal" : "text-white/75 hover:text-signal"}`}
              >
                {nav(item.id)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden min-[1380px]:flex" />
          <span className="hidden lg:block">
            <WhatsAppButton locale={locale} label={common("whatsapp")} variant="secondary" className="!px-4" />
          </span>
          <OpenInquiry intent="buy" className={buttonClass("primary", "!px-3 sm:!px-5")}>
            <span className="sm:hidden">{nav("pricingShort")}</span>
            <span className="hidden sm:inline">{nav("pricing")}</span>
          </OpenInquiry>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/15 text-white min-[1380px]:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="sr-only">{menuOpen ? common("closeMenu") : common("openMenu")}</span>
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
    <MobileNav locale={locale} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function Mark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <rect x="0.75" y="0.75" width="14.5" height="14.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4.25" y="4.25" width="7.5" height="7.5" className="fill-signal" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      {open ? <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" /> : <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" />}
    </svg>
  );
}
