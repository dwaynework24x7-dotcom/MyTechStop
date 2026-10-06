import { describe, expect, it } from "vitest";

import { sanitizeFilename, validateUpload } from "@/lib/uploads/validate";

const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
const xlsx = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
const csv = new TextEncoder().encode("model,qty\niPhone,2\n");

describe("upload validation", () => {
  it("sanitizes a safe filename and drops extra extensions", () => {
    expect(sanitizeFilename("../prices final.csv")).toBe("prices_final.csv");
    expect(sanitizeFilename("list.pdf.exe")).toBe("");
    expect(sanitizeFilename("notes.html")).toBe("");
  });

  it("accepts pdf, csv, and xlsx when the bytes match", () => {
    expect(validateUpload({ filename: "a.pdf", mimeType: "application/pdf", size: pdf.length, bytes: pdf, maxBytes: 1000 }).ok).toBe(true);
    expect(validateUpload({ filename: "a.csv", mimeType: "text/csv", size: csv.length, bytes: csv, maxBytes: 1000 }).ok).toBe(true);
    expect(
      validateUpload({
        filename: "a.xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: xlsx.length,
        bytes: xlsx,
        maxBytes: 1000,
      }).ok,
    ).toBe(true);
  });

  it("rejects html disguised as csv and oversized files", () => {
    const html = new TextEncoder().encode("<html><script>alert(1)</script></html>");
    expect(validateUpload({ filename: "a.csv", mimeType: "text/csv", size: html.length, bytes: html, maxBytes: 1000 }).ok).toBe(false);
    expect(validateUpload({ filename: "a.pdf", mimeType: "application/pdf", size: 50, bytes: pdf, maxBytes: 4 }).ok).toBe(false);
  });
});
