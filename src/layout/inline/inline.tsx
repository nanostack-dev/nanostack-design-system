import type { ComponentPropsWithRef, ElementType } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { gapClass, type Space } from '@/lib/space';
import { cn } from '@/lib/utils';

export type InlineAlign = 'start' | 'center' | 'end';
export type InlineAlignY = 'start' | 'center' | 'end' | 'baseline';

export type InlineProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  space?: Space;
  align?: InlineAlign;
  alignY?: InlineAlignY;
  wrap?: boolean;
  as?: 'div' | 'ul' | 'ol' | 'nav';
};

const alignClass: Record<InlineAlign, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

const alignYClass: Record<InlineAlignY, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

export function Inline({
  space = 'sm',
  align = 'start',
  alignY = 'center',
  wrap = true,
  as = 'div',
  ...props
}: InlineProps) {
  const Rendered = as as ElementType;
  return (
    <Rendered
      data-slot="inline"
      className={cn(
        'flex min-w-0 flex-row',
        wrap ? 'flex-wrap' : 'flex-nowrap',
        gapClass[space],
        alignClass[align],
        alignYClass[alignY],
      )}
      {...props}
    />
  );
}
