import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { XIcon } from '@phosphor-icons/react';
import type { ComponentProps, ReactNode } from 'react';

import { buttonStyles } from '@/components/button/button';
import { InputGroupAddon } from '@/components/input-group';
import { InputGroupButtonPrimitive } from '@/components/input-group/input-group';
import {
  Combobox,
  ComboboxChip as ComboboxChipPrimitive,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

type ComboboxInputPrimitiveProps = ComponentProps<typeof ComboboxInputPrimitive>;

export type ComboboxProps = ComponentProps<typeof Combobox>;
export type ComboboxInputProps = ComboboxInputPrimitiveProps & {
  triggerLabel?: string;
  clearLabel?: string;
};
export type ComboboxContentProps = ComponentProps<typeof ComboboxContent>;
export type ComboboxListProps = ComponentProps<typeof ComboboxList>;
export type ComboboxItemProps = ComponentProps<typeof ComboboxItem>;
export type ComboboxGroupProps = ComponentProps<typeof ComboboxGroup>;
export type ComboboxLabelProps = ComponentProps<typeof ComboboxLabel>;
export type ComboboxCollectionProps = ComponentProps<typeof ComboboxCollection>;
export type ComboboxEmptyProps = ComponentProps<typeof ComboboxEmpty>;
export type ComboboxSeparatorProps = ComponentProps<typeof ComboboxSeparator>;
export type ComboboxChipsProps = ComponentProps<typeof ComboboxChips>;
export type ComboboxChipProps = ComponentProps<typeof ComboboxChipPrimitive> & {
  removeLabel?: string;
};
export type ComboboxChipsInputProps = ComponentProps<typeof ComboboxChipsInput>;
export type ComboboxTriggerProps = ComponentProps<typeof ComboboxTrigger>;
export type ComboboxValueProps = ComponentProps<typeof ComboboxValue>;

export function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  triggerLabel = 'Show options',
  clearLabel = 'Clear',
  ...props
}: ComboboxInputProps) {
  return (
    <ComboboxInputPrimitive
      className={cn('[&>[data-slot=input-group-addon]:empty]:hidden', className)}
      disabled={disabled}
      showTrigger={false}
      showClear={false}
      {...props}
    >
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
              data-slot="input-group-button"
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
              <XIcon className="pointer-events-none" />
            </ComboboxPrimitive.Clear>
          )}
        </InputGroupAddon>
      )}
      {children}
    </ComboboxInputPrimitive>
  );
}

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
    <ComboboxChipPrimitive showRemove={false} {...props}>
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
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxChipPrimitive>
  );
}

export {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
