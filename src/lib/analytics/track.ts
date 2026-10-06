"use client";

export type AnalyticsEvent =
  | "whatsapp_english_click"
  | "whatsapp_spanish_click"
  | "inventory_request"
  | "quote_request"
  | "sell_submission"
  | "upload_inventory"
  | "ai_conversation"
  | "qualified_lead";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Pushes a non-sensitive event when GTM is configured. Never send contact details. */
export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GTM_ID) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
