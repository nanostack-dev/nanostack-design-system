import type { ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';
import type { BadgeTone } from './badge.js';

export type StatusMarkerProps = ElementProps<'span'> & {
  tone?: BadgeTone;
  variant?: 'pill' | 'inline' | 'dot';
  activity?: 'steady' | 'active';
  leading?: ReactNode;
};

/** A compact state label. Copy and the meaning of a state belong to the consumer. */
export function StatusMarker({
  tone = 'neutral',
  variant = 'pill',
  activity = 'steady',
  leading,
  children,
  ...props
}: StatusMarkerProps) {
  return (
    <span
      {...safeProps(props)}
      className="ns-status-marker"
      data-tone={tone}
      data-variant={variant}
      data-ns-activity={activity}
    >
      {variant === 'dot' ? <span className="ns-status-dot" aria-hidden="true" /> : leading}
      {children}
    </span>
  );
}

export type TimelineInterval = { start: number; end: number };
export type TimelineItemProps = Omit<ElementProps<'button'>, 'children'> & {
  label: ReactNode;
  detail?: ReactNode;
  annotation?: ReactNode;
  selected?: boolean;
  tone?: BadgeTone;
  /** Percent coordinates on a shared time window. Omit when no interval exists. */
  interval?: TimelineInterval | null;
};
const percent = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0);

/** A selectable time interval; all position values are bounded numeric data. */
export function TimelineItem({
  label,
  detail,
  annotation,
  selected = false,
  tone = 'neutral',
  interval,
  type = 'button',
  ...props
}: TimelineItemProps) {
  const start = interval ? percent(interval.start) : 0;
  const end = interval ? Math.max(start, percent(interval.end)) : start;
  return (
    <button
      {...safeProps(props)}
      type={type}
      className="ns-timeline-item"
      data-tone={tone}
      data-selected={selected}
      aria-current={selected}
    >
      <span className="ns-timeline-heading">
        <span className="ns-timeline-label">{label}</span>
        {annotation ? <span className="ns-timeline-annotation">{annotation}</span> : null}
        {detail ? <span className="ns-timeline-detail">{detail}</span> : null}
      </span>
      <span className="ns-timeline-lane" data-slot="timeline-lane" aria-hidden="true">
        {interval ? (
          <span
            className="ns-timeline-bar"
            data-slot="timeline-bar"
            style={{ left: `${start}%`, width: `${end - start}%` }}
          />
        ) : null}
      </span>
    </button>
  );
}

export type ReportProps = ElementProps<'section'>;
/** A record/report surface whose sticky heading follows its host scrollport. */
export function Report(props: ReportProps) {
  return <section {...safeProps(props)} className="ns-report" />;
}
export type ReportHeaderProps = ElementProps<'header'>;
export function ReportHeader(props: ReportHeaderProps) {
  return <header {...safeProps(props)} className="ns-report-header" />;
}
export type ReportContentProps = ElementProps<'div'>;
export function ReportContent(props: ReportContentProps) {
  return <div {...safeProps(props)} className="ns-report-content" />;
}
