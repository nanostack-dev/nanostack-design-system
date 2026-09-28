import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type MarkerDivider = 'none' | 'sides' | 'below';

const markerClasses = cva(
  'group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground',
  {
    variants: {
      divider: {
        none: '',
        sides:
          'before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border',
        below: 'border-b border-border pb-2',
      },
    },
    defaultVariants: { divider: 'none' },
  },
);

export type MarkerProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  divider?: MarkerDivider;
  icon?: Icon;
};
export type MarkerContentProps = ClosedProps<ComponentPropsWithRef<'span'>>;

export function Marker({ divider = 'none', icon: IconComponent, children, ...props }: MarkerProps) {
  return (
    <div
      data-slot="marker"
      data-divider={divider}
      className={markerClasses({ divider })}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden data-slot="marker-icon" /> : null}
      {children}
    </div>
  );
}

export function MarkerContent(props: MarkerContentProps) {
  return (
    <span
      data-slot="marker-content"
      className="min-w-0 wrap-break-word group-data-[divider=sides]/marker:flex-none group-data-[divider=sides]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground"
      {...props}
    />
  );
}
