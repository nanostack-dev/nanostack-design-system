import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { Badge as BadgePrimitive } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva('', {
  variants: {
    variant: {
      success: 'bg-success/10 text-success-on-tint',
      warning: 'bg-warning/10 text-warning-on-tint',
      info: 'bg-info/10 text-info-on-tint',
    },
  },
});

type PrimitiveBadgeProps = ComponentProps<typeof BadgePrimitive>;
type StatusBadgeVariant = NonNullable<VariantProps<typeof statusBadgeVariants>['variant']>;

export type BadgeVariant = NonNullable<PrimitiveBadgeProps['variant']> | StatusBadgeVariant;
export type BadgeProps = Omit<PrimitiveBadgeProps, 'variant'> & { variant?: BadgeVariant };

const statusBadgeVariantNames: readonly BadgeVariant[] = ['success', 'warning', 'info'];

function isStatusBadgeVariant(variant: BadgeVariant): variant is StatusBadgeVariant {
  return statusBadgeVariantNames.includes(variant);
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  if (isStatusBadgeVariant(variant)) {
    return (
      <BadgePrimitive
        variant="secondary"
        className={cn(statusBadgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
  return (
    <BadgePrimitive
      variant={variant}
      className={cn(variant === 'destructive' && 'text-destructive-on-tint', className)}
      {...props}
    />
  );
}

export { statusBadgeVariants };
