import {invoke} from "@tauri-apps/api/tauri";
import {PingResult} from '../types'

interface PingResponse {
  status: string,
  text: string,
  url: string,
}

export async function ping(url: string): Promise<PingResult> {
  try {
    let res = await invoke<PingResponse>("client_ping", {url});
    return {
      ...res,
      level: "log",
    }
  } catch (e) {
    return {
      text: (e as Error).toString(),
      url: null, 
      level: "error",
    }
  }
}

