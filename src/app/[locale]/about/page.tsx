import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { buttonClass } from "@/components/ui/buttonStyles";
import { trustPoints } from "@/content/fallback/home";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return pageMetadata(locale, "/about", t("metaTitle"), t("metaDescription"));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");
  const nav = await getTranslations("nav");

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">{t("languages")}</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{t("markets")}</p>
      <ul className="mt-12 grid border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {trustPoints.map((point) => (
          <li key={point.id} className="border border-white/10 p-5">
            <h2 className="text-base font-medium text-white">{point.title[locale]}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{point.body[locale]}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/wholesale" className={buttonClass("primary")}>
          {nav("wholesale")}
        </Link>
        <Link href="/contact" className={buttonClass("secondary")}>
          {nav("contact")}
        </Link>
      </div>
    </PageMain>
  );
}
