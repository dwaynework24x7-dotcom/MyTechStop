import { getLocale, getTranslations } from "next-intl/server";

import { marketByCode } from "@/config/countries";
import type { Locale } from "@/config/locale";
import { SectionIntro } from "@/components/inventory/InventoryGrid";
import { OpenInquiry } from "@/components/providers/InquiryProvider";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/buttonStyles";
import { DeviceArt } from "@/components/visual/DeviceArt";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { insightTopics, operationSlots, trustPoints } from "@/content/fallback/home";

export async function InternationalSection({ locale, countryCode }: { locale: Locale; countryCode: string | null }) {
  const t = await getTranslations("home.international");
  const market = marketByCode(countryCode);

  return (
    <section id="international" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <SectionIntro index={t("index")} eyebrow={t("eyebrow")} title={t("title")} body={t("body")} />
        {market ? <p className="mt-6 text-white">{t("servingIn", { country: market.name[locale] })}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/international" className={buttonClass("primary")}>
            {t("buyers")}
          </Link>
          <WhatsAppButton locale={locale} label={t("whatsapp")} />
        </div>
      </div>
    </section>
  );
}

export async function TrustSection() {
  const t = await getTranslations("home.trust");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="trust" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <SectionIntro index={t("index")} eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="mt-12 grid border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <li key={point.id} className="border border-white/10 p-5">
              <h3 className="text-base font-medium text-white">{point.title[locale]}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{point.body[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const operationArt = {
  inventory: "inventory",
  shipments: "shipment",
  operations: "inspection",
} as const;

export async function OperationsSection() {
  const t = await getTranslations("home.operations");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="operations" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <SectionIntro index={t("index")} eyebrow={t("eyebrow")} title={t("title")} body={t("body")} />
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {operationSlots.map((slot) => (
            <li key={slot.id} className="border border-white/10 bg-panel">
              <div className="flex h-52 items-center justify-center text-white/70">
                {slot.media ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slot.media} alt={slot.mediaAlt[locale]} className="h-full w-full object-cover" />
                ) : (
                  <DeviceArt kind={operationArt[slot.id as keyof typeof operationArt]} title={slot.mediaAlt[locale]} className="h-44 w-auto" />
                )}
              </div>
              <div className="border-t border-white/10 p-5">
                <h3 className="text-lg font-medium text-white">{slot.title[locale]}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{slot.body[locale]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function InsightsSection() {
  const t = await getTranslations("home.insights");
  const nav = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="insights" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <SectionIntro index={t("index")} eyebrow={t("eyebrow")} title={t("title")} body={t("body")} />
        <Link href="/insights" className={`${buttonClass("secondary")} mt-8`}>
          {nav("insights")}
        </Link>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {insightTopics.map((topic, index) => (
            <li key={topic.id} className="border border-white/10 border-t-2 border-t-signal p-6">
              <p className="text-[11px] tracking-[0.16em] text-signal uppercase">0{index + 1}</p>
              <h3 className="mt-4 text-xl font-medium text-white">{topic.title[locale]}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{topic.body[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function ClosingCta({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.cta");
  const common = await getTranslations("common");

  return (
    <section id="contact" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="border border-white/10 px-6 py-12 md:px-12 md:py-16">
          <p className="text-[11px] tracking-[0.18em] text-signal uppercase">{t("index")}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-[-0.03em] text-white md:text-5xl">{t("title")}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">{t("body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <OpenInquiry intent="buy" className={buttonClass("primary")}>
              {t("pricing")}
            </OpenInquiry>
            <Link href="/sell-to-us" className={buttonClass("secondary")}>
              {t("sell")}
            </Link>
            <WhatsAppButton locale={locale} label={common("whatsapp")} />
          </div>
        </div>
      </div>
    </section>
  );
}
