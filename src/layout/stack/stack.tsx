import type { ComponentPropsWithRef, ElementType } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { gapClass, type Space } from '@/lib/space';
import { cn } from '@/lib/utils';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

export type StackProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  space?: Space;
  align?: StackAlign;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'form' | 'fieldset';
};

const alignClass: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export function Stack({ space = 'md', align = 'stretch', as = 'div', ...props }: StackProps) {
  const Rendered = as as ElementType;
  return (
    <Rendered
      data-slot="stack"
      className={cn('flex min-w-0 flex-col', gapClass[space], alignClass[align])}
      {...props}
    />
  );
}
