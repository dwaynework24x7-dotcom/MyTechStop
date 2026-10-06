import { getTranslations } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { pickLocalized } from "@/config/locale";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { buttonClass } from "@/components/ui/buttonStyles";
import { CategoryPhoto } from "@/components/visual/CategoryPhoto";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { getInventoryService } from "@/lib/cms/inventory";

export async function InventoryGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.inventory");
  const common = await getTranslations("common");
  const items = getInventoryService().getFeaturedProducts();

  return (
    <section id="inventory" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <SectionIntro index={t("index")} eyebrow={t("eyebrow")} title={t("title")} body={t("body")} />
        {items.length === 0 ? <p className="mt-10 text-muted">{common("availability")}</p> : null}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((item) => (
            <li key={item.id} id={`cat-${item.id}`} className="scroll-mt-28 border border-white/10 bg-panel">
              <CategoryPhoto src={item.image} alt={pickLocalized(item.imageAlt, locale)} categoryId={item.id} className="h-44" />
              <div className="p-4">
              <p className="text-[11px] tracking-[0.16em] text-signal uppercase">{item.manufacturer}</p>
              <h3 className="mt-1 text-xl font-medium text-white">
                <Link href={`/products/${item.slug}`} className="hover:underline">
                  {pickLocalized(item.name, locale)}
                </Link>
              </h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-muted">{pickLocalized(item.conditions, locale)}</p>
              <div className="mt-4 grid gap-2">
                <OpenInquiry intent="buy" className={buttonClass("primary", "w-full")}>
                  {common("requestPrice")}
                </OpenInquiry>
                <WhatsAppButton locale={locale} label={common("whatsapp")} category={pickLocalized(item.name, locale)} className="w-full" />
              </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm leading-6 text-white/50">{common("availability")}</p>
      </div>
    </section>
  );
}

export function SectionIntro({ index, eyebrow, title, body }: { index: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-medium tracking-[0.18em] text-signal uppercase">
        <span className="mr-3">{index}</span>
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-white md:text-4xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-muted">{body}</p> : null}
    </div>
  );
}
