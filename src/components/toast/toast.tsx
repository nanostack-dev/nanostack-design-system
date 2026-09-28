import type { ComponentProps } from 'react';

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
} from '@/components/ui/toast';

export type ToasterProps = ComponentProps<typeof Toaster>;
export type ToastProps = ComponentProps<typeof Toast>;
export type ToastActionProps = ComponentProps<typeof ToastAction>;
export type ToastCloseProps = ComponentProps<typeof ToastClose>;
export type ToastContentProps = ComponentProps<typeof ToastContent>;
export type ToastDescriptionProps = ComponentProps<typeof ToastDescription>;
export type ToastPortalProps = ComponentProps<typeof ToastPortal>;
export type ToastProviderProps = ComponentProps<typeof ToastProvider>;
export type ToastTitleProps = ComponentProps<typeof ToastTitle>;
export type ToastViewportProps = ComponentProps<typeof ToastViewport>;
export type ToastManager = ReturnType<typeof createToastManager>;
export type ToastOptions = Parameters<ToastManager['add']>[0];

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
};
