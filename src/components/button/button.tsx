import type { ComponentProps } from 'react';

import { Button as ButtonPrimitive, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ButtonProps = ComponentProps<typeof ButtonPrimitive>;
export type ButtonVariant = NonNullable<ButtonProps['variant']>;
export type ButtonSize = NonNullable<ButtonProps['size']>;

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      variant={variant}
      className={cn(variant === 'destructive' && 'text-destructive-on-tint', className)}
      {...props}
    />
  );
}

export { buttonVariants };
