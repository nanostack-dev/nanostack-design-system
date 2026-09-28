import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type HeadingLevel = 1 | 2 | 3 | 4;

export type HeadingProps = ClosedProps<ComponentPropsWithRef<'h1'>> & {
  level: HeadingLevel;
  truncate?: boolean;
};

const levelClass: Record<HeadingLevel, string> = {
  1: 'text-2xl',
  2: 'text-xl',
  3: 'text-lg',
  4: 'text-base',
};

export function Heading({ level, truncate = false, ...props }: HeadingProps) {
  const Rendered = `h${level}` as const;
  return (
    <Rendered
      data-slot="heading"
      className={cn(
        'font-heading font-semibold tracking-tight text-foreground',
        levelClass[level],
        truncate ? 'min-w-0 truncate' : 'text-balance',
      )}
      {...props}
    />
  );
}
