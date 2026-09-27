'use client';

import type { ReactNode } from 'react';
import { Toaster as Sonner, toast as notify } from 'sonner';
import { Theme, useThemeSettings } from '../theme.js';
import type { NoCustomStyle } from '../internal/props.js';

export type ToastOptions = NoCustomStyle & {
  id?: string | number;
  description?: ReactNode;
  duration?: number;
  action?: { label: ReactNode; onClick: () => void };
  onDismiss?: () => void;
};
function options(input: ToastOptions = {}) {
  const { id, description, duration, action, onDismiss } = input;
  return {
    ...(id === undefined ? {} : { id }),
    ...(description === undefined ? {} : { description }),
    ...(duration === undefined ? {} : { duration }),
    ...(action === undefined ? {} : { action }),
    ...(onDismiss === undefined ? {} : { onDismiss }),
  };
}
export const toast = Object.assign(
  (message: ReactNode, input?: ToastOptions) => notify(message, options(input)),
  {
    success: (message: ReactNode, input?: ToastOptions) => notify.success(message, options(input)),
    error: (message: ReactNode, input?: ToastOptions) => notify.error(message, options(input)),
    info: (message: ReactNode, input?: ToastOptions) => notify.info(message, options(input)),
    warning: (message: ReactNode, input?: ToastOptions) => notify.warning(message, options(input)),
    loading: (message: ReactNode, input?: ToastOptions) => notify.loading(message, options(input)),
    dismiss: (id?: string | number) => notify.dismiss(id),
  },
);
export type ToasterProps = NoCustomStyle & {
  position?: 'top-right' | 'bottom-right' | 'bottom-center';
};
export function Toaster({ position = 'bottom-right' }: ToasterProps) {
  const theme = useThemeSettings();
  return (
    <Theme {...theme}>
      <Sonner
        theme={theme.colorScheme}
        position={position}
        toastOptions={{
          classNames: {
            toast: 'ns-toast',
            title: 'ns-toast-title',
            description: 'ns-toast-description',
            actionButton: 'ns-toast-action',
          },
        }}
      />
    </Theme>
  );
}
