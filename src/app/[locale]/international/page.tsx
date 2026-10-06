import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { marketByCode } from "@/config/countries";
import type { Locale } from "@/config/locale";
import { InternationalMap } from "@/components/countries/InternationalMap";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { detectCountry } from "@/lib/locale/detectCountry";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.international" });
  return pageMetadata(locale, "/international", t("metaTitle"), t("metaDescription"));
}

export default async function InternationalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.international");
  const home = await getTranslations("home.international");
  const market = marketByCode(detectCountry(await headers()));

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      {market ? <p className="mt-6 text-white">{home("servingIn", { country: market.name[locale] })}</p> : null}
      <p className="mt-4 max-w-3xl text-sm leading-6 text-white/50">{t("note")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/contact" className={buttonClass("primary")}>
          {t("next")}
        </Link>
        <Link href="/wholesale" className={buttonClass("secondary")}>
          {t("wholesale")}
        </Link>
        <WhatsAppButton locale={locale} label={home("whatsapp")} />
      </div>
      <div className="mt-14">
        <InternationalMap locale={locale} activeCode={market?.code} label={home("mapLabel")} />
      </div>
    </PageMain>
  );
}
