import { CapacityMeter } from '../src/components/capacity-meter.js';
import { WorkerAvatar } from '../src/components/worker-avatar.js';
import { ResourceTile } from '../src/blocks/resource-tile.js';

<WorkerAvatar variant="pebble" size="sm" staling />;
<CapacityMeter segments={[{ id: 'slot', state: 'expired' }]} />;
// @ts-expect-error Sizes are variations, never arbitrary CSS.
<WorkerAvatar variant="pebble" size="45px" />;
// @ts-expect-error No visual override on telemetry.
<CapacityMeter segments={[]} className="custom" />;
// @ts-expect-error No visual override on tile assemblies.
<ResourceTile style={{ width: 400 }}>Worker</ResourceTile>;
// @ts-expect-error Segment states are a closed semantic vocabulary.
<CapacityMeter segments={[{ id: 'slot', state: 'purple' }]} />;
