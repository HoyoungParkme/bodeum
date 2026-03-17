import { http } from "../client";

export function requestPrediction(payload: Record<string, unknown>) {
  return http.post("/ml/predict", payload);
}
