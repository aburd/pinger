import {Show, For, Switch, Match} from "solid-js"
import {Container, Heading, Text, Badge} from "@hope-ui/solid"
import {PingResult} from '../types'
import './PingResults.css'

interface Props {
  results: PingResult[];
}

// <Badge colorScheme="primary">Badge</Badge>
// <Badge colorScheme="accent">Badge</Badge>
// <Badge colorScheme="neutral">Badge</Badge>
// <Badge colorScheme="info">Badge</Badge>
// <Badge colorScheme="warning">Badge</Badge>

function PingResults(props: Props) {
  return (
    <div class="PingResults">
      <Heading>Results</Heading>
      <Container>
        <Show when={props.results.length} fallback={<p>No results.</p>}>
          <ul>
            <For each={props.results}>
              {(item) => (
                <li>
                  <Switch>
                    <Match when={item.level === "log"}>
                      <Text>
                        <Badge colorScheme="success">log</Badge>
                        {item.text}</Text>
                    </Match>
                    <Match when={item.level === "error"}>
                      <Text>
                        <Badge colorScheme="danger">err</Badge>
                        {item.text}</Text>
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
