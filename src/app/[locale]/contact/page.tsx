import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { BuyerForm } from "@/components/forms/BuyerForm";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return pageMetadata(locale, "/contact", t("metaTitle"), t("metaDescription"));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.contact");
  const common = await getTranslations("common");

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/sell-to-us" className={buttonClass("secondary")}>
          {t("sell")}
        </Link>
        <Link href="/wholesale" className={buttonClass("ghost")}>
          {t("wholesale")}
        </Link>
        <WhatsAppButton locale={locale} label={common("whatsapp")} />
      </div>
      <div className="mt-12">
        <BuyerForm embedded />
      </div>
    </PageMain>
  );
}
