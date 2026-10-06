export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export type Localized = Record<Locale, string>;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es";
}

export function pickLocalized(value: Localized, locale: Locale): string {
  return value[locale];
}
