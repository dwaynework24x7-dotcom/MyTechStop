import { describe, expect, it } from "vitest";

import { createFlow, previousStep, selectIntent, submitAnswer } from "@/lib/ai/flow";
import { buyerQuestions } from "@/lib/ai/flow";
import { answerFromKnowledge } from "@/content/fallback/knowledge";
import { markPriority, teamSummary } from "@/lib/leads/summary";
import { mergeAttribution, readUtmFromSearch } from "@/lib/attribution/utm";

describe("assistant flow", () => {
  it("walks the buyer questions and stores only the answers given", () => {
    let state = selectIntent("buy");
    const values = ["Colombia", "Andes Movil", "iPhone", "25", "either", "unlocked", "yes", "recurring", "+57 300 000 0000", "es"];
    values.forEach((value, index) => {
      expect(state.complete).toBe(false);
      expect(buyerQuestions[index]?.id).toBeTruthy();
      state = submitAnswer(state, value);
    });
    expect(state.complete).toBe(true);
    expect(state.answers.businessName).toBe("Andes Movil");
    expect(state.answers.quantity).toBe("25");
    expect(state.answers.price).toBeUndefined();
  });

  it("rejects an empty answer and an unknown choice", () => {
    const state = selectIntent("buy");
    expect(submitAnswer(state, "   ")).toEqual(state);
    const condition = { ...state, step: 4 };
    expect(submitAnswer(condition, "refurbished")).toEqual(condition);
  });

  it("can move back without inventing an earlier answer", () => {
    const started = submitAnswer(selectIntent("sell"), "North Store");
    const back = previousStep(started);
    expect(back.step).toBe(0);
    expect(back.answers.businessName).toBeUndefined();
    expect(previousStep(createFlow())).toEqual(createFlow());
  });
});

describe("knowledge", () => {
  it("answers a price question with the sales confirmation and no figure", () => {
    const answer = answerFromKnowledge("how much is the iPhone 18 Pro Max", "en");
    expect(answer).toBe("A sales representative will confirm current availability and pricing.");
    expect(answer).not.toMatch(/\$|USD|\d/);
  });

  it("returns null for an unrelated question", () => {
    expect(answerFromKnowledge("what is the warranty period", "en")).toBeNull();
    expect(answerFromKnowledge("cuál es la garantía", "es")).toBeNull();
  });
});

describe("lead priority and summary", () => {
  it("does not mark priority when no threshold is configured", () => {
    expect(markPriority("500 units", undefined)).toBe(false);
    expect(markPriority("500 units", "")).toBe(false);
  });

  it("marks priority only from a configured threshold", () => {
    expect(markPriority("25 units", "20")).toBe(true);
    expect(markPriority("a pallet", "20")).toBe(false);
  });

  it("summarizes only fields that were provided", () => {
    const summary = teamSummary({ businessName: "Andes Movil", country: "Colombia", quantity: "25", notes: "" });
    expect(summary).toContain("Business: Andes Movil");
    expect(summary).toContain("Quantity: 25");
    expect(summary).not.toContain("Notes");
    expect(summary).not.toMatch(/available|ships|\$/i);
  });
});

describe("utm", () => {
  it("keeps known parameters and the first landing page", () => {
    const incoming = readUtmFromSearch("?utm_source=instagram&utm_medium=social&utm_campaign=co-iphone&gclid=abc");
    expect(incoming).toEqual({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "co-iphone",
    });
    const merged = mergeAttribution(
      { utm_source: "instagram", landingPage: "/es", referrer: "https://instagram.com" },
      { utm_source: "instagram", landingPage: "/es/other", referrer: "https://example.com" },
    );
    expect(merged.landingPage).toBe("/es");
    expect(merged.referrer).toBe("https://instagram.com");
  });
});
