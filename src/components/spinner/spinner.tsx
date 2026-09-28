import { SpinnerIcon, type IconProps } from '@phosphor-icons/react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-6',
};

export type SpinnerProps = ClosedProps<
  Omit<IconProps, 'size' | 'weight' | 'mirrored' | 'color' | 'alt'>
> & {
  size?: SpinnerSize;
};

export function Spinner({ size = 'md', ...props }: SpinnerProps) {
  return (
    <SpinnerIcon
      data-slot="spinner"
      data-size={size}
      role="status"
      aria-label="Loading"
      className={cn('shrink-0 animate-spin motion-reduce:animate-none', sizeClass[size])}
      {...props}
    />
  );
}
