export type UrlItem = {
  id: number;
  url: string;
  intervalMs: number;
  timeoutM: number;
}

export interface PingResult {
  status?: string;
  text: string;
  url?: string;
  level: "log" | "error";
}

