import {createSignal, Show} from "solid-js"
import {Text, Heading, Button, FormControl, FormLabel, Input, FormHelperText} from "@hope-ui/solid"
import {UrlItem} from '../types'

interface Props {
  url: UrlItem;
  onChange: (item: UrlItem) => void;
  onSubmitPing: () => void;
  onSubmitPingRepeat: () => void;
}

function PingDetails(props: Props) {
  const [nowDate, setNowDate] = createSignal(new Date(), { equals: false });
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
          <Text>This will ping until {nowDate().toLocaleTimeString()}</Text>
          <Button type="button" onClick={() => props.onSubmitPingRepeat()}>
            Ping Repeat
          </Button>
        </Show>
      </div>
    </div>
  )
}

export default PingDetails;
