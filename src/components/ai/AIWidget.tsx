"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import type { Locale } from "@/config/locale";
import { whatsappRoutes } from "@/config/whatsapp";
import { answerFromKnowledge, salesConfirmation } from "@/content/fallback/knowledge";
import { submitLead } from "@/components/forms/submitLead";
import { buttonClass } from "@/components/ui/buttonStyles";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";
import { questionsFor, selectIntent, submitAnswer, createFlow, type FlowState, type Intent } from "@/lib/ai/flow";
import { routeLead } from "@/lib/ai/routing";
import { buildWhatsAppLink } from "@/lib/whatsapp/link";
import { track } from "@/lib/analytics/track";

const optionIds = new Set([
  "new",
  "used",
  "either",
  "mixed",
  "unlocked",
  "locked",
  "carrier",
  "yes",
  "no",
  "one_time",
  "recurring",
  "en",
  "es",
  "activated",
  "non_activated",
  "unknown",
  "attached",
  "skipped",
]);

export function AIWidget({ locale }: { locale: Locale }) {
  const t = useTranslations("ai");
  const common = useTranslations("common");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<FlowState>(createFlow);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [faq, setFaq] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button, input, textarea")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const questions = flow.intent ? questionsFor(flow.intent) : [];
  const current = !flow.complete ? questions[flow.step] : undefined;

  function labelFor(value: string) {
    return optionIds.has(value) ? t(`options.${value}` as "options.new") : value;
  }

  async function sendSummary() {
    if (!flow.intent || !flow.complete || !consent) return;
    const payload = flow.intent === "buy" ? buyerPayload(flow, locale) : sellerPayload(flow, locale);
    const upload = flow.intent === "sell" && flow.answers.upload === "attached" ? file : null;
    const result = await submitLead(payload, upload);
    if (result.ok) {
      setNote(common("savedLocal"));
      track("qualified_lead", { locale, intent: flow.intent, sink: result.sink ?? "local" });
      return;
    }
    if (result.code === "not_configured") setNote(common("notConfigured"));
    else if (result.code === "upload_not_configured") setNote(common("uploadNotConfigured"));
    else if (result.code === "rate") setNote(common("rateLimited"));
    else setNote(common("errorGeneric"));
  }

  const route = flow.intent === "buy" ? routeLead(flow.answers.language, locale) : locale === "es" ? "spanish" : "english";
  const whatsappMessage = `${whatsappRoutes[route].defaultMessage} ${[flow.answers.businessName, flow.answers.devices, flow.answers.quantity].filter(Boolean).join(" · ")}`.trim();
  const whatsapp = buildWhatsAppLink(whatsappRoutes[route].phone, whatsappMessage);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 left-4 z-40 grid size-14 place-items-center rounded-full border border-white/15 bg-ink text-white md:bottom-6 md:left-6"
        aria-expanded={open}
        aria-controls="sales-assistant"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{common("salesAssistant")}</span>
        <AssistantIcon />
      </button>
      {open ? (
        <section
          id="sales-assistant"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="fixed bottom-20 left-4 z-40 flex max-h-[min(36rem,calc(100svh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col border border-white/12 bg-panel text-metal shadow-2xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <h2 id={titleId} className="text-[11px] tracking-[0.16em] text-white uppercase">
              {common("salesAssistant")}
            </h2>
            <button type="button" className="grid size-10 place-items-center" onClick={() => setOpen(false)}>
              <span className="sr-only">{common("close")}</span>
              <span aria-hidden="true">✕</span>
            </button>
          </header>
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <p className="text-sm leading-6">{t("welcome")}</p>
            {!flow.intent ? (
              <div className="grid gap-2">
                <button type="button" className={buttonClass("primary")} onClick={() => choose("buy", locale, setFlow)}>
                  {t("buy")}
                </button>
                <button type="button" className={buttonClass("secondary")} onClick={() => choose("sell", locale, setFlow)}>
                  {t("sell")}
                </button>
              </div>
            ) : null}

            {flow.intent && Object.keys(flow.answers).length > 0 ? (
              <ul className="grid gap-2 text-sm">
                {Object.entries(flow.answers).map(([id, value]) => (
                  <li key={id} className="border-t border-white/10 pt-2">
                    <span className="block text-[11px] tracking-[0.12em] text-muted uppercase">{t(`${flow.intent}.${id}` as "buyer.country")}</span>
                    <span>{labelFor(value)}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {current ? (
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (current.kind === "text") {
                    const next = submitAnswer(flow, draft);
                    if (next !== flow) {
                      setFlow(next);
                      setDraft("");
                    }
                  }
                }}
              >
                <p className="text-sm leading-6 text-white">
                  {t(`${flow.intent}.${current.id}` as "buyer.country")}
                </p>
                <p className="text-[11px] tracking-[0.12em] text-muted uppercase">
                  {t("progress", { current: flow.step + 1, total: questions.length })}
                </p>
                {current.kind === "choice" && current.options ? (
                  <div className="grid gap-2">
                    {current.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={buttonClass("secondary", "w-full")}
                        onClick={() => {
                          if (option === "attached" && !file) return;
                          setFlow(submitAnswer(flow, option));
                        }}
                      >
                        {t(`options.${option}` as "options.new")}
                      </button>
                    ))}
                    {current.id === "upload" ? (
                      <label className="field">
                        <span>{t("attach")}</span>
                        <input
                          type="file"
                          accept=".xlsx,.csv,.pdf,application/pdf,text/csv"
                          onChange={(event) => {
                            const selected = event.target.files?.[0] ?? null;
                            setFile(selected);
                            if (selected) setFlow(submitAnswer(flow, "attached"));
                          }}
                        />
                      </label>
                    ) : null}
                  </div>
                ) : (
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={t("placeholder")}
                    aria-label={t(`${flow.intent}.${current.id}` as "buyer.country")}
                    className="min-h-12 border border-white/15 bg-ink px-3 text-base"
                  />
                )}
                <div className="flex gap-4">
                  <button type="button" className={buttonClass("ghost")} onClick={() => setFlow(createFlow())}>
                    {t("restart")}
                  </button>
                  {current.kind === "text" ? (
                    <button type="submit" className={buttonClass("primary")}>
                      {common("send")}
                    </button>
                  ) : null}
                </div>
              </form>
            ) : null}

            {flow.complete ? (
              <div className="grid gap-3 border-t border-white/10 pt-4">
                <h3 className="text-sm text-white">{t("summaryTitle")}</h3>
                <p className="text-sm leading-6 text-muted">{salesConfirmation[locale]}</p>
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input type="checkbox" className="mt-1 size-4" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                  <span>{common("consent")}</span>
                </label>
                <button type="button" className={buttonClass("primary")} disabled={!consent} onClick={() => void sendSummary()}>
                  {t("submit")}
                </button>
                {whatsapp ? (
                  <WhatsAppLink
                    href={whatsapp}
                    route={route}
                    label={whatsappRoutes[route].displayName ? `${common("whatsapp")}, ${whatsappRoutes[route].displayName}` : common("whatsapp")}
                    className={buttonClass("whatsapp")}
                  >
                    {whatsappRoutes[route].displayName ? `${common("whatsapp")} · ${whatsappRoutes[route].displayName}` : common("whatsapp")}
                  </WhatsAppLink>
                ) : null}
                <p role="status" className="min-h-6 text-sm text-muted">
                  {note}
                </p>
              </div>
            ) : null}

            <form
              className="grid gap-2 border-t border-white/10 pt-4"
              onSubmit={(event) => {
                event.preventDefault();
                setFaqAnswer(answerFromKnowledge(faq, locale) ?? salesConfirmation[locale]);
              }}
            >
              <label className="grid gap-2 text-sm">
                <span>{t("ask")}</span>
                <input
                  value={faq}
                  onChange={(event) => setFaq(event.target.value)}
                  placeholder={t("askPlaceholder")}
                  className="min-h-12 border border-white/15 bg-ink px-3 text-base"
                />
              </label>
              <button type="submit" className={buttonClass("secondary")}>
                {t("ask")}
              </button>
              {faqAnswer ? <p className="text-sm leading-6">{faqAnswer}</p> : null}
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
}

function choose(intent: Intent, locale: Locale, setFlow: (state: FlowState) => void) {
  setFlow(selectIntent(intent));
  track("ai_conversation", { locale, intent });
}

function buyerPayload(flow: FlowState, locale: Locale) {
  return {
    intent: "buy" as const,
    source: "ai" as const,
    locale,
    country: flow.answers.country,
    businessName: flow.answers.businessName,
    devices: flow.answers.devices,
    quantity: flow.answers.quantity,
    condition: flow.answers.condition,
    lockStatus: flow.answers.lockStatus,
    resale: flow.answers.resale,
    cadence: flow.answers.cadence,
    whatsapp: flow.answers.whatsapp,
    language: flow.answers.language,
    consent: true as const,
    companyWebsite: "",
  };
}

function sellerPayload(flow: FlowState, locale: Locale) {
  return {
    intent: "sell" as const,
    source: "ai" as const,
    locale,
    businessName: flow.answers.businessName,
    location: flow.answers.location,
    devices: flow.answers.devices,
    quantity: flow.answers.quantity,
    usage: flow.answers.usage,
    carrier: flow.answers.carrier,
    lockStatus: flow.answers.lockStatus,
    activation: flow.answers.activation,
    grade: flow.answers.grade,
    desiredPrice: flow.answers.desiredPrice,
    whatsapp: flow.answers.whatsapp,
    upload: flow.answers.upload,
    consent: true as const,
    companyWebsite: "",
  };
}

function AssistantIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 16.5V7.8A2.8 2.8 0 0 1 7.8 5h8.4A2.8 2.8 0 0 1 19 7.8v5.4a2.8 2.8 0 0 1-2.8 2.8H9l-4 3.3Z" />
    </svg>
  );
}
