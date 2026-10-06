const ALLOWED_EXTENSIONS = ["pdf", "csv", "xlsx"] as const;

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

const MIME_BY_EXTENSION: Record<AllowedExtension, readonly string[]> = {
  pdf: ["application/pdf"],
  csv: ["text/csv", "application/csv", "text/plain", "application/vnd.ms-excel"],
  xlsx: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/octet-stream",
  ],
};

export type UploadValidationResult =
  | { ok: true; safeName: string; extension: AllowedExtension }
  | { ok: false; code: "type" | "size" | "name" | "content" };

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "";
  const cleaned = base
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^\.+/, "");

  const dot = cleaned.lastIndexOf(".");
  if (dot <= 0) return "";

  const extension = cleaned.slice(dot + 1).toLowerCase();
  const stem = cleaned
    .slice(0, dot)
    .replace(/\./g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  if (!stem || !ALLOWED_EXTENSIONS.includes(extension as AllowedExtension)) return "";
  return `${stem}.${extension}`;
}

export function validateUpload(input: {
  filename: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
  maxBytes: number;
}): UploadValidationResult {
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > input.maxBytes) {
    return { ok: false, code: "size" };
  }

  const safeName = sanitizeFilename(input.filename);
  if (!safeName) return { ok: false, code: "name" };

  const extension = safeName.slice(safeName.lastIndexOf(".") + 1) as AllowedExtension;
  const mime = input.mimeType.trim().toLowerCase();
  const mimeAllowed = mime === "" || MIME_BY_EXTENSION[extension].includes(mime);
  if (!mimeAllowed) return { ok: false, code: "type" };

  if (!matchesSignature(extension, input.bytes)) return { ok: false, code: "content" };

  return { ok: true, safeName, extension };
}

function matchesSignature(extension: AllowedExtension, bytes: Uint8Array): boolean {
  if (extension === "pdf") return startsWith(bytes, [0x25, 0x50, 0x44, 0x46]);
  if (extension === "xlsx") return startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]);
  return looksLikeCsv(bytes);
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((value, index) => bytes[index] === value);
}

function looksLikeCsv(bytes: Uint8Array): boolean {
  const sample = bytes.subarray(0, Math.min(bytes.length, 4096));
  const text = new TextDecoder("utf-8", { fatal: false }).decode(sample).trimStart().toLowerCase();
  if (!text) return false;
  if (text.includes("\u0000")) return false;
  if (text.startsWith("<!doctype") || text.startsWith("<html") || text.startsWith("<script") || text.startsWith("<?php")) {
    return false;
  }
  return true;
}

export function maxUploadBytes(): number {
  const configured = Number(process.env.UPLOAD_MAX_BYTES ?? 8 * 1024 * 1024);
  if (!Number.isFinite(configured) || configured <= 0) return 8 * 1024 * 1024;
  return Math.min(configured, 15 * 1024 * 1024);
}
