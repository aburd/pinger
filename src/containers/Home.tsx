import {createEffect, createSignal, For, Show} from "solid-js";
import {createStore} from "solid-js/store";
import {Grid, GridItem, Heading, Button} from "@hope-ui/solid"
import PingDetails from '../components/PingDetails'
import PingResults from '../components/PingResults'
import * as api from '../api'
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

  async function ping() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const selected = currentUrl();
    if (!selected) return;

    const res = await api.ping.ping(selected.url);
    setPingMsgs([res, ...pingResults]);
  }

  function pingRepeat() {
    const selected = currentUrl();
    if (!selected) return;

    setTimeoutMs(selected.timeoutM * 60 * 1000);
    intervalRef = setInterval(() => {
      ping();
      setTimeoutMs(timeoutMs() - selected.intervalMs);
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
    const item = {
      id: urls.length + 1,
      url: "https://",
      intervalMs: 1000,
      timeoutM: 0.1,
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
      <GridItem rowSpan={9} colSpan={1} bg="papayawhip" padding="$2">
        <Heading size="xl">URLs</Heading>
        <Button size="xs" onClick={() => handleAddNewUrlItem()}>Add new Url</Button>
        <ul>
          <For each={urls}>
            {(item) => <li onClick={() => handleUrlClick(item)}>{item.url}</li>}
          </For>
        </ul>
      </GridItem>
      <GridItem rowSpan={9} colSpan={2} bg="tomato" padding="$2">
        <Show when={currentUrl()} fallback={<Heading>No URL selected</Heading>}>
          <PingDetails
            url={currentUrl() as UrlItem}
            onChange={handleUrlChange}
            onSubmitPing={() => ping()}
            onSubmitPingRepeat={() => pingRepeat()}
          />
        </Show>
      </GridItem>
      <GridItem rowSpan={9} colSpan={2} bg="tomato" padding="$2">
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
