import { PopoverTrigger, PopoverContent } from '../src/components/popover.js';
import { Autocomplete } from '../src/components/autocomplete.js';
// @ts-expect-error Raw replacement rendering is forbidden.
<PopoverTrigger render={<button />} />;
// @ts-expect-error Popup CSS stays in the library.
<PopoverContent style={{ width: 1000 }} />;
<Autocomplete
  label="Environment"
  value=""
  onValueChange={() => {}}
  suggestions={[]}
  // @ts-expect-error CSS classes cannot enter through input props.
  className="custom"
/>;
