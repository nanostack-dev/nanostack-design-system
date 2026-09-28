import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type InputVariant = 'soft' | 'ghost';
export type InputSize = 'sm' | 'md';
export type InputFont = 'sans' | 'mono';

const inputClasses = cva(
  'w-full min-w-0 rounded-3xl border border-transparent px-3 py-1 transition-[color,box-shadow,background-color] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:font-sans file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        soft: 'bg-input/50',
        ghost:
          'bg-transparent hover:bg-input/50 focus-visible:bg-input/50 read-only:hover:bg-transparent',
      },
      size: {
        sm: 'h-8 file:h-6',
        md: 'h-9 file:h-7',
      },
      font: {
        sans: 'font-sans text-base md:text-sm',
        mono: 'font-mono text-base md:text-xs',
      },
    },
    defaultVariants: { variant: 'soft', size: 'md', font: 'sans' },
  },
);

export function inputStyles(options: Parameters<typeof inputClasses>[0]) {
  return cn(inputClasses(options));
}

export type InputProps = ClosedProps<
  Omit<ComponentProps<typeof InputPrimitive>, 'render' | 'size'>
> & {
  variant?: InputVariant;
  size?: InputSize;
  font?: InputFont;
};

export function Input({ variant, size, font, ...props }: InputProps) {
  return (
    <InputPrimitive data-slot="input" className={inputStyles({ variant, size, font })} {...props} />
  );
}
