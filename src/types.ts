export type UrlItem = {
  id: number;
  url: string;
  intervalMs: number;
  timeoutMs: number;
}

export interface PingResult {
  text: string;
  level: "log" | "error";
}
