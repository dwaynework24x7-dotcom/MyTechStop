import { describe, expect, it } from "vitest";

import { resolveLocale } from "@/lib/locale/resolveLocale";

describe("resolveLocale", () => {
  it("keeps an explicit URL locale ahead of cookie and country", () => {
    expect(
      resolveLocale({
        urlLocale: "en",
        cookieLocale: "es",
        country: "CO",
        acceptLanguage: "es-CO,es;q=0.9",
      }),
    ).toBe("en");
  });

  it("uses a saved language choice before country detection", () => {
    expect(resolveLocale({ cookieLocale: "en", country: "MX" })).toBe("en");
  });

  it("maps featured Spanish-speaking markets to Spanish", () => {
    for (const country of ["CO", "MX", "PE", "PY", "PA"]) {
      expect(resolveLocale({ country })).toBe("es");
    }
  });

  it("maps the configured English markets to English even if the browser is Spanish", () => {
    for (const country of ["US", "AE", "HK", "MN", "GH", "SN"]) {
      expect(resolveLocale({ country, acceptLanguage: "es-MX,es;q=0.9,en;q=0.2" })).toBe("en");
    }
  });

  it("uses Accept-Language when the country is unknown", () => {
    expect(resolveLocale({ country: "DE", acceptLanguage: "es-ES,es;q=0.8,en;q=0.2" })).toBe("es");
  });

  it("falls back to English for an unsupported language", () => {
    expect(resolveLocale({ country: "FR", acceptLanguage: "fr-FR,fr;q=0.9" })).toBe("en");
  });

  it("ignores an invalid cookie", () => {
    expect(resolveLocale({ cookieLocale: "fr", country: "CO" })).toBe("es");
  });
});
