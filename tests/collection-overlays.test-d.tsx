import { PopoverTrigger, PopoverContent } from '../src/components/popover.js';
import { Autocomplete } from '../src/components/autocomplete.js';
import { WorkerAvatar } from '../src/components/worker-avatar.js';
<WorkerAvatar load={0.5} seed="worker-a" size="sm" />;
// @ts-expect-error CSS lengths are never consumer variants.
<WorkerAvatar size="3.5rem" />;
// @ts-expect-error Animation timing stays internal.
<WorkerAvatar phase={0.7} />;
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
