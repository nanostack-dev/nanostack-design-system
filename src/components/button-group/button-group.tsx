import type { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';

import { Separator } from '@/components/ui/separator';
import type { ClosedProps } from '@/lib/closed-props';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export type ButtonGroupProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  orientation?: ButtonGroupOrientation;
};
export type ButtonGroupTextProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type ButtonGroupSeparatorProps = ClosedProps<Omit<SeparatorPrimitive.Props, 'render'>>;

const buttonGroupStyles = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-border has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-border has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-ring has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-4xl [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[>[data-variant=outline]]:[&>input]:border-border has-[>[data-variant=outline]]:[&>input:focus-visible]:border-ring",
  {
    variants: {
      orientation: {
        horizontal:
          '*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-4xl! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0',
        vertical:
          'flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-4xl! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
);

export function ButtonGroup({ orientation = 'horizontal', ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={buttonGroupStyles({ orientation })}
      {...props}
    />
  );
}

export function ButtonGroupText(props: ButtonGroupTextProps) {
  return (
    <div
      data-slot="button-group-text"
      className="flex items-center gap-2 rounded-4xl border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
      {...props}
    />
  );
}

export function ButtonGroupSeparator({
  orientation = 'vertical',
  ...props
}: ButtonGroupSeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className="relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto"
      {...props}
    />
  );
}
