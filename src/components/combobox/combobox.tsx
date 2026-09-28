import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { CaretDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { useRef, type ReactNode } from 'react';

import { buttonStyles } from '@/components/button/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButtonPrimitive,
  InputGroupInput,
} from '@/components/input-group/input-group';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

type PositionerProps = ComboboxPrimitive.Positioner.Props;

export type ComboboxSide = NonNullable<PositionerProps['side']>;
export type ComboboxAlign = NonNullable<PositionerProps['align']>;

export type ComboboxProps<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
> = ComboboxPrimitive.Root.Props<Value, Multiple, Item>;

export const Combobox = ComboboxPrimitive.Root;

export type ComboboxValueProps = ComboboxPrimitive.Value.Props;

export function ComboboxValue(props: ComboboxValueProps) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

export type ComboboxTriggerProps = ClosedProps<ComboboxPrimitive.Trigger.Props>;

export function ComboboxTrigger({ children, ...props }: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className="[&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      {children}
      <CaretDownIcon aria-hidden className="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  );
}

export type ComboboxInputProps = ClosedProps<Omit<ComboboxPrimitive.Input.Props, 'render'>> & {
  showTrigger?: boolean;
  showClear?: boolean;
  triggerLabel?: string;
  clearLabel?: string;
};

export function ComboboxInput({
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  triggerLabel = 'Show options',
  clearLabel = 'Clear',
  ...props
}: ComboboxInputProps) {
  return (
    <InputGroup>
      <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
      {(showTrigger || showClear) && (
        <InputGroupAddon align="inline-end">
          {showTrigger && (
            <InputGroupButtonPrimitive
              size="xs"
              iconOnly
              variant="ghost"
              render={<ComboboxTrigger />}
              aria-label={triggerLabel}
              tabIndex={-1}
              className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
              disabled={disabled}
            />
          )}
          {showClear && (
            <ComboboxPrimitive.Clear
              data-slot="combobox-clear"
              render={<InputGroupButtonPrimitive variant="ghost" size="xs" iconOnly />}
              aria-label={clearLabel}
              disabled={disabled}
            >
              <XIcon aria-hidden className="pointer-events-none" />
            </ComboboxPrimitive.Clear>
          )}
        </InputGroupAddon>
      )}
      {children}
    </InputGroup>
  );
}

export type ComboboxContentProps = ClosedProps<Omit<ComboboxPrimitive.Popup.Props, 'render'>> & {
  side?: ComboboxSide;
  align?: ComboboxAlign;
  anchor?: PositionerProps['anchor'];
};

export function ComboboxContent({
  side = 'bottom',
  align = 'start',
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={6}
        align={align}
        alignOffset={0}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className="group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1.5 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/50 *:data-[slot=input-group]:shadow-none dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export type ComboboxListProps = ClosedProps<Omit<ComboboxPrimitive.List.Props, 'render'>>;

export function ComboboxList(props: ComboboxListProps) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className="no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 data-empty:p-0"
      {...props}
    />
  );
}

export const comboboxItemClasses =
  "relative flex w-full cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export type ComboboxItemProps = ClosedProps<Omit<ComboboxPrimitive.Item.Props, 'render'>>;

export function ComboboxItem({ children, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item data-slot="combobox-item" className={comboboxItemClasses} {...props}>
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon aria-hidden className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

export type ComboboxGroupProps = ClosedProps<Omit<ComboboxPrimitive.Group.Props, 'render'>>;

export function ComboboxGroup(props: ComboboxGroupProps) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />;
}

export type ComboboxLabelProps = ClosedProps<Omit<ComboboxPrimitive.GroupLabel.Props, 'render'>>;

export function ComboboxLabel(props: ComboboxLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className="px-3 py-2.5 text-xs text-muted-foreground"
      {...props}
    />
  );
}

export type ComboboxCollectionProps = ComboboxPrimitive.Collection.Props;

export function ComboboxCollection(props: ComboboxCollectionProps) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

export type ComboboxEmptyProps = ClosedProps<Omit<ComboboxPrimitive.Empty.Props, 'render'>>;

export function ComboboxEmpty(props: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className="hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex"
      {...props}
    />
  );
}

export type ComboboxSeparatorProps = ClosedProps<Omit<ComboboxPrimitive.Separator.Props, 'render'>>;

export function ComboboxSeparator(props: ComboboxSeparatorProps) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className="-mx-1.5 my-1.5 h-px bg-border"
      {...props}
    />
  );
}

export type ComboboxChipsProps = ClosedProps<Omit<ComboboxPrimitive.Chips.Props, 'render'>>;

export function ComboboxChips(props: ComboboxChipsProps) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-3xl border border-transparent bg-input/50 bg-clip-padding px-3 py-1.5 text-sm transition-[color,box-shadow,background-color] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
      {...props}
    />
  );
}

export type ComboboxChipProps = ClosedProps<Omit<ComboboxPrimitive.Chip.Props, 'render'>> & {
  showRemove?: boolean;
  removeLabel?: string;
};

function defaultRemoveLabel(children: ReactNode) {
  return typeof children === 'string' ? `Remove ${children}` : 'Remove';
}

export function ComboboxChip({
  children,
  showRemove = true,
  removeLabel = defaultRemoveLabel(children),
  ...props
}: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className="flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-3xl bg-input px-2 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0 dark:bg-input/60"
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          className={cn(
            buttonStyles({ variant: 'ghost', size: 'xs', iconOnly: true }),
            '-ml-1 opacity-50 hover:opacity-100',
          )}
          data-slot="combobox-chip-remove"
          aria-label={removeLabel}
        >
          <XIcon aria-hidden className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

export type ComboboxChipsInputProps = ClosedProps<Omit<ComboboxPrimitive.Input.Props, 'render'>>;

export function ComboboxChipsInput(props: ComboboxChipsInputProps) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className="min-w-16 flex-1 outline-none"
      {...props}
    />
  );
}

export function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null);
}
