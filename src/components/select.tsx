'use client';

import { safeProps, type ElementProps } from '../internal/props.js';

export type SelectOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;

export type SelectProps = Omit<ElementProps<'select'>, 'size' | 'children'> & {
  options: readonly SelectOption[];
  size?: 'sm' | 'md';
};

/** Native selection preserves browser keyboard behavior and the mobile option picker. */
export function Select({ options, size = 'md', ...props }: SelectProps) {
  return (
    <select {...safeProps(props)} className="ns-input ns-select" data-size={size}>
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
