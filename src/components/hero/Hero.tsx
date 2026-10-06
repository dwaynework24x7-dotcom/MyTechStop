import { getTranslations } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { pickLocalized } from "@/config/locale";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/buttonStyles";
import { CategoryPhoto } from "@/components/visual/CategoryPhoto";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { getInventoryService } from "@/lib/cms/inventory";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.hero");
  const featured = await getTranslations("home");
  const product = getInventoryService().getHeroProduct();

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl items-end gap-12 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">{t("eyebrow")}</p>
          <h1 className="mt-5 max-w-4xl text-[2.35rem] leading-[1.05] font-medium tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted md:text-lg">{t("support")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/products" className={buttonClass("primary")}>
              {t("viewInventory")}
            </Link>
            <OpenInquiry intent="buy" className={buttonClass("secondary")}>
              {t("requestPricing")}
            </OpenInquiry>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sell-to-us" className={buttonClass("ghost")}>
              {t("sellDevices")}
            </Link>
            <WhatsAppButton locale={locale} label={t("whatsappSales")} variant="ghost" />
          </div>
          <p className="mt-8 max-w-lg text-sm leading-6 text-white/50">{t("note")}</p>
        </div>

        {product ? (
          <article className="overflow-hidden border border-white/10 bg-panel">
            <CategoryPhoto src={product.image} alt={pickLocalized(product.imageAlt, locale)} categoryId="iphone" fit="contain" className="h-80" />
            <div className="p-6 sm:p-8">
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{featured("featured")}</p>
            <p className="mt-4 text-[11px] tracking-[0.16em] text-muted uppercase">{product.manufacturer}</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-white">{product.title}</h2>
            <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {product.facts.map((fact) => (
                <div key={fact.id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <dt className="text-muted">{pickLocalized(fact.label, locale)}</dt>
                  <dd className="text-right text-white">{pickLocalized(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
