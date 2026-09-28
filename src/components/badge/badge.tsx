import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'solid' | 'soft' | 'outline';
export type BadgeTone = 'neutral' | 'brand' | 'critical' | 'success' | 'warning' | 'info';
export type BadgeSize = 'md' | 'lg';

const badgeClasses = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: { solid: '', soft: '', outline: 'bg-transparent' },
      tone: { neutral: '', brand: '', critical: '', success: '', warning: '', info: '' },
      size: {
        md: 'h-5 gap-1 px-2 py-0.5 text-xs has-data-[icon=inline-start]:pl-1.5',
        lg: 'h-6 gap-1.5 px-2.5 py-1 text-xs has-data-[icon=inline-start]:pl-2',
      },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'neutral', class: 'bg-foreground text-background' },
      { variant: 'solid', tone: 'brand', class: 'bg-primary text-primary-foreground' },
      {
        variant: 'solid',
        tone: 'critical',
        class: 'bg-destructive text-destructive-foreground',
      },
      { variant: 'solid', tone: 'success', class: 'bg-success text-success-foreground' },
      { variant: 'solid', tone: 'warning', class: 'bg-warning text-warning-foreground' },
      { variant: 'solid', tone: 'info', class: 'bg-info text-info-foreground' },
      { variant: 'soft', tone: 'neutral', class: 'bg-secondary text-secondary-foreground' },
      { variant: 'soft', tone: 'brand', class: 'bg-primary/10 text-primary dark:bg-primary/15' },
      {
        variant: 'soft',
        tone: 'critical',
        class: 'bg-destructive/10 text-destructive-on-tint dark:bg-destructive/15',
      },
      {
        variant: 'soft',
        tone: 'success',
        class: 'bg-success/10 text-success-on-tint dark:bg-success/15',
      },
      {
        variant: 'soft',
        tone: 'warning',
        class: 'bg-warning/10 text-warning-on-tint dark:bg-warning/15',
      },
      { variant: 'soft', tone: 'info', class: 'bg-info/10 text-info-on-tint dark:bg-info/15' },
      { variant: 'outline', tone: 'neutral', class: 'border-border text-foreground' },
      { variant: 'outline', tone: 'brand', class: 'border-primary/40 text-primary' },
      {
        variant: 'outline',
        tone: 'critical',
        class: 'border-destructive/40 text-destructive-on-tint',
      },
      { variant: 'outline', tone: 'success', class: 'border-success/40 text-success-on-tint' },
      { variant: 'outline', tone: 'warning', class: 'border-warning/40 text-warning-on-tint' },
      { variant: 'outline', tone: 'info', class: 'border-info/40 text-info-on-tint' },
    ],
    defaultVariants: { variant: 'soft', tone: 'neutral', size: 'md' },
  },
);

export type BadgeProps = ClosedProps<ComponentPropsWithRef<'span'>> & {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: Icon;
};

export function Badge({
  variant,
  tone,
  size,
  icon: IconComponent,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? 'soft'}
      data-tone={tone ?? 'neutral'}
      className={cn(badgeClasses({ variant, tone, size }))}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden data-icon="inline-start" /> : null}
      {children}
    </span>
  );
}
