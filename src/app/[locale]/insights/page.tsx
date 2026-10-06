import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { insightTopics } from "@/content/fallback/home";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.insights" });
  return pageMetadata(locale, "/insights", t("metaTitle"), t("metaDescription"));
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.insights");

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <p className="mt-6 text-sm text-white/50">{t("empty")}</p>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {insightTopics.map((topic, index) => (
          <li key={topic.id} className="border border-white/10 p-6">
            <p className="text-[11px] tracking-[0.16em] text-white/35 uppercase">0{index + 1}</p>
            <h2 className="mt-4 text-xl font-medium text-white">{topic.title[locale]}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{topic.body[locale]}</p>
          </li>
        ))}
      </ul>
    </PageMain>
  );
}
