import { getTranslations } from "next-intl/server";

import type { Locale } from "@/config/locale";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { Link } from "@/i18n/navigation";
import { SectionIntro } from "@/components/inventory/InventoryGrid";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

export async function BuyWholesale() {
  const t = await getTranslations("home.buy");
  const audiences = t.raw("audiences") as string[];

  return (
    <section id="buy" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <SectionIntro index={t("index")} eyebrow={t("eyebrow")} title={t("title")} body={t("body")} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/wholesale" className={buttonClass("primary")}>
              {t("requestInventory")}
            </Link>
            <OpenInquiry intent="buy" className={buttonClass("secondary")}>
              {t("getPricing")}
            </OpenInquiry>
          </div>
        </div>
        <div>
          <h3 className="text-[11px] tracking-[0.16em] text-muted uppercase">{t("audiencesLabel")}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
            {audiences.map((audience) => (
              <li key={audience} className="bg-ink px-4 py-4 text-sm text-white">
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function SellSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.sell");
  const audiences = t.raw("audiences") as string[];

  return (
    <section id="sell" className="scroll-mt-24 bg-paper py-20 text-paper-ink md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase opacity-60">
            <span className="mr-3">{t("index")}</span>
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] md:text-5xl">{t("title")}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 opacity-75">{t("body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/sell-to-us" className={buttonClass("paper")}>
              {t("submit")}
            </Link>
            <Link href="/sell-to-us" className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-5 text-[12px] font-medium tracking-[0.14em] uppercase">
              {t("upload")}
            </Link>
            <WhatsAppButton locale={locale} label={t("whatsapp")} variant="whatsapp" />
          </div>
        </div>
        <div>
          <h3 className="text-[11px] tracking-[0.16em] uppercase opacity-60">{t("audiencesLabel")}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {audiences.map((audience) => (
              <li key={audience} className="border border-black/10 px-3 py-2 text-sm">
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
