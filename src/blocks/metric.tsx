import { useId, type ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type MetricTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type MetricProps = Omit<ElementProps<'div'>, 'children'> & {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: MetricTone;
};

export function Metric({ label, value, hint, tone = 'neutral', ...props }: MetricProps) {
  const labelId = useId();
  return (
    <div
      {...safeProps(props)}
      className="ns-metric"
      data-tone={tone}
      role="group"
      aria-labelledby={labelId}
    >
      <p id={labelId} className="ns-metric-label">
        {label}
      </p>
      <p className="ns-metric-value">{value}</p>
      {hint ? <p className="ns-metric-hint">{hint}</p> : null}
    </div>
  );
}
