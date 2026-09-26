'use client';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Theme, useThemeSettings } from '../theme.js';
import { safeProps, type ElementProps } from '../internal/props.js';

export type AutocompleteProps = Omit<
  ElementProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'children'
> & {
  value: string;
  onValueChange: (value: string) => void;
  suggestions: readonly string[];
  label: string;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
};

/** A free-text value with keyboard-selectable suggestions. */
export function Autocomplete({
  value,
  onValueChange,
  suggestions,
  label,
  loading = false,
  loadingMessage = 'Loading…',
  emptyMessage = 'No suggestions',
  disabled = false,
  ...props
}: AutocompleteProps) {
  const theme = useThemeSettings();
  return (
    <BaseAutocomplete.Root
      items={suggestions}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      autoHighlight
      openOnInputClick
    >
      <BaseAutocomplete.Input {...safeProps(props)} aria-label={label} className="ns-input" />
      <BaseAutocomplete.Portal>
        <Theme {...theme}>
          <BaseAutocomplete.Positioner sideOffset={4} className="ns-autocomplete-positioner">
            <BaseAutocomplete.Popup className="ns-autocomplete-content">
              <BaseAutocomplete.Empty className="ns-autocomplete-empty">
                {loading ? loadingMessage : emptyMessage}
              </BaseAutocomplete.Empty>
              <BaseAutocomplete.List className="ns-autocomplete-list">
                {(item: string) => (
                  <BaseAutocomplete.Item key={item} value={item} className="ns-autocomplete-item">
                    {item}
                  </BaseAutocomplete.Item>
                )}
              </BaseAutocomplete.List>
            </BaseAutocomplete.Popup>
          </BaseAutocomplete.Positioner>
        </Theme>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
}
