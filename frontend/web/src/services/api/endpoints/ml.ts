import { http } from "../client";

export function requestPrediction(payload: Record<string, unknown>) {
  return http.post("/ml/predict", payload);
}

export interface BigFiveScoresPayload {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface ChatMessagePayload {
  role: "user" | "coach";
  text: string;
}

export interface ChatOpenResponsePayload {
  reply: string;
  model: string;
}

export interface ReportInsightPayload {
  strength: string;
  challenge: string;
  tip: string;
}

export interface ChatRequestPayload {
  scores: BigFiveScoresPayload;
  messages: ChatMessagePayload[];
  turnCount: number;
}

export interface ChatResponsePayload {
  reply: string;
  summary: string;
  model: string;
  report_insight: ReportInsightPayload | null;
}

export function requestChatOpen(scores: BigFiveScoresPayload) {
  return http.post<ChatOpenResponsePayload>("/ml/chat/open", { scores });
}

export function requestCoachChat(payload: ChatRequestPayload) {
  return http.post<ChatResponsePayload>("/ml/chat", {
    scores: payload.scores,
    messages: payload.messages,
    turn_count: payload.turnCount,
  });
}
