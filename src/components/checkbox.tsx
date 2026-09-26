'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { safeProps, type ElementProps } from '../internal/props.js';

export type CheckboxProps = Omit<ElementProps<'span'>, 'children' | 'value' | 'onChange'> &
  Pick<
    BaseCheckbox.Root.Props,
    | 'checked'
    | 'defaultChecked'
    | 'onCheckedChange'
    | 'indeterminate'
    | 'readOnly'
    | 'required'
    | 'value'
    | 'uncheckedValue'
    | 'disabled'
    | 'name'
    | 'form'
  > & { children?: never };

/** Compose with Field/FieldLabel, or provide an accessible name directly. */
export function Checkbox({ indeterminate = false, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root {...safeProps(props)} indeterminate={indeterminate} className="ns-checkbox">
      <BaseCheckbox.Indicator className="ns-checkbox-indicator">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d={indeterminate ? 'M3 8h10' : 'm3 8 3 3 7-7'} />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
