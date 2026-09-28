import type { ComponentProps } from 'react';

import {
  AlertDialog,
  AlertDialogAction as AlertDialogActionPrimitive,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export type AlertDialogProps = ComponentProps<typeof AlertDialog>;
export type AlertDialogActionProps = ComponentProps<typeof AlertDialogActionPrimitive>;
export type AlertDialogCancelProps = ComponentProps<typeof AlertDialogCancel>;
export type AlertDialogContentProps = ComponentProps<typeof AlertDialogContent>;
export type AlertDialogDescriptionProps = ComponentProps<typeof AlertDialogDescription>;
export type AlertDialogFooterProps = ComponentProps<typeof AlertDialogFooter>;
export type AlertDialogHeaderProps = ComponentProps<typeof AlertDialogHeader>;
export type AlertDialogMediaProps = ComponentProps<typeof AlertDialogMedia>;
export type AlertDialogOverlayProps = ComponentProps<typeof AlertDialogOverlay>;
export type AlertDialogPortalProps = ComponentProps<typeof AlertDialogPortal>;
export type AlertDialogTitleProps = ComponentProps<typeof AlertDialogTitle>;
export type AlertDialogTriggerProps = ComponentProps<typeof AlertDialogTrigger>;

export function AlertDialogAction({ variant, className, ...props }: AlertDialogActionProps) {
  return (
    <AlertDialogActionPrimitive
      variant={variant}
      className={cn(variant === 'destructive' && 'text-destructive-on-tint', className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
