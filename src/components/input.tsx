'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import type { Icon as Glyph } from '@phosphor-icons/react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type InputProps = Omit<ElementProps<'input'>, 'size'> & {
  size?: 'sm' | 'md';
  /** A decorative glyph inside the start of the field, such as a magnifier on a search field. */
  icon?: Glyph;
  onValueChange?: BaseInput.Props['onValueChange'];
};

/** Native input behavior with automatic Base UI Field label and error association. */
export function Input({ size = 'md', icon: Glyph, ...props }: InputProps) {
  const input = <BaseInput {...safeProps(props)} className="ns-input" data-size={size} />;
  if (!Glyph) return input;
  return (
    <span className="ns-input-frame" data-size={size}>
      <span className="ns-input-icon" aria-hidden="true">
        <Glyph aria-hidden="true" />
      </span>
      {input}
    </span>
  );
}
