import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

import { headingStyles, type HeadingLevel } from '@/recipes/heading';

export type { HeadingLevel };

export type HeadingProps = ClosedProps<ComponentPropsWithRef<'h1'>> & {
  level: HeadingLevel;
  truncate?: boolean;
};

export function Heading({ level, truncate = false, ...props }: HeadingProps) {
  const Rendered = `h${level}` as const;
  return <Rendered data-slot="heading" className={headingStyles({ level, truncate })} {...props} />;
}
