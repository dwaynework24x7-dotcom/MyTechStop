"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import { featuredMarkets } from "@/config/countries";
import type { Locale } from "@/config/locale";
import { submitLead } from "@/components/forms/submitLead";
import { Modal } from "@/components/ui/Modal";
import { buttonClass } from "@/components/ui/buttonStyles";
import { track } from "@/lib/analytics/track";

type Props = { open?: boolean; onClose?: () => void; embedded?: boolean };

export function BuyerForm({ open = false, onClose = () => undefined, embedded = false }: Props) {
  const t = useTranslations("forms");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const listId = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "local" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("companyWebsite") ?? "")) return;

    setStatus("sending");
    setMessage("");
    const result = await submitLead({
      intent: "buy",
      source: "form",
      locale,
      name: data.get("name"),
      businessName: data.get("businessName"),
      email: data.get("email"),
      whatsapp: data.get("whatsapp"),
      country: data.get("country"),
      devices: data.get("devices"),
      quantity: data.get("quantity"),
      condition: data.get("condition"),
      notes: data.get("notes"),
      consent: data.get("consent") === "on" ? true : false,
      companyWebsite: "",
    });

    if (result.ok && result.sink === "local") {
      setStatus("local");
      setMessage(common("savedLocal"));
      track("quote_request", { locale, sink: "local" });
      form.reset();
      return;
    }

    setStatus("error");
    setMessage(messageFor(result.code, common));
  }

  const form = (
    <>
      <p className="mb-6 max-w-xl text-sm leading-6 text-muted">{t("buyerIntro")}</p>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Honeypot label={t("businessName")} />
        <Field label={t("name")} name="name" autoComplete="name" required />
        <Field label={t("businessName")} name="businessName" autoComplete="organization" required />
        <Field label={t("email")} name="email" type="email" autoComplete="email" required />
        <Field label={t("whatsapp")} name="whatsapp" type="tel" autoComplete="tel" required />
        <Field label={t("country")} name="country" autoComplete="country-name" required listId={listId} />
        <datalist id={listId}>
          {featuredMarkets().map((market) => (
            <option key={market.code} value={market.name[locale]} />
          ))}
        </datalist>
        <Field label={t("quantity")} name="quantity" required />
        <label className="field sm:col-span-2">
          <span>{t("devices")}</span>
          <input name="devices" required maxLength={300} />
        </label>
        <label className="field">
          <span>{t("condition")}</span>
          <select name="condition" defaultValue="either">
            <option value="new">{t("new")}</option>
            <option value="used">{t("used")}</option>
            <option value="either">{t("either")}</option>
          </select>
        </label>
        <label className="field sm:col-span-2">
          <span>
            {t("notes")} <span className="text-white/45">({t("optional")})</span>
          </span>
          <textarea name="notes" maxLength={2000} />
        </label>
        <Consent label={common("consent")} />
        <div className="sm:col-span-2">
          <button type="submit" className={buttonClass("primary")} disabled={status === "sending"}>
            {common("send")}
          </button>
          <p role="status" className="mt-4 min-h-6 text-sm leading-6 text-muted">
            {message}
          </p>
        </div>
      </form>
    </>
  );

  if (embedded) {
    return (
      <div id="quote" className="border border-white/10 bg-panel p-5 sm:p-8">
        <h2 className="text-2xl font-medium tracking-tight text-white">{t("buyerTitle")}</h2>
        {form}
      </div>
    );
  }

  return (
    <Modal open={open} title={t("buyerTitle")} closeLabel={common("close")} onClose={onClose}>
      {form}
    </Modal>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  listId,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  listId?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} required={required} autoComplete={autoComplete} list={listId} maxLength={160} />
    </label>
  );
}

function Consent({ label }: { label: string }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-muted sm:col-span-2">
      <input name="consent" type="checkbox" required className="mt-1 size-4" />
      <span>{label}</span>
    </label>
  );
}

function Honeypot({ label }: { label: string }) {
  return (
    <label className="hp">
      {label}
      <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
    </label>
  );
}

function messageFor(code: string | undefined, common: (key: "errorGeneric" | "notConfigured" | "rateLimited" | "uploadRejected" | "uploadNotConfigured") => string) {
  if (code === "rate") return common("rateLimited");
  if (code === "not_configured") return common("notConfigured");
  if (code === "upload_not_configured") return common("uploadNotConfigured");
  if (code === "type" || code === "size" || code === "name" || code === "content") return common("uploadRejected");
  return common("errorGeneric");
}

export { messageFor };
