import type { ComponentPropsWithRef, ElementType } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextTone = 'default' | 'muted' | 'brand' | 'critical' | 'success' | 'warning' | 'info';
export type TextWeight = 'regular' | 'medium' | 'semibold';
export type TextAlign = 'start' | 'center' | 'end';

export type TextProps = ClosedProps<ComponentPropsWithRef<'p'>> & {
  as?: 'p' | 'span' | 'div' | 'label' | 'dt' | 'dd' | 'figcaption';
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  font?: 'sans' | 'mono';
  align?: TextAlign;
  truncate?: boolean;
  tabular?: boolean;
};

const sizeClass: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const toneClass: Record<TextTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  brand: 'text-primary',
  critical: 'text-destructive-on-tint',
  success: 'text-success-on-tint',
  warning: 'text-warning-on-tint',
  info: 'text-info-on-tint',
};

const weightClass: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
};

const alignClass: Record<TextAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

export function Text({
  as = 'p',
  size = 'sm',
  tone = 'default',
  weight = 'regular',
  font = 'sans',
  align = 'start',
  truncate = false,
  tabular = false,
  ...props
}: TextProps) {
  const Rendered = as as ElementType;
  return (
    <Rendered
      data-slot="text"
      className={cn(
        sizeClass[size],
        toneClass[tone],
        weightClass[weight],
        alignClass[align],
        font === 'mono' ? 'font-mono' : 'font-sans',
        truncate && 'min-w-0 truncate',
        tabular && 'tabular-nums',
      )}
      {...props}
    />
  );
}
