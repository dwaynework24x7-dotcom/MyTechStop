import { describe, expect, it } from "vitest";

import { buyerFormSchema, sellerFormSchema } from "@/lib/leads/schema";

const buyer = {
  intent: "buy" as const,
  source: "form" as const,
  locale: "es" as const,
  name: "Ada Lopez",
  businessName: "Andes Movil",
  email: "ada@example.com",
  whatsapp: "+57 300 000 0000",
  country: "Colombia",
  devices: "iPhone",
  quantity: "25",
  condition: "either" as const,
  notes: "",
  consent: true as const,
  companyWebsite: "",
};

describe("lead schemas", () => {
  it("accepts a buyer inquiry without a price", () => {
    const parsed = buyerFormSchema.parse(buyer);
    expect(parsed.quantity).toBe("25");
    expect(JSON.stringify(parsed)).not.toMatch(/\$|available/);
  });

  it("accepts a seller inquiry when optional fields are blank", () => {
    const parsed = sellerFormSchema.parse({
      intent: "sell",
      source: "form",
      locale: "en",
      name: "Sam Lee",
      businessName: "North Store",
      email: "sam@example.com",
      whatsapp: "+1 305 555 0100",
      country: "United States",
      city: "Miami",
      model: "iPhone 18 Pro Max",
      storage: "",
      color: "",
      carrier: "",
      lockStatus: "",
      usage: "",
      activation: "",
      grade: "",
      quantity: "42",
      desiredPrice: "",
      notes: "",
      consent: true,
      companyWebsite: "",
    });
    expect(parsed.model).toBe("iPhone 18 Pro Max");
    expect(parsed.desiredPrice).toBe("");
  });

  it("rejects a buyer inquiry without consent", () => {
    expect(buyerFormSchema.safeParse({ ...buyer, consent: false }).success).toBe(false);
  });
});
