import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import type * as React from 'react';

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
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({ align = 'center', side = 'bottom', ...props }: PopoverContentProps) {
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
          className="z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          {...props}
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
