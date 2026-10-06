import { describe, expect, it } from "vitest";

import { localeForCountry, whatsappRouteForCountry } from "@/lib/locale/countryMap";
import { detectCountryFromHeaders } from "@/lib/locale/detectCountry";
import { readLocaleCookie, serializeLocaleCookie } from "@/lib/locale/localeCookie";

describe("country mapping", () => {
  it("returns Spanish for other Spanish-speaking countries without listing them as markets", () => {
    expect(localeForCountry("AR")).toBe("es");
    expect(whatsappRouteForCountry("AR")).toBe("spanish");
  });

  it("does not assign a locale to an unmapped country", () => {
    expect(localeForCountry("DE")).toBeNull();
  });

  it("reads the first recognized edge header and ignores unknown codes", () => {
    const headers = new Headers({
      "cf-ipcountry": "XX",
      "x-vercel-ip-country": "co",
    });
    expect(detectCountryFromHeaders(headers)).toBe("CO");
  });
});

describe("locale cookie", () => {
  it("reads only a supported locale", () => {
    expect(readLocaleCookie("theme=dark; NEXT_LOCALE=es")).toBe("es");
    expect(readLocaleCookie("NEXT_LOCALE=fr")).toBeNull();
  });

  it("serializes a persistent SameSite cookie", () => {
    expect(serializeLocaleCookie("en", true)).toContain("NEXT_LOCALE=en");
    expect(serializeLocaleCookie("en", true)).toContain("Secure");
  });
});
