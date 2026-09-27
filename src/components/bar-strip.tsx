'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
export type BarStripPoint = NoCustomStyle & {
  id: string;
  value: number;
  label: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};
export type BarStripProps = Omit<ElementProps<'div'>, 'children' | 'onSelect'> & {
  label: string;
  points: readonly BarStripPoint[];
  reference?: number;
  selectedId?: string | null;
  selection?: 'actions' | 'single';
  onSelect?: (id: string) => void;
  onPreview?: (id: string | null) => void;
};
/** Numeric values determine bar height; scale, hit targets and colors remain library-owned. */
export function BarStrip({
  label,
  points,
  reference,
  selectedId,
  selection = 'actions',
  onSelect,
  onPreview,
  ...props
}: BarStripProps) {
  const valueOf = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);
  const maximum = Math.max(
    1,
    ...points.map((point) => valueOf(point.value)),
    valueOf(reference ?? 0),
  );
  const plot = (
      <div className="ns-bar-strip-plot">
        {reference !== undefined ? (
          <span
            className="ns-bar-strip-reference"
            aria-hidden="true"
            style={{ bottom: `${(valueOf(reference) / maximum) * 100}%` }}
          />
        ) : null}
        {points.map((point) => {
          const bar = <span
            className="ns-bar-strip-value"
            data-tone={point.tone}
            style={{ height: `${(valueOf(point.value) / maximum) * 100}%` }}
          />;
          const preview = {
            onPointerEnter: () => onPreview?.(point.id),
            onPointerLeave: () => onPreview?.(null),
            onFocus: () => onPreview?.(point.id),
            onBlur: () => onPreview?.(null),
          };
          return selection === 'single' ? (
            <Radio.Root
              key={point.id}
              value={point.id}
              className="ns-bar-strip-point"
              aria-label={point.label}
              title={point.label}
              {...preview}
            >{bar}</Radio.Root>
          ) : <button
            key={point.id}
            type="button"
            className="ns-bar-strip-point"
            aria-label={point.label}
            title={point.label}
            aria-current={point.id === selectedId}
            onClick={() => onSelect?.(point.id)}
            {...preview}
          >
            {bar}
          </button>;
        })}
      </div>
  );
  return selection === 'single' ? (
    <RadioGroup
      {...safeProps(props)}
      className="ns-bar-strip"
      aria-label={label}
      aria-orientation="horizontal"
      value={selectedId ?? null}
      onValueChange={(value) => { if (typeof value === 'string') onSelect?.(value); }}
    >{plot}</RadioGroup>
  ) : (
    <div {...safeProps(props)} className="ns-bar-strip" role="group" aria-label={label}>
      {plot}
    </div>
  );
}
