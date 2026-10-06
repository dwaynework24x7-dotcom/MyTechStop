import { describe, expect, it } from "vitest";

import { routeForLocale, buildWhatsAppLink } from "@/lib/whatsapp/link";
import { routeLead } from "@/lib/ai/routing";

describe("WhatsApp routing", () => {
  it("follows the page locale", () => {
    expect(routeForLocale("es")).toBe("spanish");
    expect(routeForLocale("en")).toBe("english");
  });

  it("lets the buyer's language choice override the page", () => {
    expect(routeLead("es", "en")).toBe("spanish");
    expect(routeLead("en", "es")).toBe("english");
    expect(routeLead(undefined, "es")).toBe("spanish");
  });

  it("refuses a missing or invalid phone", () => {
    expect(buildWhatsAppLink("", "Hello")).toBeNull();
    expect(buildWhatsAppLink("123", "Hello")).toBeNull();
    expect(buildWhatsAppLink("+1 (305) 555-0100", "Hello")).toBe(
      "https://wa.me/13055550100?text=Hello",
    );
  });
});
