import { getTranslations } from "next-intl/server";

import { marketByCode } from "@/config/countries";
import type { Locale } from "@/config/locale";
import { pickLocalized } from "@/config/locale";
import { InternationalMap } from "@/components/countries/InternationalMap";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/buttonStyles";
import { CategoryPhoto } from "@/components/visual/CategoryPhoto";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { getInventoryService } from "@/lib/cms/inventory";

export async function Hero({ locale, countryCode }: { locale: Locale; countryCode: string | null }) {
  const t = await getTranslations("home.hero");
  const featured = await getTranslations("home");
  const markets = await getTranslations("home.international");
  const product = getInventoryService().getHeroProduct();
  const market = marketByCode(countryCode);

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="contents lg:block">
          <div className="order-1">
            <p className="text-[11px] font-medium tracking-[0.18em] text-signal uppercase">{t("eyebrow")}</p>
            <h1 className="mt-5 max-w-4xl text-[2.35rem] leading-[1.05] font-medium tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted md:text-lg">{t("support")}</p>
          </div>
          <div className="order-3 lg:mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
        </div>

        <div className="contents lg:grid lg:gap-4">
          <div className="order-2">
            <InternationalMap locale={locale} activeCode={market?.code} label={markets("mapLabel")} compact />
            <p className="mt-3 max-w-md text-xs leading-5 text-white/50">{markets("note")}</p>
          </div>
        {product ? (
          <article className="order-4 overflow-hidden border border-white/10 bg-panel">
            <CategoryPhoto src={product.image} alt={pickLocalized(product.imageAlt, locale)} categoryId="iphone" fit="contain" className="h-80" />
            <div className="p-6 sm:p-8">
            <p className="text-[11px] tracking-[0.16em] text-signal uppercase">{featured("featured")}</p>
            <p className="mt-4 text-[11px] tracking-[0.16em] text-signal uppercase">{product.manufacturer}</p>
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
      </div>
    </section>
  );
}
