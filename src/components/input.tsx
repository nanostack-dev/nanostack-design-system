'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { safeProps, type ElementProps } from '../internal/props.js';

export type InputProps = Omit<ElementProps<'input'>, 'size'> & {
  size?: 'sm' | 'md';
  onValueChange?: BaseInput.Props['onValueChange'];
};

/** Native input behavior with automatic Base UI Field label and error association. */
export function Input({ size = 'md', ...props }: InputProps) {
  return <BaseInput {...safeProps(props)} className="ns-input" data-size={size} />;
}
