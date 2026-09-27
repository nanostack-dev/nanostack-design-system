import { Report, StatusMarker, TimelineItem } from '../src/components/activity.js';

<TimelineItem label="Build" interval={{ start: 25, end: 75 }} tone="success" />;
<StatusMarker variant="dot" activity="active" tone="warning">
  Reconnecting
</StatusMarker>;
// @ts-expect-error Report shape belongs to the library.
<Report className="override" />;
// @ts-expect-error Time coordinates are numeric data, never consumer CSS.
<TimelineItem label="Build" interval={{ start: '20px', end: 'calc(100% - 4px)' }} />;
// @ts-expect-error Consumers cannot replace the timeline implementation.
<TimelineItem label="Build" style={{ width: 120 }} />;
// @ts-expect-error Status colors use closed semantic tones.
<StatusMarker tone="#00ff00">Done</StatusMarker>;
