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

export interface ChatRequestPayload {
  scores: BigFiveScoresPayload;
  messages: ChatMessagePayload[];
  turnCount: number;
}

export interface ChatResponsePayload {
  reply: string;
  summary: string;
  model: string;
}

export function requestCoachChat(payload: ChatRequestPayload) {
  return http.post<ChatResponsePayload>("/ml/chat", {
    scores: payload.scores,
    messages: payload.messages,
    turn_count: payload.turnCount,
  });
}
