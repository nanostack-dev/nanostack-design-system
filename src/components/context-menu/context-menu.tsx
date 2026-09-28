import type { ComponentProps } from 'react';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem as ContextMenuItemPrimitive,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

export type ContextMenuProps = ComponentProps<typeof ContextMenu>;
export type ContextMenuCheckboxItemProps = ComponentProps<typeof ContextMenuCheckboxItem>;
export type ContextMenuContentProps = ComponentProps<typeof ContextMenuContent>;
export type ContextMenuGroupProps = ComponentProps<typeof ContextMenuGroup>;
export type ContextMenuItemProps = ComponentProps<typeof ContextMenuItemPrimitive>;
export type ContextMenuItemVariant = NonNullable<ContextMenuItemProps['variant']>;
export type ContextMenuLabelProps = ComponentProps<typeof ContextMenuLabel>;
export type ContextMenuPortalProps = ComponentProps<typeof ContextMenuPortal>;
export type ContextMenuRadioGroupProps = ComponentProps<typeof ContextMenuRadioGroup>;
export type ContextMenuRadioItemProps = ComponentProps<typeof ContextMenuRadioItem>;
export type ContextMenuSeparatorProps = ComponentProps<typeof ContextMenuSeparator>;
export type ContextMenuShortcutProps = ComponentProps<typeof ContextMenuShortcut>;
export type ContextMenuSubProps = ComponentProps<typeof ContextMenuSub>;
export type ContextMenuSubContentProps = ComponentProps<typeof ContextMenuSubContent>;
export type ContextMenuSubTriggerProps = ComponentProps<typeof ContextMenuSubTrigger>;
export type ContextMenuTriggerProps = ComponentProps<typeof ContextMenuTrigger>;

export function ContextMenuItem({ className, ...props }: ContextMenuItemProps) {
  return (
    <ContextMenuItemPrimitive
      className={cn(
        'data-[variant=destructive]:text-destructive-on-tint data-[variant=destructive]:focus:text-destructive-on-tint data-[variant=destructive]:*:[svg]:text-destructive-on-tint',
        className,
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
