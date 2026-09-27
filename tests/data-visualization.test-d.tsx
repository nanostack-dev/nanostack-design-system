import { Progress, Sparkline } from '../src/components/data-visualization.js';

<Progress label="Uploads" value={3} max={10} />;
<Progress label="Connecting" />;
<Sparkline values={[1, 2, 4]} label="Traffic is increasing" tone="info" />;
// @ts-expect-error Presentation belongs to the library.
<Progress label="Uploads" style={{ width: 400 }} />;
// @ts-expect-error Consumers cannot replace the visual implementation.
<Sparkline values={[1]} label="Traffic" render={<svg />} />;
// @ts-expect-error Trend interpretation is required for assistive technology.
<Sparkline values={[1]} />;
// @ts-expect-error Internal state is not an appearance API.
<Sparkline values={[1]} label="Traffic" data-tone="warning" />;
