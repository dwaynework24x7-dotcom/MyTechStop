import { z } from "zod";

import { UTM_KEYS } from "@/lib/attribution/utm";

const utmShape = Object.fromEntries(UTM_KEYS.map((key) => [key, z.string().trim().max(200).optional()]));

export const attributionSchema = z
  .object({
    ...utmShape,
    landingPage: z.string().trim().max(300).optional(),
    referrer: z.string().trim().max(300).optional(),
  })
  .partial();

const localeSchema = z.enum(["en", "es"]);

const honeypot = z.string().max(0).optional().or(z.literal(""));

export const buyerFormSchema = z.object({
  intent: z.literal("buy"),
  source: z.literal("form"),
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(160),
  whatsapp: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(80),
  devices: z.string().trim().min(2).max(300),
  quantity: z.string().trim().min(1).max(80),
  condition: z.enum(["new", "used", "either"]),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true),
  companyWebsite: honeypot,
  locale: localeSchema,
  attribution: attributionSchema.optional(),
});

export const sellerFormSchema = z.object({
  intent: z.literal("sell"),
  source: z.literal("form"),
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(160),
  whatsapp: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(120),
  model: z.string().trim().min(2).max(160),
  storage: z.string().trim().max(40).optional().or(z.literal("")),
  color: z.string().trim().max(40).optional().or(z.literal("")),
  carrier: z.string().trim().max(80).optional().or(z.literal("")),
  lockStatus: z.enum(["unlocked", "locked", "mixed", "unknown"]).optional().or(z.literal("")),
  usage: z.enum(["new", "used", "mixed"]).optional().or(z.literal("")),
  activation: z.enum(["activated", "non_activated", "mixed", "unknown"]).optional().or(z.literal("")),
  grade: z.string().trim().max(80).optional().or(z.literal("")),
  quantity: z.string().trim().min(1).max(80),
  desiredPrice: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true),
  companyWebsite: honeypot,
  locale: localeSchema,
  attribution: attributionSchema.optional(),
});

export const aiBuyerSchema = z.object({
  intent: z.literal("buy"),
  source: z.literal("ai"),
  country: z.string().trim().min(2).max(80),
  businessName: z.string().trim().min(2).max(160),
  devices: z.string().trim().min(2).max(300),
  quantity: z.string().trim().min(1).max(80),
  condition: z.enum(["new", "used", "either"]),
  lockStatus: z.enum(["unlocked", "carrier", "either"]),
  resale: z.enum(["yes", "no"]),
  cadence: z.enum(["one_time", "recurring"]),
  whatsapp: z.string().trim().min(6).max(40),
  language: localeSchema,
  consent: z.literal(true),
  companyWebsite: honeypot,
  locale: localeSchema,
  attribution: attributionSchema.optional(),
});

export const aiSellerSchema = z.object({
  intent: z.literal("sell"),
  source: z.literal("ai"),
  businessName: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(160),
  devices: z.string().trim().min(2).max(300),
  quantity: z.string().trim().min(1).max(80),
  usage: z.enum(["new", "used", "mixed"]),
  carrier: z.string().trim().min(1).max(80),
  lockStatus: z.enum(["unlocked", "locked", "mixed"]),
  activation: z.enum(["activated", "non_activated", "mixed", "unknown"]),
  grade: z.string().trim().min(1).max(80),
  desiredPrice: z.string().trim().min(1).max(80),
  whatsapp: z.string().trim().min(6).max(40),
  upload: z.enum(["attached", "skipped"]),
  consent: z.literal(true),
  companyWebsite: honeypot,
  locale: localeSchema,
  attribution: attributionSchema.optional(),
});

export type BuyerFormLead = z.infer<typeof buyerFormSchema>;
export type SellerFormLead = z.infer<typeof sellerFormSchema>;
export type AiBuyerLead = z.infer<typeof aiBuyerSchema>;
export type AiSellerLead = z.infer<typeof aiSellerSchema>;
export type LeadInput = BuyerFormLead | SellerFormLead | AiBuyerLead | AiSellerLead;
