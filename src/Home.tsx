import { createSignal } from "solid-js";
import { Grid, GridItem } from "@hope-ui/solid"
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [pingMsg, setPingMsg] = createSignal("");
  const [url, setUrl] = createSignal("");

  async function ping() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setPingMsg(await invoke("client_ping", { url: url() }));
  }

  return (
    <div class="container">
      <h1>Welcome to Tauri!</h1>

      <p>Ping a url</p>

      <div class="row">
        <div>
          <input
            id="ping-input"
            onChange={(e) => setUrl(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => ping()}>
            Ping
          </button>
        </div>
      </div>

      <p>{pingMsg}</p>
    </div>
  );
}

export default App;
