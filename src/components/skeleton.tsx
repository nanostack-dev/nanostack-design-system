import { safeProps, type ElementProps } from '../internal/props.js';

export type SkeletonProps = Omit<ElementProps<'div'>, 'children'> & {
  shape?: 'text' | 'circle' | 'block';
  size?: 'sm' | 'md' | 'lg';
};

/** Decorative loading placeholder; announce loading once on the containing region. */
export function Skeleton({ shape = 'text', size = 'md', ...props }: SkeletonProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-skeleton"
      data-shape={shape}
      data-size={size}
      aria-hidden="true"
    />
  );
}
