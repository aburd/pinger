import {For} from "solid-js";
import {VStack, Box, Heading, Button, Badge, Text} from "@hope-ui/solid"
import {PingItem} from '../types'
import './PingList.css'

interface Props {
  pings: PingItem[];
  onAdd: () => void;
  onClickItem: (ping: PingItem) => void;
}


function PingList(props: Props) {
  const colors = ["tomato", "whitesmoke", "papayawhip"];

  return (
    <div class="PingList">
      <Heading size="xl">URLs</Heading>
      <div class="controls">
        <Button size="xs" onClick={() => props.onAdd()}>Add new Ping</Button>
      </div>
      <VStack spacing="$2">
        <For each={props.pings}>
          {(item, i) => (
            <Box
              class="ping-item"
              onClick={() => props.onClickItem(item)} bg={colors[i() % colors.length]}
            >
              <Badge variant="subtle" colorScheme="primary">{item.name}</Badge>
              <Text size="xs">{item.url}</Text>
            </Box>
          )}
        </For>
      </VStack>
    </div>
  );
}

export default PingList;
