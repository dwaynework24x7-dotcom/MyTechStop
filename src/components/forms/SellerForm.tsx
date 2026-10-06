"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { featuredMarkets } from "@/config/countries";
import type { Locale } from "@/config/locale";
import { messageFor } from "@/components/forms/BuyerForm";
import { submitLead } from "@/components/forms/submitLead";
import { Modal } from "@/components/ui/Modal";
import { buttonClass } from "@/components/ui/buttonStyles";
import { track } from "@/lib/analytics/track";

type Props = { open?: boolean; focusFile?: boolean; onClose?: () => void; embedded?: boolean };

export function SellerForm({ open = false, focusFile = false, onClose = () => undefined, embedded = false }: Props) {
  const t = useTranslations("forms");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const listId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "local" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open && focusFile) fileRef.current?.focus();
  }, [open, focusFile]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("companyWebsite") ?? "")) return;

    setStatus("sending");
    setMessage("");
    const result = await submitLead(
      {
        intent: "sell",
        source: "form",
        locale,
        name: data.get("name"),
        businessName: data.get("businessName"),
        email: data.get("email"),
        whatsapp: data.get("whatsapp"),
        country: data.get("country"),
        city: data.get("city"),
        model: data.get("model"),
        storage: data.get("storage"),
        color: data.get("color"),
        carrier: data.get("carrier"),
        lockStatus: data.get("lockStatus"),
        usage: data.get("usage"),
        activation: data.get("activation"),
        grade: data.get("grade"),
        quantity: data.get("quantity"),
        desiredPrice: data.get("desiredPrice"),
        notes: data.get("notes"),
        consent: data.get("consent") === "on" ? true : false,
        companyWebsite: "",
      },
      file,
    );

    if (result.ok && result.sink === "local") {
      setStatus("local");
      setMessage(common("savedLocal"));
      track("sell_submission", { locale, sink: "local", file: Boolean(file) });
      if (file) track("upload_inventory", { locale });
      form.reset();
      setFile(null);
      return;
    }

    setStatus("error");
    setMessage(messageFor(result.code, common));
  }

  const form = (
    <>
      <p className="mb-6 max-w-xl text-sm leading-6 text-muted">{t("sellerIntro")}</p>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="hp">
          {t("businessName")}
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
        <Text label={t("name")} name="name" autoComplete="name" required />
        <Text label={t("businessName")} name="businessName" autoComplete="organization" required />
        <Text label={t("email")} name="email" type="email" autoComplete="email" required />
        <Text label={t("whatsapp")} name="whatsapp" type="tel" autoComplete="tel" required />
        <Text label={t("country")} name="country" autoComplete="country-name" required listId={listId} />
        <datalist id={listId}>
          {featuredMarkets().map((market) => (
            <option key={market.code} value={market.name[locale]} />
          ))}
        </datalist>
        <Text label={t("city")} name="city" autoComplete="address-level2" required />
        <Text label={t("model")} name="model" required className="sm:col-span-2" />
        <Text label={t("storage")} name="storage" optionalLabel={t("optional")} />
        <Text label={t("color")} name="color" optionalLabel={t("optional")} />
        <Text label={t("carrier")} name="carrier" optionalLabel={t("optional")} />
        <Select
          label={t("lockStatus")}
          name="lockStatus"
          options={[
            ["", t("optional")],
            ["unlocked", t("unlocked")],
            ["locked", t("locked")],
            ["mixed", t("mixed")],
            ["unknown", t("unknown")],
          ]}
        />
        <Select
          label={t("usage")}
          name="usage"
          options={[
            ["", t("optional")],
            ["new", t("new")],
            ["used", t("used")],
            ["mixed", t("mixed")],
          ]}
        />
        <Select
          label={t("activation")}
          name="activation"
          options={[
            ["", t("optional")],
            ["activated", t("activated")],
            ["non_activated", t("nonActivated")],
            ["mixed", t("mixed")],
            ["unknown", t("unknown")],
          ]}
        />
        <Text label={t("grade")} name="grade" optionalLabel={t("optional")} />
        <Text label={t("quantity")} name="quantity" required />
        <Text label={t("desiredPrice")} name="desiredPrice" optionalLabel={t("optional")} />
        <label className="field sm:col-span-2">
          <span>
            {t("notes")} <span className="text-white/45">({t("optional")})</span>
          </span>
          <textarea name="notes" maxLength={2000} />
        </label>
        <label className="field sm:col-span-2">
          <span>
            {t("file")} <span className="text-white/45">({t("optional")})</span>
          </span>
          <input
            ref={fileRef}
            id={embedded ? "inventory-file" : undefined}
            name="file"
            type="file"
            accept=".xlsx,.csv,.pdf,application/pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <span className="text-xs text-white/50">{t("fileHint")}</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-muted sm:col-span-2">
          <input name="consent" type="checkbox" required className="mt-1 size-4" />
          <span>{common("consent")}</span>
        </label>
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
      <div id="inventory-list" className="border border-white/10 bg-panel p-5 text-metal sm:p-8">
        <h2 className="text-2xl font-medium tracking-tight text-white">{t("sellerTitle")}</h2>
        {form}
      </div>
    );
  }

  return (
    <Modal open={open} title={t("sellerTitle")} closeLabel={common("close")} onClose={onClose}>
      {form}
    </Modal>
  );
}

function Text({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  listId,
  optionalLabel,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  listId?: string;
  optionalLabel?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>
        {label} {optionalLabel ? <span className="text-white/45">({optionalLabel})</span> : null}
      </span>
      <input name={name} type={type} required={required} autoComplete={autoComplete} list={listId} maxLength={160} />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: [string, string][] }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} defaultValue="">
        {options.map(([value, text]) => (
          <option key={value || "empty"} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
