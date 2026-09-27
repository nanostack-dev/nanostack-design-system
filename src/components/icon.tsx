import type { Icon as Glyph, IconWeight } from '@phosphor-icons/react';
import { SpinnerGapIcon } from '@phosphor-icons/react/dist/ssr/SpinnerGap';
import { safeProps, type ElementProps } from '../internal/props.js';

export type IconProps = Omit<ElementProps<'span'>, 'children'> & {
  glyph: Glyph;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'inherit' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';
  weight?: IconWeight;
  label?: string;
};

/** The glyph is content. Dimensions, tone and rendering stay in the library. */
export function Icon({
  glyph: Glyph,
  size = 'md',
  tone = 'inherit',
  weight = 'regular',
  label,
  ...props
}: IconProps) {
  return (
    <span
      {...safeProps(props)}
      className="ns-icon"
      data-size={size}
      data-tone={tone}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Glyph weight={weight} aria-hidden="true" />
    </span>
  );
}

export type SpinnerProps = Omit<IconProps, 'glyph' | 'weight'>;
export function Spinner({ label = 'Loading', ...props }: SpinnerProps) {
  return (
    <span className="ns-spinner">
      <Icon {...props} glyph={SpinnerGapIcon} label={label} />
    </span>
  );
}
