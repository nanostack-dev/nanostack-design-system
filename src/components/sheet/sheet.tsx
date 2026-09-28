import type { ComponentProps } from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export type SheetProps = ComponentProps<typeof Sheet>;
export type SheetCloseProps = ComponentProps<typeof SheetClose>;
export type SheetContentProps = ComponentProps<typeof SheetContent>;
export type SheetDescriptionProps = ComponentProps<typeof SheetDescription>;
export type SheetFooterProps = ComponentProps<typeof SheetFooter>;
export type SheetHeaderProps = ComponentProps<typeof SheetHeader>;
export type SheetTitleProps = ComponentProps<typeof SheetTitle>;
export type SheetTriggerProps = ComponentProps<typeof SheetTrigger>;
export type SheetSide = NonNullable<SheetContentProps['side']>;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
