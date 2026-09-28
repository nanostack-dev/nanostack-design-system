import type { ComponentProps } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export type DrawerProps = ComponentProps<typeof Drawer>;
export type DrawerCloseProps = ComponentProps<typeof DrawerClose>;
export type DrawerContentProps = ComponentProps<typeof DrawerContent>;
export type DrawerDescriptionProps = ComponentProps<typeof DrawerDescription>;
export type DrawerFooterProps = ComponentProps<typeof DrawerFooter>;
export type DrawerHeaderProps = ComponentProps<typeof DrawerHeader>;
export type DrawerOverlayProps = ComponentProps<typeof DrawerOverlay>;
export type DrawerPortalProps = ComponentProps<typeof DrawerPortal>;
export type DrawerSwipeHandleProps = ComponentProps<typeof DrawerSwipeHandle>;
export type DrawerTitleProps = ComponentProps<typeof DrawerTitle>;
export type DrawerTriggerProps = ComponentProps<typeof DrawerTrigger>;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerTrigger,
};
