import { safeProps, type ElementProps } from '../internal/props.js';

export type SparklineProps = ElementProps<'div'> & {
  values: readonly number[];
  label: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
};

/** A compact trend. The caller provides the accessible interpretation of its data. */
export function Sparkline({ values, label, tone = 'neutral', ...props }: SparklineProps) {
  const samples = values.map((value) => (Number.isFinite(value) ? value : 0));
  const minimum = Math.min(0, ...samples);
  const maximum = Math.max(0, ...samples);
  const range = maximum - minimum || 1;
  const points = samples.map(
    (value, index) =>
      [
        samples.length > 1 ? 2 + (index / (samples.length - 1)) * 128 : 66,
        28 - ((value - minimum) / range) * 26,
      ] as const,
  );
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const last = points.at(-1);
  return (
    <div
      {...safeProps(props)}
      className="ns-sparkline"
      data-tone={tone}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 132 30" aria-hidden="true" focusable="false">
        {points.length > 1 ? <polyline points={line} /> : null}
        {last ? <circle cx={last[0]} cy={last[1]} r="2" /> : null}
      </svg>
    </div>
  );
}

export type ProgressProps = Omit<ElementProps<'progress'>, 'value' | 'max' | 'children'> & {
  label: string;
  value?: number;
  max?: number;
};

/** Omit value for indeterminate work. Determinate values are bounded to the valid range. */
export function Progress({ label, value, max = 100, ...props }: ProgressProps) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    value === undefined
      ? undefined
      : Math.min(limit, Math.max(0, Number.isFinite(value) ? value : 0));
  return (
    <progress
      {...safeProps(props)}
      className="ns-progress"
      aria-label={label}
      value={current}
      max={limit}
    />
  );
}
