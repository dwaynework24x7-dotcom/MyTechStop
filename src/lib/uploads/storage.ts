import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredUpload = {
  id: string;
  filename: string;
};

export function uploadsEnabled(): boolean {
  if (process.env.UPLOAD_DRIVER === "disabled") return false;
  if (process.env.NODE_ENV !== "production") return process.env.UPLOAD_DRIVER !== "disabled";
  return process.env.UPLOAD_DRIVER === "local";
}

function uploadDirectory(): string {
  const configured = process.env.UPLOAD_LOCAL_DIR?.trim();
  if (configured) return configured;
  return path.join(process.cwd(), "storage", "uploads");
}

/** Writes a validated file outside /public. The saved file is never executed. */
export async function storeUpload(safeName: string, bytes: Uint8Array): Promise<StoredUpload> {
  const id = randomUUID();
  const filename = `${id}_${safeName}`;
  const directory = path.resolve(uploadDirectory());
  await mkdir(directory, { recursive: true });
  const target = path.resolve(directory, filename);
  if (!target.startsWith(`${directory}${path.sep}`)) {
    throw new Error("Unsafe upload path");
  }
  await writeFile(target, bytes, { flag: "wx" });
  return { id, filename };
}
