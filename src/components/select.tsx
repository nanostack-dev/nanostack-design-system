'use client';

import { Field as BaseField } from '@base-ui/react/field';
import { safeProps, type ElementProps } from '../internal/props.js';

export type SelectOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;

export type SelectProps = Omit<ElementProps<'select'>, 'size' | 'children'> & {
  options: readonly SelectOption[];
  size?: 'sm' | 'md';
  width?: 'fill' | 'content';
};

/** Native selection preserves browser keyboard behavior; Field supplies its label and errors. */
export function Select({
  options,
  size = 'md',
  width = 'fill',
  id,
  name,
  value,
  defaultValue,
  disabled,
  ...props
}: SelectProps) {
  return (
    <BaseField.Control
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      render={
        <select
          {...safeProps(props)}
          className="ns-input ns-select"
          data-size={size}
          data-ns-width={width}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      }
    />
  );
}
