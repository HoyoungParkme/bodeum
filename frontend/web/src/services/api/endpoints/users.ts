import { http } from "../client";

export function listUsers() {
  return http.get("/users");
}
