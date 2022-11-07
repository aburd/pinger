export type UrlItem = {
  id: number;
  name: string;
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

