'use client';

import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
export type BarStripPoint = NoCustomStyle & {
  id: string;
  value: number;
  label: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
};
export type BarStripProps = Omit<ElementProps<'div'>, 'children' | 'onSelect'> & {
  label: string;
  points: readonly BarStripPoint[];
  reference?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};
/** Numeric values determine bar height; scale, hit targets and colors remain library-owned. */
export function BarStrip({
  label,
  points,
  reference,
  selectedId,
  onSelect,
  ...props
}: BarStripProps) {
  const valueOf = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
  const maximum = Math.max(
    1,
    ...points.map((point) => valueOf(point.value)),
    valueOf(reference ?? 0),
  );
  return (
    <div {...safeProps(props)} className="ns-bar-strip" role="group" aria-label={label}>
      <div className="ns-bar-strip-plot">
        {reference !== undefined ? (
          <span
            className="ns-bar-strip-reference"
            aria-hidden="true"
            style={{ bottom: `${(valueOf(reference) / maximum) * 100}%` }}
          />
        ) : null}
        {points.map((point) => (
          <button
            key={point.id}
            type="button"
            className="ns-bar-strip-point"
            aria-label={point.label}
            title={point.label}
            aria-current={point.id === selectedId}
            onClick={() => onSelect?.(point.id)}
          >
            <span
              className="ns-bar-strip-value"
              data-tone={point.tone}
              style={{ height: `${(valueOf(point.value) / maximum) * 100}%` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
