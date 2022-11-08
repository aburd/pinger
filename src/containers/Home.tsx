import {createEffect, createSignal, Show} from "solid-js";
import {createStore} from "solid-js/store";
import {Grid, GridItem, Heading} from "@hope-ui/solid"
import PingDetails from '../components/PingDetails'
import PingResults from '../components/PingResults'
import PingList from '../components/PingList'
import * as api from '../api'
import * as notifications from '../notifications'
import {PingItem, PingResult} from '../types';

let intervalRef: NodeJS.Timer | null = null;

function Home() {
  const [pingResults, setPingMsgs] = createStore<PingResult[]>([]);
  const [timeoutMs, setTimeoutMs] = createSignal<number>(0);
  const [ping, setPingItem] = createSignal<number | null>(null);
  const [pings, setPingItems] = createStore<PingItem[]>([]);

  function currentPing() {
    return pings.find(u => u.id === ping());
  }

  async function clientPing(): Promise<PingResult | null> {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const selected = currentPing();
    if (!selected) return null;

    const res = await api.ping.launchPing(selected.url);
    setPingMsgs([res, ...pingResults]);
    return res;
  }

  function pingRepeat() {
    const selected = currentPing();
    if (!selected) return;
    let notify = selected.notifySuccess;

    setTimeoutMs(selected.timeoutM * 60 * 1000);
    intervalRef = setInterval(async () => {
      setTimeoutMs(timeoutMs() - selected.intervalMs);
      const res = await clientPing();
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

  function handlePingClick(ping: PingItem) {
    setPingItem(ping.id);
    setPingMsgs([]);
  }

  async function handleAddNewPingItem() {
    const item = await api.ping.createItem();
    setPingItems([
      ...pings,
      item,
    ]);
    setPingItem(item.id);
    setPingMsgs([]);
  }

  function handlePingChange(ping: PingItem) {
    setPingItems(u => u.id == ping.id, ping);
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
          pings={pings}
          onAdd={handleAddNewPingItem}
          onClickItem={(ping) => handlePingClick(ping)}
        />
      </GridItem>
      <GridItem rowSpan={9} colSpan={2} bg="papayawhip" padding="$2">
        <Show when={currentPing()} fallback={<Heading>No URL selected</Heading>}>
          <PingDetails
            url={currentPing() as PingItem}
            onChange={handlePingChange}
            onSubmitPing={() => ping()}
            onSubmitPingRepeat={() => pingRepeat()}
          />
        </Show>
      </GridItem>
      <GridItem rowSpan={9} colSpan={2} bg="papayawhip" padding="$2">
        <Show when={currentPing()}>
          <PingResults
            results={pingResults}
          />
        </Show>
      </GridItem>
    </Grid>
  );
}

export default Home;
