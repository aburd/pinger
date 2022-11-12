import {For} from "solid-js";
import {VStack, Box, Heading, Button, Badge, Text} from "@hope-ui/solid"
import {PingItem} from '../types'
import './PingList.css'

interface PingListItemProps {
  onClick: () => void;
  bgColor: string;
  name: string;
  url: string;
}
function PingListItem(props: PingListItemProps) {
  return (
    <Box
      class="ping-item"
      onClick={() => props.onClick()} 
      bg={props.bgColor}
    >
      <Badge variant="subtle" colorScheme="primary">{props.name}</Badge>
      <Text size="xs">{props.url}</Text>
    </Box>
  )
}


interface PingListProps {
  pings: PingItem[];
  onAdd: () => void;
  onClickItem: (ping: PingItem) => void;
}

function PingList(props: PingListProps) {
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
            <PingListItem
              onClick={() => props.onClickItem(item)} 
              bgColor={colors[i() % colors.length]}
              name={item.name}
              url={item.url}
            />
          )}
        </For>
      </VStack>
    </div>
  );
}

export default PingList;
