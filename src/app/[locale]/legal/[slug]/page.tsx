import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { legalPaths } from "@/config/navigation";
import { PageMain } from "@/components/layout/PageIntro";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo/metadata";

const pages = {
  privacy: { title: "privacyTitle", body: "privacyBody" },
  terms: { title: "termsTitle", body: "termsBody" },
  sale: { title: "saleTitle", body: "saleBody" },
  shipping: { title: "shippingTitle", body: "shippingBody" },
  returns: { title: "returnsTitle", body: "returnsBody" },
} as const;

type LegalSlug = keyof typeof pages;

function isLegalSlug(slug: string): slug is LegalSlug {
  return slug in pages;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => legalPaths.map((item) => ({ locale, slug: item.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "pages.legal" });
  const title = t(pages[slug].title);
  return pageMetadata(locale, `/legal/${slug}`, `${title} | My Tech Stop`, t("notice"));
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("pages.legal");
  const paragraphs = t.raw(pages[slug].body) as string[];

  return (
    <PageMain>
      <p className="max-w-3xl border border-white/15 px-4 py-3 text-sm leading-6 text-white/70">{t("notice")}</p>
      <h1 className="mt-10 text-4xl font-medium tracking-[-0.03em] text-white md:text-5xl">{t(pages[slug].title)}</h1>
      <div className="mt-8 max-w-3xl space-y-5">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-7 text-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </PageMain>
  );
}
