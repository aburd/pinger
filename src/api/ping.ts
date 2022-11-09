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

interface PingItemBE {
  id: number,
  name: string,
  url: string,
  interval_ms: number,
  timeout_m: number,
}

function translateItem(s: PingItemBE): PingItem {
  return {
    id: s.id,
    name: s.name,
    url: s.url,
    intervalMs: s.interval_ms,
    timeoutM: s.timeout_m,
    notifySuccess: false,
  }
}

export async function createItem(): Promise<PingItem> {
  const res = await invoke<PingItemBE>("ping_new", {});
  return translateItem(res);
}

export async function getItmes(): Promise<PingItem[]> {
  const res = await invoke<PingItemBE[]>("ping_get_all", {});
  return res.map((i) => translateItem(i));
}

export async function updateItem(item: PingItem): Promise<void> {
  const itemBE: PingItemBE = {
    id: item.id,
    name: item.name,
    url: item.url,
    interval_ms: item.intervalMs,
    timeout_m: item.timeoutM,
    // notifySuccess: false,
  };
  return invoke("ping_update", {ping: itemBE});
}
