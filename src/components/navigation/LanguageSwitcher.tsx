"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/config/locale";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/lib/locale/localeCookie";

const options: { locale: Locale; labelKey: "english" | "spanish" }[] = [
  { locale: "en", labelKey: "english" },
  { locale: "es", labelKey: "spanish" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  return (
    <div role="group" aria-label={t("language")} className={`flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase ${className}`}>
      {options.map((option, index) => {
        const active = locale === option.locale;
        return (
          <span key={option.locale} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-white/30">|</span> : null}
            <Link
              href={`${pathname}${hash}`}
              locale={option.locale}
              hrefLang={option.locale}
              aria-current={active ? "true" : undefined}
              className={active ? "text-white" : "text-white/55 hover:text-white"}
              onClick={() => persistLocale(option.locale)}
              onMouseEnter={() => setHash(window.location.hash)}
              onFocus={() => setHash(window.location.hash)}
            >
              {t(option.labelKey)}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

function persistLocale(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}
