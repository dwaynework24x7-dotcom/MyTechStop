import { NextResponse } from "next/server";

import { createLeadService } from "@/lib/leads/service";
import { aiBuyerSchema, aiSellerSchema, buyerFormSchema, sellerFormSchema, type LeadInput } from "@/lib/leads/schema";
import { clientKey, rateLimit } from "@/lib/leads/rateLimit";
import { isSameOrigin } from "@/lib/security/origin";
import { storeUpload, uploadsEnabled } from "@/lib/uploads/storage";
import { maxUploadBytes, validateUpload } from "@/lib/uploads/validate";
import type { ZodType } from "zod";

export const runtime = "nodejs";

const schemas = {
  "buy:form": buyerFormSchema,
  "sell:form": sellerFormSchema,
  "buy:ai": aiBuyerSchema,
  "sell:ai": aiSellerSchema,
} as const;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, code: "origin" }, { status: 403 });
  }

  if (!rateLimit(`lead:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false, code: "rate" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxUploadBytes() + 64 * 1024) {
    return NextResponse.json({ ok: false, code: "size" }, { status: 413 });
  }

  try {
    const { json, file } = await readBody(request);
    const schema = selectSchema(json);
    if (!schema) return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });

    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });

    const lead = parsed.data;
    if (lead.source === "ai" && lead.intent === "sell") {
      if (lead.upload === "attached" && !file) return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
      if (lead.upload === "skipped" && file) return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
    }

    let attachment: { id: string; filename: string } | undefined;
    if (file) {
      if (!uploadsEnabled()) {
        return NextResponse.json({ ok: false, code: "upload_not_configured" }, { status: 503 });
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const validated = validateUpload({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        bytes,
        maxBytes: maxUploadBytes(),
      });
      if (!validated.ok) return NextResponse.json({ ok: false, code: validated.code }, { status: 400 });
      const stored = await storeUpload(validated.safeName, bytes);
      attachment = { id: stored.id, filename: validated.safeName };
    }

    const result = await createLeadService().submit(lead, request.headers, attachment);
    if (!result.ok) return NextResponse.json(result, { status: 503 });
    return NextResponse.json({ ok: true, id: result.id, sink: result.sink });
  } catch {
    return NextResponse.json({ ok: false, code: "error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ ok: false, code: "method" }, { status: 405 });
}

async function readBody(request: Request): Promise<{ json: unknown; file: File | null }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return { json: await request.json(), file: null };
  }

  const form = await request.formData();
  const payload = form.get("payload");
  if (typeof payload !== "string") throw new Error("payload");
  const uploaded = form.get("file");
  const file = uploaded instanceof File && uploaded.size > 0 ? uploaded : null;
  return { json: JSON.parse(payload) as unknown, file };
}

function selectSchema(json: unknown): ZodType<LeadInput> | null {
  if (!json || typeof json !== "object") return null;
  const intent = "intent" in json ? json.intent : null;
  const source = "source" in json ? json.source : null;
  if ((intent !== "buy" && intent !== "sell") || (source !== "form" && source !== "ai")) return null;
  return schemas[`${intent}:${source}`];
}
