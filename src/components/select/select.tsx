import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CaretDownIcon, CaretUpIcon, CheckIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type SelectTriggerVariant = 'soft' | 'ghost';
export type SelectTriggerSize = 'sm' | 'md';
export type SelectTriggerWidth = 'auto' | 'fill';
export type SelectContentSide = NonNullable<SelectPrimitive.Positioner.Props['side']>;
export type SelectContentAlign = NonNullable<SelectPrimitive.Positioner.Props['align']>;

export const Select = SelectPrimitive.Root;

export type SelectProps = ComponentProps<typeof SelectPrimitive.Root>;

export type SelectGroupProps = ClosedProps<Omit<SelectPrimitive.Group.Props, 'render'>>;

export function SelectGroup(props: SelectGroupProps) {
  return (
    <SelectPrimitive.Group data-slot="select-group" className="scroll-my-1.5 p-1.5" {...props} />
  );
}

export type SelectValueProps = ClosedProps<Omit<SelectPrimitive.Value.Props, 'render'>>;

export function SelectValue(props: SelectValueProps) {
  return (
    <SelectPrimitive.Value data-slot="select-value" className="flex flex-1 text-left" {...props} />
  );
}

const selectTriggerClasses = cva(
  "flex items-center justify-between gap-1.5 rounded-3xl border border-transparent px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        soft: 'bg-input/50',
        ghost:
          'bg-transparent hover:bg-input/50 focus-visible:bg-input/50 data-popup-open:bg-input/50',
      },
      size: { sm: 'h-8', md: 'h-9' },
      width: { auto: 'w-fit', fill: 'w-full min-w-0' },
    },
    defaultVariants: { variant: 'soft', size: 'md', width: 'auto' },
  },
);

export function selectTriggerStyles(options: Parameters<typeof selectTriggerClasses>[0]) {
  return cn(selectTriggerClasses(options));
}

export type SelectTriggerProps = ClosedProps<Omit<SelectPrimitive.Trigger.Props, 'render'>> & {
  variant?: SelectTriggerVariant;
  size?: SelectTriggerSize;
  width?: SelectTriggerWidth;
};

export function SelectTrigger({
  variant,
  size = 'md',
  width,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={selectTriggerStyles({ variant, size, width })}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<CaretDownIcon className="pointer-events-none size-4 text-muted-foreground" />}
      />
    </SelectPrimitive.Trigger>
  );
}

export type SelectContentProps = ClosedProps<Omit<SelectPrimitive.Popup.Props, 'render'>> & {
  side?: SelectContentSide;
  align?: SelectContentAlign;
  alignItemWithTrigger?: boolean;
};

export function SelectContent({
  children,
  side = 'bottom',
  align = 'center',
  alignItemWithTrigger = true,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={4}
        align={align}
        alignOffset={0}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className="relative isolate z-50 max-h-(--available-height) w-auto max-w-(--available-width) min-w-[max(var(--anchor-width),9rem)] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export type SelectLabelProps = ClosedProps<Omit<SelectPrimitive.GroupLabel.Props, 'render'>>;

export function SelectLabel(props: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className="px-3 py-2.5 text-xs text-muted-foreground"
      {...props}
    />
  );
}

export type SelectItemProps = ClosedProps<Omit<SelectPrimitive.Item.Props, 'render'>>;

export function SelectItem({ children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className="relative flex w-full cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export type SelectSeparatorProps = ClosedProps<Omit<SelectPrimitive.Separator.Props, 'render'>>;

export function SelectSeparator(props: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className="pointer-events-none -mx-1.5 my-1.5 h-px bg-border"
      {...props}
    />
  );
}

function SelectScrollUpButton() {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className="top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4"
    >
      <CaretUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton() {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className="bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4"
    >
      <CaretDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}
