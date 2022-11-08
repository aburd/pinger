import {createSignal, Show} from "solid-js"
import {Checkbox, Text, Heading, Button, FormControl, FormLabel, Input, FormHelperText} from "@hope-ui/solid"
import {PingItem} from '../types'

interface Props {
  url: PingItem;
  onChange: (item: PingItem) => void;
  onSubmitPing: () => void;
  onSubmitPingRepeat: () => void;
}

function PingDetails(props: Props) {
  const [nowDate, setNowDate] = createSignal(new Date(), {equals: false});
  function addDate(deltaMs: number) {
    const now = new Date();
    return new Date(now.valueOf() + deltaMs);
  }
  setInterval(() => {
    const delta = props.url.timeoutM * 60 * 1000;
    setNowDate(addDate(delta));
  }, 1000);
  return (
    <div class="PingDetails">
      <Heading size="xl">Ping a url</Heading>
      <div>
        <FormControl>
          <FormLabel for="name">Name</FormLabel>
          <Input id="name" type="text"
            onChange={(e) => props.onChange({...props.url, name: e.currentTarget.value})}
            value={props.url.name}
          />
          <FormHelperText>{"A name for this ping"}</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel for="url">URL</FormLabel>
          <Input id="url" type="text"
            onChange={(e) => props.onChange({...props.url, url: e.currentTarget.value})}
            value={props.url.url}
          />
        </FormControl>
        <Button type="button" onClick={() => props.onSubmitPing()}>
          Ping Once
        </Button>

        <Show when={props.onSubmitPingRepeat}>
          <FormControl>
            <FormLabel for="interval">Interval</FormLabel>
            <Input id="interval" type="number"
              onChange={(e) => props.onChange({...props.url, intervalMs: Number(e.currentTarget.value)})}
              value={props.url.intervalMs}
            />
            <FormHelperText>{"How often to ping for in ms"}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel for="timeout">Timeout</FormLabel>
            <Input id="timeout" type="number"
              onChange={(e) => props.onChange({...props.url, timeoutM: Number(e.currentTarget.value)})}
              value={props.url.timeoutM}
            />
            <FormHelperText>{"How long to ping for in minutes"}</FormHelperText>
          </FormControl>
          <FormControl>
            <Checkbox
              id="notifySuccess"
              onchange={() => props.onChange({...props.url, notifySuccess: !props.url.notifySuccess})}
              checked={props.url.notifySuccess}
            />
            <FormLabel for="notifySuccess">Notify</FormLabel><br />
            <FormHelperText>{"When checked, successful ping will broadcast a notification"}</FormHelperText>
          </FormControl>
          <Text>Will ping until {nowDate().toLocaleTimeString()}</Text>
          <Button type="button" onClick={() => props.onSubmitPingRepeat()}>
            Ping Repeat
          </Button>
        </Show>
      </div>
    </div>
  )
}

export default PingDetails;
