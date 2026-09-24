'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import type { ButtonProps } from './button.js';

export type DialogProps = NoCustomStyle &
  Pick<
    BaseDialog.Root.Props,
    'open' | 'defaultOpen' | 'onOpenChange' | 'onOpenChangeComplete' | 'disablePointerDismissal'
  > & { children: ReactNode };

/** Modal state stays with Base UI, including Escape handling and focus restoration. */
export function Dialog(props: DialogProps) {
  return <BaseDialog.Root {...safeProps(props)} modal />;
}

export type DialogTriggerProps = ButtonProps;
export function DialogTrigger({
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: DialogTriggerProps) {
  return (
    <BaseDialog.Trigger
      {...safeProps(props)}
      nativeButton
      type={type}
      className="ns-button"
      data-variant={variant}
      data-size={size}
    />
  );
}

export type DialogPopupProps = ElementProps<'div'> & {
  size?: 'sm' | 'md';
  initialFocus?: BaseDialog.Popup.Props['initialFocus'];
};

/** Include DialogTitle inside every popup so assistive technology can name it. */
export function DialogPopup({ size = 'md', children, ...props }: DialogPopupProps) {
  const theme = useThemeSettings();
  return (
    <BaseDialog.Portal>
      <Theme {...theme}>
        <BaseDialog.Backdrop className="ns-dialog-backdrop" />
        <BaseDialog.Popup {...safeProps(props)} className="ns-dialog-popup" data-size={size}>
          {children}
          <BaseDialog.Close
            nativeButton
            type="button"
            className="ns-button ns-dialog-dismiss"
            data-variant="ghost"
            data-size="sm"
            aria-label="Close dialog"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </Theme>
    </BaseDialog.Portal>
  );
}

export type DialogTitleProps = ElementProps<'h2'>;
export function DialogTitle(props: DialogTitleProps) {
  return <BaseDialog.Title {...safeProps(props)} className="ns-dialog-title" />;
}

export type DialogDescriptionProps = ElementProps<'p'>;
export function DialogDescription(props: DialogDescriptionProps) {
  return <BaseDialog.Description {...safeProps(props)} className="ns-dialog-description" />;
}

export type DialogCloseProps = ButtonProps;
export function DialogClose({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  ...props
}: DialogCloseProps) {
  return (
    <BaseDialog.Close
      {...safeProps(props)}
      nativeButton
      type={type}
      className="ns-button"
      data-variant={variant}
      data-size={size}
    />
  );
}
