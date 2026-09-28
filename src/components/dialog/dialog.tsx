import type { ComponentProps } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type DialogProps = ComponentProps<typeof Dialog>;
export type DialogCloseProps = ComponentProps<typeof DialogClose>;
export type DialogContentProps = ComponentProps<typeof DialogContent>;
export type DialogDescriptionProps = ComponentProps<typeof DialogDescription>;
export type DialogFooterProps = ComponentProps<typeof DialogFooter>;
export type DialogHeaderProps = ComponentProps<typeof DialogHeader>;
export type DialogOverlayProps = ComponentProps<typeof DialogOverlay>;
export type DialogPortalProps = ComponentProps<typeof DialogPortal>;
export type DialogTitleProps = ComponentProps<typeof DialogTitle>;
export type DialogTriggerProps = ComponentProps<typeof DialogTrigger>;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
