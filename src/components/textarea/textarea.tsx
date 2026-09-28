import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type TextareaFont = 'sans' | 'mono';

const textareaClasses = cva(
  'flex field-sizing-content min-h-16 w-full resize-none rounded-2xl border border-transparent bg-input/50 px-3 py-3 transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      font: {
        sans: 'font-sans text-base md:text-sm',
        mono: 'font-mono text-base md:text-xs',
      },
    },
    defaultVariants: { font: 'sans' },
  },
);

export function textareaStyles(options: Parameters<typeof textareaClasses>[0]) {
  return cn(textareaClasses(options));
}

export type TextareaProps = ClosedProps<ComponentProps<'textarea'>> & {
  font?: TextareaFont;
};

export function Textarea({ font, ...props }: TextareaProps) {
  return <textarea data-slot="textarea" className={textareaStyles({ font })} {...props} />;
}
