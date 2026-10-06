import "server-only";

/**
 * GoHighLevel boundary.
 * No live HTTP calls are made. Connecting a company account is not the same
 * as a tested integration, so these methods stay inactive on purpose.
 */

export type GhlResult = { ok: false; code: "not_configured" | "not_implemented" };

export type GhlContactInput = {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  tags?: string[];
  source?: string;
};

function gate(): GhlResult {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    return { ok: false, code: "not_configured" };
  }
  return { ok: false, code: "not_implemented" };
}

export async function createContact(_input: GhlContactInput): Promise<GhlResult> {
  return gate();
}

export async function updateContact(_contactId: string, _input: GhlContactInput): Promise<GhlResult> {
  return gate();
}

export async function createBuyerLead(_input: GhlContactInput): Promise<GhlResult> {
  return gate();
}

export async function createSellerLead(_input: GhlContactInput): Promise<GhlResult> {
  return gate();
}

export async function addTags(_contactId: string, _tags: string[]): Promise<GhlResult> {
  return gate();
}

export async function movePipelineStage(_contactId: string, _stage: string): Promise<GhlResult> {
  return gate();
}

export async function createTask(_contactId: string, _title: string): Promise<GhlResult> {
  return gate();
}

export async function triggerWorkflow(_contactId: string, _workflowId: string): Promise<GhlResult> {
  return gate();
}
