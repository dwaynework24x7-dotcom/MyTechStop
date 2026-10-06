import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { detectCountry } from "@/lib/locale/detectCountry";
import type { LeadInput } from "@/lib/leads/schema";
import { markPriority, teamSummary } from "@/lib/leads/summary";

export type LeadResult =
  | { ok: true; id: string; sink: "local"; priority: boolean }
  | { ok: false; code: "not_configured" | "error" };

export type LeadAttachment = { id: string; filename: string };

export interface LeadService {
  submit(lead: LeadInput, requestHeaders: Headers, attachment?: LeadAttachment): Promise<LeadResult>;
}

export function createLeadService(): LeadService {
  if (process.env.NODE_ENV !== "production" || process.env.LEAD_LOCAL_SINK === "true") {
    return new LocalLeadService();
  }
  return new UnconfiguredLeadService();
}

class UnconfiguredLeadService implements LeadService {
  async submit(): Promise<LeadResult> {
    return { ok: false, code: "not_configured" };
  }
}

class LocalLeadService implements LeadService {
  async submit(lead: LeadInput, requestHeaders: Headers, attachment?: LeadAttachment): Promise<LeadResult> {
    const quantity = "quantity" in lead ? lead.quantity : "";
    const priority = markPriority(quantity, process.env.LEAD_PRIORITY_QUANTITY);
    const country = detectCountry(requestHeaders);
    const id = randomUUID();
    const record = {
      id,
      receivedAt: new Date().toISOString(),
      priority,
      detectedCountry: country,
      summary: teamSummary(publicFields(lead)),
      attachment: attachment ?? null,
      lead,
      contentSource: "fallback",
      crm: "not_connected",
    };

    const directory = path.join(process.cwd(), "storage", "leads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${id}.json`), JSON.stringify(record, null, 2), "utf8");

    console.info("lead stored locally", {
      id,
      intent: lead.intent,
      source: lead.source,
      locale: lead.locale,
      country,
      priority,
    });

    return { ok: true, id, sink: "local", priority };
  }
}

function publicFields(lead: LeadInput): Record<string, string> {
  const entries = Object.entries(lead).filter(([key, value]) => {
    if (key === "companyWebsite" || key === "consent" || key === "attribution" || key === "intent" || key === "source") {
      return false;
    }
    return typeof value === "string" && value.trim().length > 0;
  });
  return Object.fromEntries(entries) as Record<string, string>;
}
