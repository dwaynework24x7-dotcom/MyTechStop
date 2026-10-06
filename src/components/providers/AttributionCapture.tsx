"use client";

import { useEffect } from "react";

import { attributionStorageKey, mergeAttribution, readUtmFromSearch, type Attribution } from "@/lib/attribution/utm";

export function AttributionCapture() {
  useEffect(() => {
    const incoming = readUtmFromSearch(window.location.search);
    const existing = readStoredAttribution();
    const next = mergeAttribution(existing, {
      ...incoming,
      landingPage: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || undefined,
    });
    sessionStorage.setItem(attributionStorageKey(), JSON.stringify(next));
  }, []);

  return null;
}

export function readStoredAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(attributionStorageKey());
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Attribution;
  } catch {
    return null;
  }
}
