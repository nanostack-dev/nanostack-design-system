import { Input as InputPrimitive } from '@base-ui/react/input';
import type { ComponentProps } from 'react';

import { useMaterialAttributes } from '@/lib/material';
import { useMotionAttributes } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';

import { inputStyles, type InputFont, type InputSize, type InputVariant } from '@/recipes/input';

export { inputStyles };
export type { InputFont, InputSize, InputVariant };

export type InputProps = ClosedProps<
  Omit<ComponentProps<typeof InputPrimitive>, 'render' | 'size'>
> & {
  variant?: InputVariant;
  size?: InputSize;
  font?: InputFont;
};

export function Input({ variant, size, font, ...props }: InputProps) {
  const motion = useMotionAttributes();
  const material = useMaterialAttributes();
  return (
    <InputPrimitive
      data-slot="input"
      data-variant={variant ?? 'soft'}
      className={inputStyles({ variant, size, font })}
      {...props}
      {...motion}
      {...material}
    />
  );
}
