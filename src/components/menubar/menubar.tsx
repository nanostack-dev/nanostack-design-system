import type { ComponentProps } from 'react';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent as MenubarContentPrimitive,
  MenubarGroup,
  MenubarItem as MenubarItemPrimitive,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { cn } from '@/lib/utils';

export type MenubarProps = ComponentProps<typeof Menubar>;
export type MenubarCheckboxItemProps = ComponentProps<typeof MenubarCheckboxItem>;
export type MenubarContentProps = ComponentProps<typeof MenubarContentPrimitive>;
export type MenubarGroupProps = ComponentProps<typeof MenubarGroup>;
export type MenubarItemProps = ComponentProps<typeof MenubarItemPrimitive>;
export type MenubarItemVariant = NonNullable<MenubarItemProps['variant']>;
export type MenubarLabelProps = ComponentProps<typeof MenubarLabel>;
export type MenubarMenuProps = ComponentProps<typeof MenubarMenu>;
export type MenubarPortalProps = ComponentProps<typeof MenubarPortal>;
export type MenubarRadioGroupProps = ComponentProps<typeof MenubarRadioGroup>;
export type MenubarRadioItemProps = ComponentProps<typeof MenubarRadioItem>;
export type MenubarSeparatorProps = ComponentProps<typeof MenubarSeparator>;
export type MenubarShortcutProps = ComponentProps<typeof MenubarShortcut>;
export type MenubarSubProps = ComponentProps<typeof MenubarSub>;
export type MenubarSubContentProps = ComponentProps<typeof MenubarSubContent>;
export type MenubarSubTriggerProps = ComponentProps<typeof MenubarSubTrigger>;
export type MenubarTriggerProps = ComponentProps<typeof MenubarTrigger>;

export function MenubarContent({ className, ...props }: MenubarContentProps) {
  return (
    <MenubarContentPrimitive
      className={cn(
        'w-auto max-w-(--available-width) min-w-[max(var(--anchor-width),12rem)]',
        className,
      )}
      {...props}
    />
  );
}

export function MenubarItem({ className, ...props }: MenubarItemProps) {
  return (
    <MenubarItemPrimitive
      className={cn(
        'data-[variant=destructive]:text-destructive-on-tint data-[variant=destructive]:focus:text-destructive-on-tint data-[variant=destructive]:*:[svg]:text-destructive-on-tint',
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarGroup,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
