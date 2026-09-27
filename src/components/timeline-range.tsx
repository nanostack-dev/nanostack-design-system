import { safeProps, type ElementProps } from '../internal/props.js';
import type { BadgeTone } from './badge.js';

export type TimelineRangeProps = Omit<ElementProps<'div'>, 'children'> & {
  start: number;
  end: number;
  total: number;
  label: string;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
};

/** Numeric intervals share a time axis; placement remains library-owned. */
export function TimelineRange({
  start,
  end,
  total,
  label,
  tone = 'neutral',
  size = 'md',
  ...props
}: TimelineRangeProps) {
  const duration = Number.isFinite(total) && total > 0 ? total : 1;
  const clamp = (value: number) =>
    Number.isFinite(value) ? Math.max(0, Math.min(duration, value)) : 0;
  const from = clamp(start);
  const to = Math.max(from, clamp(end));
  return (
    <div
      {...safeProps(props)}
      role="img"
      aria-label={label}
      className="ns-timeline-range"
      data-tone={tone}
      data-size={size}
    >
      <span
        aria-hidden="true"
        className="ns-timeline-range-bar"
        style={{ left: `${(from / duration) * 100}%`, width: `${((to - from) / duration) * 100}%` }}
      />
    </div>
  );
}
