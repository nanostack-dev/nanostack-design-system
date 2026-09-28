import type { ComponentProps } from 'react';

import { Button as ButtonPrimitive, buttonVariants } from '@/components/ui/button';

export type ButtonProps = ComponentProps<typeof ButtonPrimitive>;
export type ButtonVariant = NonNullable<ButtonProps['variant']>;
export type ButtonSize = NonNullable<ButtonProps['size']>;

export function Button(props: ButtonProps) {
  return <ButtonPrimitive {...props} />;
}

export { buttonVariants };
