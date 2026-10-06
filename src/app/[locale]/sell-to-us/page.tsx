import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { SellerForm } from "@/components/forms/SellerForm";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.sell" });
  return pageMetadata(locale, "/sell-to-us", t("metaTitle"), t("metaDescription"));
}

export default async function SellToUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.sell");
  const home = await getTranslations("home.sell");

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">{t("who")}</p>
      <div className="mt-6">
        <WhatsAppButton locale={locale} label={home("whatsapp")} />
      </div>
      <div className="mt-12">
        <SellerForm embedded />
      </div>
    </PageMain>
  );
}
