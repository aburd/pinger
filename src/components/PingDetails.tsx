import {Show} from "solid-js"
import {Container, Heading, Button, FormControl, Divider, FormLabel, Input, FormHelperText} from "@hope-ui/solid"
import {UrlItem} from '../types'

interface Props {
  url: UrlItem;
  onUrlChange: (id: number, text: string) => void;
  onIntervalChange?: (id: number, timeMs: number) => void;
  onSubmitPing: () => void;
  onSubmitPingRepeat: () => void;
}

function PingDetails(props: Props) {
  return (
    <div class="PingDetails">
      <Heading>Ping a url</Heading>
      <div>
        <FormControl>
          <FormLabel for="url">URL</FormLabel>
          <Input id="url" type="text"
            onChange={(e) => props.onUrlChange(props.url.id, e.currentTarget.value)}
            value={props.url.url}
          />
          <FormHelperText>{"Helper text"}</FormHelperText>
        </FormControl>
        <Button type="button" onClick={() => props.onSubmitPing()}>
          Ping Once
        </Button>

        <Show when={props.onSubmitPingRepeat}>
          <FormControl>
            <FormLabel for="interval">Interval</FormLabel>
            <Input id="interval" type="number"
              onChange={(e) => props.onIntervalChange && props.onIntervalChange(props.url.id, Number(e.currentTarget.value))}
              value={props.url.intervalMs}
            />
            <FormHelperText>{"Time is in milliseconds"}</FormHelperText>
          </FormControl>
          <Button type="button" onClick={() => props.onSubmitPingRepeat()}>
            Ping Repeat
          </Button>
        </Show>
      </div>
      <Divider />
    </div>
  )
}

export default PingDetails;
