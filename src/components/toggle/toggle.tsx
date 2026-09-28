import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva } from 'class-variance-authority';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type ToggleVariant = 'ghost' | 'outline';
export type ToggleSize = 'sm' | 'md' | 'lg';

const toggleClasses = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-3xl text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        ghost: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-muted',
      },
      size: {
        sm: 'h-8 min-w-8 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        md: 'h-9 min-w-9 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        lg: 'h-10 min-w-10 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export function toggleStyles(options: Parameters<typeof toggleClasses>[0]) {
  return cn(toggleClasses(options));
}

export type ToggleProps = ClosedProps<Omit<TogglePrimitive.Props, 'render'>> & {
  variant?: ToggleVariant;
  size?: ToggleSize;
};

export function Toggle({ variant, size, ...props }: ToggleProps) {
  return (
    <TogglePrimitive data-slot="toggle" className={toggleStyles({ variant, size })} {...props} />
  );
}
