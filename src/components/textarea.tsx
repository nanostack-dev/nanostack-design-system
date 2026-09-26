'use client';

import { Field as BaseField } from '@base-ui/react/field';
import { safeProps, type ElementProps } from '../internal/props.js';

export type TextareaProps = Omit<ElementProps<'textarea'>, 'rows' | 'cols'> & {
  height?: 'compact' | 'standard' | 'fill';
  onValueChange?: BaseField.Control.Props['onValueChange'];
  rows?: never;
  cols?: never;
};

/** Field owns labels and validation; the library owns sizing and resizing behavior. */
export function Textarea({
  height = 'standard',
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  readOnly,
  rows,
  cols,
  ...props
}: TextareaProps) {
  void rows;
  void cols;
  return (
    <BaseField.Control
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      render={
        <textarea {...safeProps(props)} className="ns-input ns-textarea" data-height={height} />
      }
    />
  );
}
