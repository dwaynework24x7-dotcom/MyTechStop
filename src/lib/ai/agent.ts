import "server-only";

import type { Locale } from "@/config/locale";
import { salesConfirmation } from "@/content/fallback/knowledge";

/**
 * AI provider boundary.
 * The homepage assistant runs the approved question flow in the browser.
 * A model is not called, and no provider secret is shipped to the client.
 */
export type AIServiceStatus = "scripted" | "not_configured";

export function aiServiceStatus(): AIServiceStatus {
  if (!process.env.AI_API_KEY || !process.env.AI_PROVIDER) return "scripted";
  return "not_configured";
}

export function unavailableAnswer(locale: Locale): string {
  return salesConfirmation[locale];
}
