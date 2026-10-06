import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/hero/Hero";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { BuyWholesale, SellSection } from "@/components/home/TradeSections";
import { ClosingCta, InsightsSection, InternationalSection, OperationsSection, TrustSection } from "@/components/home/LaterSections";
import { StructuredData } from "@/components/seo/StructuredData";
import { detectCountry } from "@/lib/locale/detectCountry";

/** Country detection has to run per request, so this page is not cached as one HTML file. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const url = `${siteConfig.url}/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en`,
        es: `${siteConfig.url}/es`,
        "x-default": `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: siteConfig.name,
      locale: locale === "es" ? "es_419" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("home.meta");
  const country = detectCountry(await headers());

  return (
    <main id="main">
      <StructuredData locale={locale} description={t("description")} />
      <Hero locale={locale} countryCode={country} />
      <InventoryGrid locale={locale} />
      <BuyWholesale />
      <SellSection locale={locale} />
      <InternationalSection locale={locale} countryCode={country} />
      <TrustSection />
      <OperationsSection />
      <InsightsSection />
      <ClosingCta locale={locale} />
    </main>
  );
}
