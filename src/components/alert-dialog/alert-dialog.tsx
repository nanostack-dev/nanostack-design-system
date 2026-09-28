import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import type * as React from 'react';

import { Button, buttonStyles, type ButtonProps } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';

export type AlertDialogProps = AlertDialogPrimitive.Root.Props;
export type AlertDialogTriggerProps = ClosedProps<AlertDialogPrimitive.Trigger.Props>;
export type AlertDialogContentProps = ClosedProps<Omit<AlertDialogPrimitive.Popup.Props, 'render'>>;
export type AlertDialogHeaderProps = ClosedProps<React.ComponentProps<'div'>>;
export type AlertDialogFooterProps = ClosedProps<React.ComponentProps<'div'>>;
export type AlertDialogMediaProps = ClosedProps<React.ComponentProps<'div'>>;
export type AlertDialogTitleProps = ClosedProps<Omit<AlertDialogPrimitive.Title.Props, 'render'>>;
export type AlertDialogDescriptionProps = ClosedProps<
  Omit<AlertDialogPrimitive.Description.Props, 'render'>
>;
export type AlertDialogActionProps = Omit<ButtonProps, 'width' | 'bleed'>;
export type AlertDialogCancelProps = ClosedProps<Omit<AlertDialogPrimitive.Close.Props, 'render'>> &
  Pick<ButtonProps, 'variant' | 'size'>;

function AlertDialog({ ...props }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: AlertDialogTriggerProps) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay() {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className="fixed inset-0 isolate z-50 bg-foreground/30 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 dark:bg-background/60"
    />
  );
}

function AlertDialogContent({ ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className="group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-xs -translate-x-1/2 -translate-y-1/2 gap-6 overflow-y-auto overscroll-contain rounded-4xl bg-popover p-6 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none sm:max-w-md dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ ...props }: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      className="grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:place-items-start sm:text-left sm:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]"
      {...props}
    />
  );
}

function AlertDialogFooter({ ...props }: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
      {...props}
    />
  );
}

function AlertDialogMedia({ ...props }: AlertDialogMediaProps) {
  return (
    <div
      data-slot="alert-dialog-media"
      className="mb-2 inline-flex size-16 items-center justify-center rounded-full bg-muted sm:row-span-2 *:[svg:not([class*='size-'])]:size-8"
      {...props}
    />
  );
}

function AlertDialogTitle({ ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className="font-heading text-lg font-medium sm:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2"
      {...props}
    />
  );
}

function AlertDialogDescription({ ...props }: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className="text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground"
      {...props}
    />
  );
}

function AlertDialogAction({
  variant = 'solid',
  tone = 'brand',
  ...props
}: AlertDialogActionProps) {
  return <Button data-slot="alert-dialog-action" variant={variant} tone={tone} {...props} />;
}

function AlertDialogCancel({ variant = 'outline', size, ...props }: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={buttonStyles({ variant, tone: 'neutral', size })}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
};
