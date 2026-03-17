import { env } from "@/config/env";

export function createMlSocket(path = ""): WebSocket {
  const url = `${env.wsBaseUrl}${path}`;
  return new WebSocket(url);
}
