import { readStoredAttribution } from "@/components/providers/AttributionCapture";

export type LeadResponse = {
  ok: boolean;
  code?: string;
  sink?: string;
};

export async function submitLead(payload: unknown, file?: File | null): Promise<LeadResponse> {
  const attribution = readStoredAttribution() ?? undefined;
  const body = { ...(payload as Record<string, unknown>), attribution };

  let response: Response;
  if (file) {
    const form = new FormData();
    form.set("payload", JSON.stringify(body));
    form.set("file", file);
    response = await fetch("/api/leads", { method: "POST", body: form });
  } else {
    response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const result = (await response.json().catch(() => ({ ok: false, code: "error" }))) as LeadResponse;
  return { ok: response.ok && result.ok === true, code: result.code, sink: result.sink };
}
