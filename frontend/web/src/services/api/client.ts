import { env } from "@/config/env";
import { applyResponseInterceptors, requestInterceptors } from "./interceptors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiClient<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  };

  for (const interceptor of requestInterceptors) {
    requestInit = interceptor(path, requestInit);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, requestInit);
  const intercepted = await applyResponseInterceptors(response);

  if (!intercepted.ok) {
    throw new Error(`API request failed: ${intercepted.status}`);
  }

  if (intercepted.status === 204) {
    return undefined as T;
  }

  return intercepted.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => apiClient<T>(path, { method: "GET" as HttpMethod }),
  post: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, {
      method: "POST" as HttpMethod,
      body: body == null ? undefined : JSON.stringify(body),
    }),
};
