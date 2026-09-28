import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import {
  AlertAction,
  AlertDescription,
  Alert as AlertPrimitive,
  AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const statusAlertVariants = cva('', {
  variants: {
    variant: {
      success:
        'border-success/30 bg-success/5 text-success-on-tint *:data-[slot=alert-description]:text-success-on-tint',
      warning:
        'border-warning/30 bg-warning/5 text-warning-on-tint *:data-[slot=alert-description]:text-warning-on-tint',
      info: 'border-info/30 bg-info/5 text-info-on-tint *:data-[slot=alert-description]:text-info-on-tint',
    },
  },
});

type PrimitiveAlertProps = ComponentProps<typeof AlertPrimitive>;
type StatusAlertVariant = NonNullable<VariantProps<typeof statusAlertVariants>['variant']>;

export type AlertVariant = NonNullable<PrimitiveAlertProps['variant']> | StatusAlertVariant;
export type AlertProps = Omit<PrimitiveAlertProps, 'variant'> & { variant?: AlertVariant };
export type AlertTitleProps = ComponentProps<typeof AlertTitle>;
export type AlertDescriptionProps = ComponentProps<typeof AlertDescription>;
export type AlertActionProps = ComponentProps<typeof AlertAction>;

const statusAlertVariantNames: readonly AlertVariant[] = ['success', 'warning', 'info'];

function isStatusAlertVariant(variant: AlertVariant): variant is StatusAlertVariant {
  return statusAlertVariantNames.includes(variant);
}

export function Alert({ variant = 'default', className, ...props }: AlertProps) {
  if (isStatusAlertVariant(variant)) {
    return (
      <AlertPrimitive
        variant="default"
        className={cn(statusAlertVariants({ variant }), className)}
        {...props}
      />
    );
  }
  return <AlertPrimitive variant={variant} className={className} {...props} />;
}

export { AlertAction, AlertDescription, AlertTitle, statusAlertVariants };
