export type UrlItem = {
  id: number;
  name: string;
  url: string;
  intervalMs: number;
  timeoutM: number;
  notifySuccess: boolean;
}

export interface PingResult {
  status?: string;
  text: string;
  url?: string;
  level: "log" | "error";
}

