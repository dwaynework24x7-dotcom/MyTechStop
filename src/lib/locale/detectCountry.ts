/**
 * Provider-agnostic country detection.
 * Reads country codes already attached by the edge host. Does not call a geo API.
 *
 * Supported hosts:
 * - Cloudflare: cf-ipcountry
 * - Vercel: x-vercel-ip-country
 * - CloudFront: cloudfront-viewer-country
 * - Generic / other hosts: x-country-code
 */

const COUNTRY_HEADERS = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "cloudfront-viewer-country",
  "x-country-code",
] as const;

/** Codes hosts use when the country is unknown, blocked, or anonymized. */
const UNKNOWN_CODES = new Set(["XX", "T1", "A1", "A2"]);

type HeaderReader = { get(name: string): string | null };

export function detectCountryFromHeaders(headers: HeaderReader): string | null {
  for (const name of COUNTRY_HEADERS) {
    const value = headers.get(name)?.trim().toUpperCase();
    if (!value || !/^[A-Z]{2}$/.test(value) || UNKNOWN_CODES.has(value)) continue;
    return value;
  }
  return null;
}

/**
 * Development-only override. Ignored in production so a local env value
 * cannot ship as a visitor's country.
 */
export function detectCountry(headers: HeaderReader, nodeEnv: string = process.env.NODE_ENV): string | null {
  if (nodeEnv !== "production") {
    const override = process.env.MTS_DEV_COUNTRY?.trim().toUpperCase();
    if (override && /^[A-Z]{2}$/.test(override)) return override;
  }
  return detectCountryFromHeaders(headers);
}
