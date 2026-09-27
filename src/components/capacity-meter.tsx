'use client';

import type { NoCustomStyle } from '../internal/props.js';

export type CapacitySegment = {
  id: string;
  state: 'free' | 'busy' | 'expiring' | 'expired';
};
export type CapacityMeterProps = NoCustomStyle & {
  segments: readonly CapacitySegment[];
  hiddenCount?: number;
  /** Omit when the enclosing control already announces the capacity. */
  label?: string;
  onSegmentEnter?: (index: number) => void;
  onSegmentLeave?: () => void;
};

/** Compact capacity telemetry. Detail actions belong to the surrounding named control. */
export function CapacityMeter({
  segments,
  hiddenCount = 0,
  label,
  onSegmentEnter,
  onSegmentLeave,
}: CapacityMeterProps) {
  const remaining = Number.isFinite(hiddenCount) ? Math.max(0, Math.floor(hiddenCount)) : 0;
  return (
    <span
      className="ns-capacity-meter"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {segments.map((segment, index) => (
        <span
          key={segment.id}
          className="ns-capacity-segment"
          data-ns-state={segment.state}
          onPointerEnter={() => onSegmentEnter?.(index)}
          onPointerLeave={onSegmentLeave}
        />
      ))}
      {remaining > 0 ? <span className="ns-capacity-more">+{remaining}</span> : null}
    </span>
  );
}
