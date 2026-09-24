'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { safeProps, type ElementProps } from '../internal/props.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';
export type ButtonProps = ElementProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** A native action button. Use links, rather than buttons, for navigation. */
export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...safeProps(props)}
      type={type}
      nativeButton
      className="ns-button"
      data-variant={variant}
      data-size={size}
    />
  );
}
