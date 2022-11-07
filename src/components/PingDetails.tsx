import {Show} from "solid-js"
import {Container, Heading, Button, FormControl, Divider, FormLabel, Input, FormHelperText} from "@hope-ui/solid"
import {UrlItem} from '../types'

interface Props {
  url: UrlItem;
  onChange: (item: UrlItem) => void;
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
            onChange={(e) => props.onChange({...props.url, url: e.currentTarget.value})}
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
              onChange={(e) => props.onChange({...props.url, intervalMs: Number(e.currentTarget.value)})} 
              value={props.url.intervalMs}
            />
            <FormHelperText>{"In milliseconds"}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel for="timeout">Timeout</FormLabel>
            <Input id="timeout" type="number"
              onChange={(e) => props.onChange({...props.url, timeoutMs: Number(e.currentTarget.value)})} 
              value={props.url.timeoutMs}
            />
            <FormHelperText>{"In milliseconds"}</FormHelperText>
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
