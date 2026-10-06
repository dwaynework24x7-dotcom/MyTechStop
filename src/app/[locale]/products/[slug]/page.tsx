import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { pickLocalized } from "@/config/locale";
import { PageMain } from "@/components/layout/PageIntro";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { buttonClass } from "@/components/ui/buttonStyles";
import { CategoryPhoto } from "@/components/visual/CategoryPhoto";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { catalog, catalogItemBySlug } from "@/content/fallback/catalog";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => catalog.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = catalogItemBySlug(slug);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "pages" });
  const name = pickLocalized(item.name, locale as Locale);
  return pageMetadata(locale, `/products/${slug}`, `${name} | My Tech Stop`, t("category.metaDescription", { name }));
}

const copyKey = {
  iphone: "iphone",
  samsung: "samsung",
  ipad: "ipad",
  macbook: "macbook",
  "apple-watch": "apple-watch",
} as const;

export default async function ProductCategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const item = catalogItemBySlug(slug);
  if (!item || !(item.id in copyKey)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("pages.category");
  const common = await getTranslations("common");
  const name = pickLocalized(item.name, locale);
  const related = catalog.filter((entry) => entry.slug !== item.slug);

  return (
    <PageMain>
      <Link href="/products" className="text-sm text-muted hover:text-white">
        {t("back")}
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <CategoryPhoto
          src={item.image}
          alt={pickLocalized(item.imageAlt, locale)}
          categoryId={item.id}
          className="h-80 border border-white/10 lg:h-[32rem]"
        />
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{item.manufacturer}</p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-white md:text-5xl">{name}</h1>
          <p className="mt-5 text-base leading-7 text-muted">{t(copyKey[item.id as keyof typeof copyKey])}</p>
          <p className="mt-6 text-sm text-white">{pickLocalized(item.conditions, locale)}</p>
          <p className="mt-3 text-sm text-white">{t("price")}</p>
          <p className="mt-4 text-sm leading-6 text-white/50">{t("confirm")}</p>
          <p className="mt-2 text-sm leading-6 text-white/50">{common("availability")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OpenInquiry intent="buy" className={buttonClass("primary")}>
              {common("requestPrice")}
            </OpenInquiry>
            <WhatsAppButton locale={locale} label={common("whatsapp")} category={name} />
          </div>
        </div>
      </div>
      <h2 className="mt-16 text-[11px] tracking-[0.16em] text-muted uppercase">{t("related")}</h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {related.map((entry) => (
          <li key={entry.id}>
            <Link href={`/products/${entry.slug}`} className="inline-flex min-h-11 items-center border border-white/15 px-4 text-sm text-white hover:border-white/40">
              {pickLocalized(entry.name, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </PageMain>
  );
}
