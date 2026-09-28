import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { gapClass, type Space } from '@/lib/space';
import { cn } from '@/lib/utils';

export type SpreadDirection = 'horizontal' | 'vertical';
export type SpreadAlignY = 'start' | 'center' | 'end' | 'baseline';

export type SpreadProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  space?: Space;
  direction?: SpreadDirection;
  alignY?: SpreadAlignY;
};

const alignYClass: Record<SpreadAlignY, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

export function Spread({
  space = 'sm',
  direction = 'horizontal',
  alignY = 'center',
  ...props
}: SpreadProps) {
  return (
    <div
      data-slot="spread"
      className={cn(
        'flex min-w-0 justify-between',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        gapClass[space],
        direction === 'horizontal' && alignYClass[alignY],
      )}
      {...props}
    />
  );
}
