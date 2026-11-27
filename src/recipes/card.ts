import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export type CardVariant = 'solid' | 'outline' | 'soft';
export type CardSize = 'sm' | 'md';

const cardClasses = cva(
  'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-4xl py-(--card-spacing) text-sm text-card-foreground has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl',
  {
    variants: {
      variant: {
        solid: 'bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10',
        outline: 'border border-border bg-card',
        soft: 'bg-muted/50',
      },
      size: {
        sm: '[--card-spacing:--spacing(4)]',
        md: '[--card-spacing:--spacing(6)]',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);

export function cardStyles(options: Parameters<typeof cardClasses>[0]) {
  return cn(cardClasses(options));
}

export const cardHeaderClass =
  'group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]';
export const cardContentClass = 'px-(--card-spacing)';
export const cardDescriptionClass = 'text-sm text-muted-foreground';
