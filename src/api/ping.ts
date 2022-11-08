import {invoke} from "@tauri-apps/api/tauri";
import {PingResult, PingItem} from '../types'

interface PingResponse {
  status: string,
  text: string,
  url: string,
}

export async function launchPing(url: string): Promise<PingResult> {
  try {
    let res = await invoke<PingResponse>("ping_client", {url});
    return {
      ...res,
      level: "log",
    }
  } catch (e) {
    return {
      text: (e as Error).toString(),
      level: "error",
    }
  }
}

interface PingCreateResponse {
  id: number,
  name: string,
  url: string,
  interval_ms: number,
  timeout_m: number,
}

export async function createItem(): Promise<PingItem> {
  let res = await invoke<PingCreateResponse>("ping_new", {});
  return {
    id: res.id,
    name: res.name,
    url: res.url,
    intervalMs: res.interval_ms,
    timeoutM: res.timeout_m,
    notifySuccess: false,
  }
}
