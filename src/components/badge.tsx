import { safeProps, type ElementProps } from '../internal/props.js';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeProps = ElementProps<'span'> & { tone?: BadgeTone };

export function Badge({ tone = 'neutral', ...props }: BadgeProps) {
  return <span {...safeProps(props)} className="ns-badge" data-tone={tone} />;
}
