import {createEffect, createSignal, Show} from "solid-js";
import {createStore} from "solid-js/store";
import {Grid, GridItem, Heading} from "@hope-ui/solid"
import PingDetails from '../components/PingDetails'
import PingResults from '../components/PingResults'
import PingList from '../components/PingList'
import * as api from '../api'
import * as notifications from '../notifications'
import {UrlItem, PingResult} from '../types';

let intervalRef: NodeJS.Timer | null = null;

function Home() {
  const [pingResults, setPingMsgs] = createStore<PingResult[]>([]);
  const [timeoutMs, setTimeoutMs] = createSignal<number>(0);
  const [url, setUrl] = createSignal<number | null>(null);
  const [urls, setUrls] = createStore<UrlItem[]>([]);

  function currentUrl() {
    return urls.find(u => u.id === url());
  }

  async function ping(): Promise<PingResult | null> {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const selected = currentUrl();
    if (!selected) return null;

    const res = await api.ping.ping(selected.url);
    setPingMsgs([res, ...pingResults]);
    return res;
  }

  function pingRepeat() {
    const selected = currentUrl();
    if (!selected) return;
    let notify = selected.notifySuccess;

    setTimeoutMs(selected.timeoutM * 60 * 1000);
    intervalRef = setInterval(async () => {
      setTimeoutMs(timeoutMs() - selected.intervalMs);
      const res = await ping();
      if (res?.level === "log" && notify) {
        notifications.notify("Ping Successful", `Status: ${res.status}\nURL: ${res.url}`)
        notify = false;
      }
    }, selected.intervalMs);
  }

  createEffect(() => {
    if (timeoutMs() <= 0 && intervalRef) {
      clearInterval(intervalRef);
    }
  });

  function handleUrlClick(url: UrlItem) {
    setUrl(url.id);
    setPingMsgs([]);
  }

  function handleAddNewUrlItem() {
    const id = urls.length + 1;
    const item = {
      id,
      name: id.toString(),
      url: "https://",
      intervalMs: 1000,
      timeoutM: 0.1,
      notifySuccess: false,
    }
    setUrls([
      ...urls,
      item,
    ]);
    setUrl(item.id);
    setPingMsgs([]);
  }

  function handleUrlChange(url: UrlItem) {
    setUrls(u => u.id == url.id, url);
  }

  return (
    <Grid
      h="100%"
      class="page"
      templateRows="repeat(10, 1fr)"
      templateColumns="repeat(5, 1fr)"
    >
      <GridItem rowSpan={1} colSpan={5} bg="whitesmoke" padding="$2">
        <Heading size="6xl">Pinger</Heading>
      </GridItem>
      <GridItem rowSpan={9} colSpan={1} bg="tomato" padding="$2">
        <PingList 
          pings={urls}
          onAdd={handleAddNewUrlItem}
          onClickItem={(ping) => handleUrlClick(ping)}
        />
      </GridItem>
      <GridItem rowSpan={9} colSpan={2} bg="papayawhip" padding="$2">
        <Show when={currentUrl()} fallback={<Heading>No URL selected</Heading>}>
          <PingDetails
            url={currentUrl() as UrlItem}
            onChange={handleUrlChange}
            onSubmitPing={() => ping()}
            onSubmitPingRepeat={() => pingRepeat()}
          />
        </Show>
      </GridItem>
      <GridItem rowSpan={9} colSpan={2} bg="papayawhip" padding="$2">
        <Show when={currentUrl()}>
          <PingResults
            results={pingResults}
          />
        </Show>
      </GridItem>
    </Grid>
  );
}

export default Home;
