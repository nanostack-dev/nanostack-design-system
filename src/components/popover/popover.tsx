import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import type * as React from 'react';

import { useMotionAttributes, useMotionInput } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';

export type PopoverSide = NonNullable<PopoverPrimitive.Positioner.Props['side']>;
export type PopoverAlign = NonNullable<PopoverPrimitive.Positioner.Props['align']>;

export type PopoverProps = PopoverPrimitive.Root.Props;
export type PopoverTriggerProps = ClosedProps<PopoverPrimitive.Trigger.Props>;
export type PopoverContentProps = ClosedProps<Omit<PopoverPrimitive.Popup.Props, 'render'>> & {
  side?: PopoverSide;
  align?: PopoverAlign;
};
export type PopoverHeaderProps = ClosedProps<React.ComponentProps<'div'>>;
export type PopoverTitleProps = ClosedProps<Omit<PopoverPrimitive.Title.Props, 'render'>>;
export type PopoverDescriptionProps = ClosedProps<
  Omit<PopoverPrimitive.Description.Props, 'render'>
>;

function Popover({ ...props }: PopoverProps) {
  useMotionInput();
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({ align = 'center', side = 'bottom', ...props }: PopoverContentProps) {
  const motion = useMotionAttributes();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={0}
        side={side}
        sideOffset={4}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className="z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden dark:ring-foreground/10"
          {...props}
          {...motion}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ ...props }: PopoverHeaderProps) {
  return <div data-slot="popover-header" className="flex flex-col gap-1 text-sm" {...props} />;
}

function PopoverTitle({ ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className="text-base font-medium"
      {...props}
    />
  );
}

function PopoverDescription({ ...props }: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className="text-muted-foreground"
      {...props}
    />
  );
}

export { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
