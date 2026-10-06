export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = Partial<Record<UtmKey, string>> & {
  landingPage?: string;
  referrer?: string;
};

const STORAGE_KEY = "mts_attribution";

export function readUtmFromSearch(search: string): Partial<Record<UtmKey, string>> {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const result: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().slice(0, 200);
    if (value) result[key] = value;
  }
  return result;
}

export function mergeAttribution(existing: Attribution | null, incoming: Attribution): Attribution {
  return {
    ...(existing ?? {}),
    ...stripEmpty(incoming),
    landingPage: existing?.landingPage || incoming.landingPage,
    referrer: existing?.referrer || incoming.referrer,
  };
}

function stripEmpty(value: Attribution): Attribution {
  const next: Attribution = {};
  for (const key of UTM_KEYS) {
    if (value[key]) next[key] = value[key];
  }
  if (value.landingPage) next.landingPage = value.landingPage.slice(0, 300);
  if (value.referrer) next.referrer = value.referrer.slice(0, 300);
  return next;
}

export function attributionStorageKey(): string {
  return STORAGE_KEY;
}
