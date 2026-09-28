import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import type { Icon } from '@phosphor-icons/react';

import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxList,
  comboboxItemClasses,
  type ComboboxAlign,
  type ComboboxCollectionProps,
  type ComboboxContentProps,
  type ComboboxEmptyProps,
  type ComboboxGroupProps,
  type ComboboxLabelProps,
  type ComboboxListProps,
  type ComboboxSide,
} from '@/components/combobox/combobox';
import {
  InputGroupAddon,
  InputGroupInput,
  InputGroupPrimitive,
  type InputGroupSize,
} from '@/components/input-group/input-group';
import type { InputFont } from '@/components/input/input';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

type RootProps<ItemValue> = AutocompletePrimitive.Root.Props<ItemValue>;

export type AutocompleteSide = ComboboxSide;
export type AutocompleteAlign = ComboboxAlign;
export type AutocompleteMode = NonNullable<RootProps<unknown>['mode']>;
export type AutocompleteChangeDetails = AutocompletePrimitive.Root.ChangeEventDetails;
export type AutocompleteInputSize = InputGroupSize;
export type AutocompleteInputFont = InputFont;
export type AutocompleteInputWidth = 'auto' | 'fill';

export type AutocompleteProps<ItemValue> = Pick<
  RootProps<ItemValue>,
  | 'children'
  | 'items'
  | 'filteredItems'
  | 'filter'
  | 'mode'
  | 'limit'
  | 'itemToStringValue'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'openOnInputClick'
  | 'autoHighlight'
  | 'submitOnItemClick'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'name'
  | 'form'
  | 'id'
>;

export function Autocomplete<ItemValue>({ items, ...props }: AutocompleteProps<ItemValue>) {
  return (
    <AutocompletePrimitive.Root items={items as readonly ItemValue[] | undefined} {...props} />
  );
}

export type AutocompleteInputProps = ClosedProps<
  Omit<AutocompletePrimitive.Input.Props, 'render' | 'size'>
> & {
  size?: AutocompleteInputSize;
  font?: AutocompleteInputFont;
  width?: AutocompleteInputWidth;
  icon?: Icon;
};

export function AutocompleteInput({
  size = 'md',
  font = 'sans',
  width = 'fill',
  icon: LeadingIcon,
  disabled = false,
  ...props
}: AutocompleteInputProps) {
  return (
    <AutocompletePrimitive.InputGroup
      render={
        <InputGroupPrimitive
          size={size}
          data-disabled={disabled || undefined}
          className={cn(width === 'auto' && 'w-fit')}
        />
      }
    >
      <AutocompletePrimitive.Input
        render={<InputGroupInput font={font} disabled={disabled} />}
        disabled={disabled}
        {...props}
      />
      {LeadingIcon && (
        <InputGroupAddon align="inline-start">
          <LeadingIcon aria-hidden />
        </InputGroupAddon>
      )}
    </AutocompletePrimitive.InputGroup>
  );
}

export type AutocompleteContentProps = Omit<ComboboxContentProps, 'anchor'> & {
  side?: AutocompleteSide;
  align?: AutocompleteAlign;
};

export function AutocompleteContent(props: AutocompleteContentProps) {
  return <ComboboxContent {...props} />;
}

export type AutocompleteListProps = ComboboxListProps;

export function AutocompleteList(props: AutocompleteListProps) {
  return <ComboboxList {...props} />;
}

export type AutocompleteItemProps = ClosedProps<Omit<AutocompletePrimitive.Item.Props, 'render'>>;

export function AutocompleteItem(props: AutocompleteItemProps) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(comboboxItemClasses, 'pr-3')}
      {...props}
    />
  );
}

export type AutocompleteEmptyProps = ComboboxEmptyProps;

export function AutocompleteEmpty(props: AutocompleteEmptyProps) {
  return <ComboboxEmpty {...props} />;
}

export type AutocompleteGroupProps = ComboboxGroupProps;

export function AutocompleteGroup(props: AutocompleteGroupProps) {
  return <ComboboxGroup {...props} />;
}

export type AutocompleteGroupLabelProps = ComboboxLabelProps;

export function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
  return <ComboboxLabel {...props} />;
}

export type AutocompleteCollectionProps = ComboboxCollectionProps;

export function AutocompleteCollection(props: AutocompleteCollectionProps) {
  return <ComboboxCollection {...props} />;
}
