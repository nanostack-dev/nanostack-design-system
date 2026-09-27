'use client';

import {
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { Icon as Glyph } from '@phosphor-icons/react';
import { ArrowBendDownRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowBendDownRight';
import { Icon } from '../components/icon.js';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
import { GraphAnnotationPortal } from '../internal/graph/annotation.js';

export type NodePhase = 'idle' | 'running' | 'success' | 'error' | 'skipped';
export type NodeCheckState = 'pending' | 'passed' | 'failed';
export type NodeSectionProps = ElementProps<'section'> & { label: string; aside?: ReactNode };
export function NodeSection({ label, aside, children, ...props }: NodeSectionProps) {
  return (
    <section {...safeProps(props)} className="ns-node-section">
      <div className="ns-node-section-heading">
        <span>{label}</span>
        {aside != null ? <span className="ns-node-aside">{aside}</span> : null}
      </div>
      {children}
    </section>
  );
}
export type NodeCaptionProps = ElementProps<'span'> & {
  tone?: 'default' | 'muted' | 'danger' | 'success' | 'warning';
  mono?: boolean;
  truncate?: boolean;
};
export function NodeCaption({
  tone = 'muted',
  mono = false,
  truncate = false,
  ...props
}: NodeCaptionProps) {
  return (
    <span
      {...safeProps(props)}
      className="ns-node-caption"
      data-ns-tone={tone}
      data-ns-mono={mono}
      data-ns-truncate={truncate}
    />
  );
}
export type NodeCodeProps = ElementProps<'div'> & {
  lines?: 1 | 2;
  variant?: 'plain' | 'stack';
  active?: boolean;
};
export function NodeCode({
  lines = 2,
  variant = 'plain',
  active = false,
  children,
  ...props
}: NodeCodeProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-node-code"
      data-ns-lines={lines}
      data-ns-variant={variant}
      data-ns-active={active}
    >
      <div className="ns-node-code-content">{children}</div>
    </div>
  );
}
export type NodePlaceholderProps = ElementProps<'div'>;
export function NodePlaceholder(props: NodePlaceholderProps) {
  return <div {...safeProps(props)} className="ns-node-placeholder" />;
}
export type NodeFactsProps = ElementProps<'div'>;
export function NodeFacts(props: NodeFactsProps) {
  return <div {...safeProps(props)} className="ns-node-facts" />;
}
export type NodeFactProps = ElementProps<'span'> & { icon?: ReactNode };
export function NodeFact({ icon, children, ...props }: NodeFactProps) {
  return (
    <span {...safeProps(props)} className="ns-node-fact">
      {icon}
      <span>{children}</span>
    </span>
  );
}
export type NodeStatisticProps = Omit<ElementProps<'div'>, 'children'> & {
  value: ReactNode;
  unit?: ReactNode;
  caption?: ReactNode;
};
export function NodeStatistic({ value, unit, caption, ...props }: NodeStatisticProps) {
  return (
    <div {...safeProps(props)} className="ns-node-statistic">
      <span className="ns-node-statistic-value">
        {value}
        {unit != null ? <span>{unit}</span> : null}
      </span>
      {caption != null ? <NodeCaption>{caption}</NodeCaption> : null}
    </div>
  );
}
export type NodeValueListProps = Omit<ElementProps<'div'>, 'children'> & {
  items: readonly { name: string; value: ReactNode }[];
};
export function NodeValueList({ items, ...props }: NodeValueListProps) {
  return (
    <div {...safeProps(props)}>
      <ul className="ns-node-values">
        {items.slice(0, 4).map((item, index) => (
          <li key={`${item.name}-${index}`}>
            <span translate="no">{item.name}</span>
            <span aria-hidden="true">=</span>
            <span>{item.value}</span>
          </li>
        ))}
      </ul>
      <MoreRows count={items.length - 4} />
    </div>
  );
}
function MoreRows({ count }: { count: number }) {
  return count > 0 ? <div className="ns-node-more">+{count} more</div> : null;
}
const checkLabels = { pending: 'Not run', passed: 'Passed', failed: 'Failed' };
function CheckGlyph({ state }: { state: NodeCheckState }) {
  return (
    <span
      className="ns-node-check"
      data-ns-state={state}
      role="img"
      aria-label={checkLabels[state]}
    >
      <svg viewBox="0 0 14 14" aria-hidden="true">
        <circle className="check-ring" cx="7" cy="7" r="5.75" />
        <circle className="check-disc" cx="7" cy="7" r="7" />
        <path className="check-mark check-tick" d="M4.2 7.2 6.1 9.1 9.9 5.1" pathLength={1} />
        <path
          className="check-mark check-cross"
          d="M4.9 4.9 9.1 9.1M9.1 4.9 4.9 9.1"
          pathLength={1}
        />
      </svg>
    </span>
  );
}
export type NodeChecksProps = Omit<ElementProps<'div'>, 'children'> & {
  items: readonly { label: string; state: NodeCheckState }[];
};
export function NodeChecks({ items, ...props }: NodeChecksProps) {
  return (
    <div {...safeProps(props)}>
      <ul className="ns-node-checks">
        {items.slice(0, 4).map((item, index) => (
          <li
            key={index}
            className="ns-node-check-row"
            data-ns-state={item.state}
            style={{ '--ns-item-index': index } as CSSProperties}
          >
            <CheckGlyph state={item.state} />
            <span translate="no">{item.label}</span>
          </li>
        ))}
      </ul>
      <MoreRows count={items.length - 4} />
    </div>
  );
}
export type NodeRoutesProps = ElementProps<'ol'>;
export function NodeRoutes(props: NodeRoutesProps) {
  return <ol {...safeProps(props)} className="ns-node-routes" />;
}
export type NodeRouteProps = ElementProps<'li'> & {
  state?: 'idle' | 'taken' | 'passed-over';
  target: string;
  variant?: 'condition' | 'fallback';
};
export function NodeRoute({
  state = 'idle',
  target,
  variant = 'condition',
  children,
  ...props
}: NodeRouteProps) {
  return (
    <li
      {...safeProps(props)}
      className="ns-node-case"
      data-ns-state={state}
      data-ns-variant={variant}
    >
      <span aria-hidden="true" className="ns-node-case-port" />
      <div className="ns-node-case-condition" translate="no">
        {children}
      </div>
      <span className="ns-node-case-target">
        <Icon glyph={ArrowBendDownRightIcon} size="xs" weight="bold" />
        <span translate="no">{target}</span>
        {state === 'taken' ? <span className="ns-visually-hidden">(taken)</span> : null}
      </span>
    </li>
  );
}
export type NodeBindingListProps = ElementProps<'dl'>;
export function NodeBindingList(props: NodeBindingListProps) {
  return <dl {...safeProps(props)} className="ns-node-bindings" />;
}
export type NodeBindingProps = NoCustomStyle & {
  label: string;
  names: readonly string[];
  tone?: 'neutral' | 'accent';
  emptyLabel?: string;
};
export function NodeBinding({
  label,
  names,
  tone = 'neutral',
  emptyLabel = 'none',
}: NodeBindingProps) {
  return (
    <>
      <dt>{label}</dt>
      <dd>
        {names.length ? (
          names.map((name, index) => (
            <span key={`${name}-${index}`} data-ns-tone={tone} translate="no">
              {name}
            </span>
          ))
        ) : (
          <NodeCaption>{emptyLabel}</NodeCaption>
        )}
      </dd>
    </>
  );
}
export type NodeMeterProps = Omit<
  ElementProps<'div'>,
  'children' | 'role' | 'aria-label' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'
> & { label: string; tone?: 'accent' | 'error' | 'muted' } & (
    | { mode?: 'value'; value?: number; durationMs?: never; elapsedMs?: never }
    | { mode: 'indeterminate'; value?: never; durationMs?: never; elapsedMs?: never }
    | { mode: 'duration'; durationMs: number; elapsedMs?: number; value?: never }
  );
export function NodeMeter({
  label,
  tone = 'accent',
  mode = 'value',
  value = 0,
  durationMs,
  elapsedMs = 0,
  ...props
}: NodeMeterProps) {
  const duration = Number.isFinite(durationMs) ? Math.max(1, durationMs!) : 1;
  const elapsed = Number.isFinite(elapsedMs) ? Math.max(0, Math.min(duration, elapsedMs)) : 0;
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  const style =
    mode === 'duration'
      ? ({
          '--ns-sweep-ms': `${duration}ms`,
          '--ns-sweep-offset': `${-elapsed}ms`,
          '--ns-sweep-steps': Math.max(1, Math.round(duration / 1000)),
        } as CSSProperties)
      : mode === 'value'
        ? { transform: `scaleX(${clamped})` }
        : undefined;
  return (
    <div
      {...safeProps(props)}
      className="ns-node-meter"
      data-ns-tone={tone}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={mode === 'value' ? Math.round(clamped * 100) : undefined}
    >
      <div
        className="ns-node-meter-fill"
        data-ns-sweep={mode === 'duration' ? '' : undefined}
        data-ns-scan={mode === 'indeterminate' ? '' : undefined}
        style={style}
      />
    </div>
  );
}
export type NodeAttemptsProps = Omit<ElementProps<'div'>, 'children' | 'role' | 'aria-label'> & {
  label: string;
  total: number;
  used?: number;
  outcome?: 'passed' | 'failed';
};
export function NodeAttempts({ label, total, used, outcome, ...props }: NodeAttemptsProps) {
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const completed =
    used === undefined
      ? undefined
      : Number.isFinite(used)
        ? Math.min(count, Math.max(0, Math.floor(used)))
        : 0;
  return (
    <div
      {...safeProps(props)}
      className="ns-node-pips"
      role="img"
      aria-label={
        completed === undefined ? `${label}: none yet` : `${label}: ${completed} of ${count}`
      }
    >
      {Array.from({ length: Math.min(24, count) }, (_, index) => (
        <span
          key={index}
          className="ns-node-pip"
          data-ns-state={
            completed === undefined || index >= completed
              ? 'empty'
              : index === completed - 1 && outcome
                ? outcome
                : 'used'
          }
          style={{ '--ns-item-index': index } as CSSProperties}
        />
      ))}
    </div>
  );
}
export type NodeIconProps = Omit<ElementProps<'span'>, 'children'> & {
  glyph: Glyph;
  motion?: 'steady' | 'turn' | 'tick' | 'listen';
  intervalMs?: number;
};
export function NodeIcon({ glyph, motion = 'steady', intervalMs = 1000, ...props }: NodeIconProps) {
  const interval = Number.isFinite(intervalMs) ? Math.max(700, Math.min(4000, intervalMs)) : 1000;
  return (
    <span
      {...safeProps(props)}
      className="ns-node-kind-chip"
      data-ns-motion={motion}
      style={{ '--ns-poll-interval': `${interval}ms` } as CSSProperties}
    >
      <Icon glyph={glyph} size="sm" weight="duotone" />
    </span>
  );
}
export type NodeStreamActivityProps = Omit<ElementProps<'span'>, 'children' | 'aria-hidden'>;
export function NodeStreamActivity(props: NodeStreamActivityProps) {
  return (
    <span {...safeProps(props)} aria-hidden="true" className="ns-node-stream-bars">
      <span />
      <span />
      <span />
    </span>
  );
}
const phaseLabels: Record<NodePhase, string> = {
  idle: 'Not run',
  running: 'Running',
  success: 'Passed',
  error: 'Failed',
  skipped: 'Skipped',
};
export type NodeRunGlyphProps = Omit<ElementProps<'span'>, 'children' | 'role'> & {
  phase: NodePhase;
};
export function NodeRunGlyph({ phase, ...props }: NodeRunGlyphProps) {
  return (
    <span
      {...safeProps(props)}
      className="ns-node-run-glyph"
      data-ns-phase={phase}
      role="img"
      aria-label={props['aria-label'] ?? phaseLabels[phase]}
    >
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <circle className="glyph-track" cx="9" cy="9" r="7.25" />
        <circle className="glyph-spinner" cx="9" cy="9" r="7.25" pathLength={1} />
        <circle className="glyph-disc" cx="9" cy="9" r="8" />
        <path className="glyph-mark glyph-check" d="M5.4 9.3 7.8 11.6 12.6 6.7" pathLength={1} />
        <path
          className="glyph-mark glyph-cross"
          d="M6.5 6.5 11.5 11.5M11.5 6.5 6.5 11.5"
          pathLength={1}
        />
        <path className="glyph-mark glyph-skip" d="M6 9h6" pathLength={1} />
      </svg>
    </span>
  );
}
export type NodeTelemetryProps = ElementProps<'div'> & { phase: NodePhase };
export function NodeTelemetry({ phase, children, ...props }: NodeTelemetryProps) {
  return (
    <GraphAnnotationPortal>
      <div {...safeProps(props)} className="ns-node-telemetry" data-ns-phase={phase}>
        <div>{children}</div>
      </div>
    </GraphAnnotationPortal>
  );
}
export type NodeElapsedTimeProps = Omit<ElementProps<'span'>, 'children'> & {
  elapsedMs?: number;
  format: (elapsedMs: number) => string;
};
export function NodeElapsedTime({ elapsedMs = 0, format, ref, ...props }: NodeElapsedTimeProps) {
  const element = useRef<HTMLSpanElement>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const tick = useEffectEvent((startedAt: number) => {
    if (element.current) element.current.textContent = format(Date.now() - startedAt);
  });
  useEffect(() => {
    const startedAt = Date.now() - Math.max(0, Number.isFinite(elapsedMs) ? elapsedMs : 0);
    tick(startedAt);
    const timer = window.setInterval(() => tick(startedAt), 100);
    return () => window.clearInterval(timer);
  }, [elapsedMs]);
  return <span {...safeProps(props)} ref={element} className="ns-node-elapsed" />;
}
export type NodeHeadingProps = Omit<ElementProps<'div'>, 'children'> & {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
};
export function NodeHeading({ icon, title, subtitle, actions, ...props }: NodeHeadingProps) {
  return (
    <div {...safeProps(props)} className="ns-node-heading">
      {icon}
      <div>
        <div className="ns-node-heading-title">{title}</div>
        {subtitle != null ? <div className="ns-node-heading-subtitle">{subtitle}</div> : null}
      </div>
      {actions != null ? <div className="ns-node-heading-actions">{actions}</div> : null}
    </div>
  );
}
