import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { pickLocalized } from "@/config/locale";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { buttonClass } from "@/components/ui/buttonStyles";
import { CategoryPhoto } from "@/components/visual/CategoryPhoto";
import { catalog } from "@/content/fallback/catalog";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.wholesale" });
  return pageMetadata(locale, "/wholesale", t("metaTitle"), t("metaDescription"));
}

export default async function WholesalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.wholesale");
  const common = await getTranslations("common");
  const points = t.raw("points") as string[];

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <ul className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
        {points.map((point) => (
          <li key={point} className="bg-ink px-5 py-4 text-sm leading-6 text-white">
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <OpenInquiry intent="buy" className={buttonClass("primary")}>
          {t("pricing")}
        </OpenInquiry>
        <Link href="/products" className={buttonClass("secondary")}>
          {t("categories")}
        </Link>
      </div>
      <h2 className="mt-16 text-[11px] tracking-[0.16em] text-muted uppercase">{t("categories")}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((item) => (
          <li key={item.id}>
            <Link href={`/products/${item.slug}`} className="block border border-white/10 bg-panel hover:border-white/30">
              <CategoryPhoto src={item.image} alt={pickLocalized(item.imageAlt, locale)} categoryId={item.id} className="h-44" />
              <div className="p-5">
              <h3 className="text-xl font-medium text-white">{pickLocalized(item.name, locale)}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{pickLocalized(item.conditions, locale)}</p>
              <p className="mt-4 text-sm text-white">{common("requestPrice")}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm leading-6 text-white/50">{common("availability")}</p>
    </PageMain>
  );
}
