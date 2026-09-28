import type { ComponentProps } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent as DropdownMenuContentPrimitive,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;
export type DropdownMenuCheckboxItemProps = ComponentProps<typeof DropdownMenuCheckboxItem>;
export type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuContentPrimitive>;
export type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuGroup>;
export type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuItem>;
export type DropdownMenuItemVariant = NonNullable<DropdownMenuItemProps['variant']>;
export type DropdownMenuLabelProps = ComponentProps<typeof DropdownMenuLabel>;
export type DropdownMenuPortalProps = ComponentProps<typeof DropdownMenuPortal>;
export type DropdownMenuRadioGroupProps = ComponentProps<typeof DropdownMenuRadioGroup>;
export type DropdownMenuRadioItemProps = ComponentProps<typeof DropdownMenuRadioItem>;
export type DropdownMenuSeparatorProps = ComponentProps<typeof DropdownMenuSeparator>;
export type DropdownMenuShortcutProps = ComponentProps<typeof DropdownMenuShortcut>;
export type DropdownMenuSubProps = ComponentProps<typeof DropdownMenuSub>;
export type DropdownMenuSubContentProps = ComponentProps<typeof DropdownMenuSubContent>;
export type DropdownMenuSubTriggerProps = ComponentProps<typeof DropdownMenuSubTrigger>;
export type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuTrigger>;

export function DropdownMenuContent({ className, ...props }: DropdownMenuContentProps) {
  return (
    <DropdownMenuContentPrimitive
      className={cn(
        'w-auto max-w-(--available-width) min-w-[max(var(--anchor-width),12rem)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
