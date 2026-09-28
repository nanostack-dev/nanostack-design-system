import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type SkeletonHeight = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fill';
export type SkeletonWidth = 'fill' | '3/4' | '1/2' | '1/4';

const heightClass: Record<SkeletonHeight, string> = {
  xs: 'h-3 rounded-full',
  sm: 'h-4 rounded-full',
  md: 'h-6 rounded-lg',
  lg: 'h-10 rounded-xl',
  xl: 'h-24 rounded-2xl',
  xxl: 'h-64 rounded-2xl',
  fill: 'h-full min-h-24 rounded-2xl',
};

const widthClass: Record<SkeletonWidth, string> = {
  fill: 'w-full',
  '3/4': 'w-3/4',
  '1/2': 'w-1/2',
  '1/4': 'w-1/4',
};

export type SkeletonProps = ClosedProps<Omit<ComponentPropsWithRef<'div'>, 'children'>> & {
  height?: SkeletonHeight;
  width?: SkeletonWidth;
};

export function Skeleton({ height = 'sm', width = 'fill', ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-height={height}
      data-width={width}
      aria-hidden
      className={cn(
        'shrink-0 animate-pulse bg-muted motion-reduce:animate-none',
        heightClass[height],
        widthClass[width],
      )}
      {...props}
    />
  );
}
