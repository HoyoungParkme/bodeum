const defaultWsBaseUrl =
  typeof window === "undefined"
    ? "ws://localhost:8000/api/v1/ml/ws"
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/v1/ml/ws`;

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || defaultWsBaseUrl,
};
