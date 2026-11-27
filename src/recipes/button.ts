import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type ButtonTone = 'neutral' | 'brand' | 'critical';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonWidth = 'auto' | 'fill';

const buttonClasses = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: { solid: '', soft: '', outline: 'bg-background dark:bg-transparent', ghost: '' },
      tone: { neutral: '', brand: '', critical: '' },
      size: {
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        md: 'h-9 gap-1.5 px-3 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        lg: 'h-10 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
      },
      width: { auto: '', fill: 'w-full' },
      iconOnly: { true: 'px-0', false: '' },
      bleed: { true: '', false: '' },
      quietIcon: { true: '', false: '' },
      pressed: { true: '', false: '' },
    },
    compoundVariants: [
      {
        variant: 'solid',
        tone: 'neutral',
        class: 'bg-foreground text-background hover:bg-foreground/85',
      },
      {
        variant: 'solid',
        tone: 'brand',
        class: 'bg-primary text-primary-foreground hover:bg-primary/85',
      },
      {
        variant: 'solid',
        tone: 'critical',
        class: 'bg-destructive text-destructive-foreground hover:bg-destructive/85',
      },
      {
        variant: 'soft',
        tone: 'neutral',
        class:
          'bg-secondary text-secondary-foreground hover:bg-secondary/70 aria-expanded:bg-secondary/70',
      },
      {
        variant: 'soft',
        tone: 'brand',
        class:
          'bg-primary/10 text-primary hover:bg-primary/15 aria-expanded:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/20',
      },
      {
        variant: 'soft',
        tone: 'critical',
        class:
          'bg-destructive/10 text-destructive-on-tint hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30',
      },
      {
        variant: 'outline',
        tone: 'neutral',
        class:
          'border-border hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-input/30',
      },
      {
        variant: 'outline',
        tone: 'brand',
        class: 'border-primary/40 text-primary hover:bg-accent aria-expanded:bg-accent',
      },
      {
        variant: 'outline',
        tone: 'critical',
        class:
          'border-destructive/40 text-destructive-on-tint hover:bg-destructive/10 focus-visible:ring-destructive/20',
      },
      {
        variant: 'ghost',
        tone: 'neutral',
        class:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
      },
      {
        variant: 'ghost',
        tone: 'brand',
        class: 'text-primary hover:bg-accent aria-expanded:bg-accent',
      },
      {
        variant: 'ghost',
        tone: 'critical',
        class: 'text-destructive-on-tint hover:bg-destructive/10 focus-visible:ring-destructive/20',
      },
      { bleed: true, size: 'xs', class: '-mx-2.5' },
      { bleed: true, size: 'sm', class: '-mx-3' },
      { bleed: true, size: 'md', class: '-mx-3' },
      { bleed: true, size: 'lg', class: '-mx-4' },
      { iconOnly: true, size: 'xs', class: 'size-6' },
      { iconOnly: true, size: 'sm', class: 'size-8' },
      { iconOnly: true, size: 'md', class: 'size-9' },
      { iconOnly: true, size: 'lg', class: 'size-10' },
      {
        quietIcon: true,
        variant: 'ghost',
        tone: 'neutral',
        class:
          'text-muted-foreground hover:text-foreground focus-visible:text-foreground aria-expanded:text-foreground',
      },
      {
        pressed: true,
        class:
          'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus-visible:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      tone: 'neutral',
      size: 'md',
      width: 'auto',
      iconOnly: false,
      bleed: false,
      quietIcon: false,
      pressed: false,
    },
  },
);

export function buttonStyles(options: Parameters<typeof buttonClasses>[0]) {
  return cn(buttonClasses(options));
}
