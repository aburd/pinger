import {createSignal, Show, For, Switch, Match} from "solid-js"
import {Container, Heading, Text, Badge} from "@hope-ui/solid"
import {PingResult} from '../types'
import './PingResults.css'

interface Props {
  results: PingResult[];
}

function PingResults(props: Props) {
  const [openItems, setOpenItems] = createSignal<number[]>([]);

  function addOpenItem(i: number) {
    setOpenItems([...openItems(), i]);
  }
  function removeOpenItem(i: number) {
    setOpenItems((openItems) => openItems.filter((n) => n !== i));
  }
  function handleLogClick(i: number) {
    if (openLog(i)) {
      removeOpenItem(i);
      return;
    }
    addOpenItem(i);
  }
  function openLog(i: number) {
    return openItems().find(item => item === i) !== undefined;
  }

  return (
    <div class="PingResults">
      <Heading>Results</Heading>
      <Container>
        <Show when={props.results.length} fallback={<p>No results.</p>}>
          <ul>
            <For each={props.results}>
              {(item, i) => (
                <li onclick={() => handleLogClick(i())}>
                  <Switch>
                    <Match when={item.level === "log"}>
                      <Badge colorScheme="success">log</Badge>
                      <Show when={!!item.status}>
                        <Badge colorScheme="info">{item.status}</Badge>
                      </Show>
                      <Text noOfLines={openLog(i()) ? Infinity : 2}>
                        {item.text}
                      </Text>
                    </Match>
                    <Match when={item.level === "error"}>
                      <Badge colorScheme="danger">err</Badge>
                      <Text>
                        {item.text}
                      </Text>
                    </Match>
                  </Switch>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </Container>
    </div>
  )
}

export default PingResults;
