import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { pickLocalized } from "@/config/locale";
import { PageIntro, PageMain } from "@/components/layout/PageIntro";
import { CategoryPhoto } from "@/components/visual/CategoryPhoto";
import { catalog } from "@/content/fallback/catalog";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.products" });
  return pageMetadata(locale, "/products", t("metaTitle"), t("metaDescription"));
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pages.products");
  const common = await getTranslations("common");

  return (
    <PageMain>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((item) => (
          <li key={item.id}>
            <Link href={`/products/${item.slug}`} className="flex h-full flex-col border border-white/10 bg-panel hover:border-white/30">
              <CategoryPhoto src={item.image} alt={pickLocalized(item.imageAlt, locale)} categoryId={item.id} className="h-52" />
              <div className="flex flex-1 flex-col p-5">
              <p className="text-[11px] tracking-[0.16em] text-signal uppercase">{item.manufacturer}</p>
              <h2 className="mt-1 text-2xl font-medium text-white">{pickLocalized(item.name, locale)}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{pickLocalized(item.conditions, locale)}</p>
              <p className="mt-auto pt-5 text-sm text-white">{t("view")}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm leading-6 text-white/50">{common("availability")}</p>
    </PageMain>
  );
}
