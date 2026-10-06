export type Intent = "buy" | "sell";

export type Question = {
  id: string;
  kind: "text" | "choice";
  options?: readonly string[];
  optional?: boolean;
};

export const buyerQuestions = [
  { id: "country", kind: "text" },
  { id: "businessName", kind: "text" },
  { id: "devices", kind: "text" },
  { id: "quantity", kind: "text" },
  { id: "condition", kind: "choice", options: ["new", "used", "either"] },
  { id: "lockStatus", kind: "choice", options: ["unlocked", "carrier", "either"] },
  { id: "resale", kind: "choice", options: ["yes", "no"] },
  { id: "cadence", kind: "choice", options: ["one_time", "recurring"] },
  { id: "whatsapp", kind: "text" },
  { id: "language", kind: "choice", options: ["en", "es"] },
] as const satisfies readonly Question[];

export const sellerQuestions = [
  { id: "businessName", kind: "text" },
  { id: "location", kind: "text" },
  { id: "devices", kind: "text" },
  { id: "quantity", kind: "text" },
  { id: "usage", kind: "choice", options: ["new", "used", "mixed"] },
  { id: "carrier", kind: "text" },
  { id: "lockStatus", kind: "choice", options: ["unlocked", "locked", "mixed"] },
  { id: "activation", kind: "choice", options: ["activated", "non_activated", "mixed", "unknown"] },
  { id: "grade", kind: "text" },
  { id: "desiredPrice", kind: "text" },
  { id: "whatsapp", kind: "text" },
  { id: "upload", kind: "choice", options: ["attached", "skipped"], optional: true },
] as const satisfies readonly Question[];

export type FlowState = {
  intent: Intent | null;
  step: number;
  answers: Record<string, string>;
  complete: boolean;
};

export function createFlow(): FlowState {
  return { intent: null, step: 0, answers: {}, complete: false };
}

export function questionsFor(intent: Intent): readonly Question[] {
  return intent === "buy" ? buyerQuestions : sellerQuestions;
}

export function selectIntent(intent: Intent): FlowState {
  return { intent, step: 0, answers: {}, complete: false };
}

export function submitAnswer(state: FlowState, raw: string): FlowState {
  if (!state.intent || state.complete) return state;
  const questions = questionsFor(state.intent);
  const question = questions[state.step];
  if (!question) return state;

  const value = raw.trim();
  if (!value) return state;
  if (question.kind === "choice" && question.options && !question.options.includes(value)) return state;

  const answers = { ...state.answers, [question.id]: value };
  const next = state.step + 1;
  const complete = next >= questions.length;
  return {
    intent: state.intent,
    answers,
    step: complete ? state.step : next,
    complete,
  };
}

export function previousStep(state: FlowState): FlowState {
  if (!state.intent) return state;
  if (state.complete) return { ...state, complete: false };
  if (state.step === 0) return createFlow();
  const questions = questionsFor(state.intent);
  const previous = questions[state.step - 1];
  const answers = { ...state.answers };
  if (previous) delete answers[previous.id];
  return { ...state, step: state.step - 1, answers, complete: false };
}
