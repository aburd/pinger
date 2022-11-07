import {invoke} from "@tauri-apps/api/tauri";
import {createSignal, For, Show} from "solid-js";
import {createStore} from "solid-js/store";
import {Grid, GridItem, Divider, Heading, Button} from "@hope-ui/solid"
import PingDetails from '../components/PingDetails'
import PingResults from '../components/PingResults'
import {UrlItem, PingResult} from '../types';

function Home() {
  const [pingResults, setPingMsgs] = createStore<PingResult[]>([]);
  const [url, setUrl] = createSignal<number | null>(null);
  const [urls, setUrls] = createStore<UrlItem[]>([]);

  function currentUrl() {
    return urls.find(u => u.id === url());
  }

  async function ping() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const selected = currentUrl();
    if (!selected) return;
    try {
      const ping = await invoke("client_ping", {url: selected?.url})
      setPingMsgs([{text: String(ping), level: "log"}, ...pingResults]);
    } catch (e) {
      setPingMsgs([{text: String(e), level: "error"}, ...pingResults]);
    }
  }

  function handleUrlClick(url: UrlItem) {
    setUrl(url.id);
    setPingMsgs([]);
  }

  function handleAddNewUrlItem() {
    const item = {
      id: urls.length + 1,
      url: "https://",
      intervalMs: 1000,
      timeoutMs: 60000,
    }
    setUrls([
      ...urls,
      item,
    ]);
    setUrl(item.id);
    setPingMsgs([]);
  }

  function updateUrl(id: number, text: string) {
    setUrls(u => u.id == id, "url", text);
  }

  return (
    <Grid
      h="100%"
      class="page"
      templateRows="repeat(10, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap="$4"
    >
      <GridItem rowSpan={1} colSpan={5} bg="papayawhip">
        <Heading>Pinger</Heading>
      </GridItem>
      <GridItem rowSpan={9} colSpan={1} bg="papayawhip">
        <Heading>URLs</Heading>
        <Button onClick={() => handleAddNewUrlItem()}>Add new Url</Button>
        <ul>
          <For each={urls}>
            {(item) => <li onClick={() => handleUrlClick(item)}>{item.url}</li>}
          </For>
        </ul>
      </GridItem>
      <GridItem rowSpan={9} colSpan={4} bg="tomato">
        <Show when={currentUrl()} fallback={<Heading>No URL selected</Heading>}>
          <PingDetails
            url={currentUrl() as UrlItem}
            onSubmitPing={() => ping()}
            onSubmitPingRepeat={() => ping()}
            onUrlChange={updateUrl}
          />
          <Divider />
          <PingResults
            results={pingResults} />
        </Show>
      </GridItem>
    </Grid>
  );
}

export default Home;
