import { http } from "../client";

export interface LoginPayload {
  email: string;
  password: string;
}

export function login(payload: LoginPayload) {
  return http.post("/auth/login", payload);
}
