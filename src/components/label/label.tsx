import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type LabelSize = 'sm' | 'md';
export type LabelTone = 'default' | 'muted';

const labelClasses = cva(
  'flex items-center gap-2 leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      size: { sm: 'text-xs', md: 'text-sm' },
      tone: { default: '', muted: 'text-muted-foreground' },
    },
    defaultVariants: { size: 'md', tone: 'default' },
  },
);

export function labelStyles(options: Parameters<typeof labelClasses>[0]) {
  return cn(labelClasses(options));
}

export type LabelProps = ClosedProps<ComponentProps<'label'>> & {
  size?: LabelSize;
  tone?: LabelTone;
};

export function Label({ size = 'md', tone = 'default', ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      data-size={size}
      data-tone={tone}
      className={labelStyles({ size, tone })}
      {...props}
    />
  );
}
