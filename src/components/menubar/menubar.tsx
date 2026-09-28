import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar';
import { CheckIcon } from '@phosphor-icons/react';

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  MenuPopup,
  type DropdownMenuContentProps,
  type DropdownMenuGroupProps,
  type DropdownMenuItemProps,
  type DropdownMenuItemTone,
  type DropdownMenuLabelProps,
  type DropdownMenuProps,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuShortcutProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuSubProps,
  type DropdownMenuSubTriggerProps,
} from '@/components/dropdown-menu/dropdown-menu';
import type { ClosedProps } from '@/lib/closed-props';

export type MenubarItemTone = DropdownMenuItemTone;

export type MenubarProps = ClosedProps<Omit<MenubarPrimitive.Props, 'render'>>;

export function Menubar(props: MenubarProps) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className="flex h-9 items-center rounded-3xl border p-1"
      {...props}
    />
  );
}

export type MenubarMenuProps = DropdownMenuProps;

export function MenubarMenu(props: MenubarMenuProps) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />;
}

export type MenubarGroupProps = DropdownMenuGroupProps;

export function MenubarGroup(props: MenubarGroupProps) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />;
}

export type MenubarTriggerProps = ClosedProps<Omit<MenuPrimitive.Trigger.Props, 'render'>>;

export function MenubarTrigger(props: MenubarTriggerProps) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className="flex items-center rounded-2xl px-2 py-0.75 text-sm font-medium outline-hidden select-none hover:bg-muted focus-visible:bg-muted aria-expanded:bg-muted"
      {...props}
    />
  );
}

export type MenubarContentProps = Omit<DropdownMenuContentProps, 'side' | 'align' | 'width'>;

export function MenubarContent(props: MenubarContentProps) {
  return (
    <MenuPopup
      data-slot="menubar-content"
      align="start"
      alignOffset={-4}
      sideOffset={8}
      {...props}
    />
  );
}

export type MenubarItemProps = DropdownMenuItemProps;

export function MenubarItem(props: MenubarItemProps) {
  return <DropdownMenuItem data-slot="menubar-item" {...props} />;
}

const menubarChoiceItemClasses =
  "relative flex cursor-default items-center gap-2.5 rounded-2xl py-2 pr-3 pl-9.5 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export type MenubarCheckboxItemProps = ClosedProps<
  Omit<MenuPrimitive.CheckboxItem.Props, 'render'>
>;

export function MenubarCheckboxItem({ children, ...props }: MenubarCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={menubarChoiceItemClasses}
      {...props}
    >
      <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon aria-hidden />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export type MenubarRadioGroupProps = DropdownMenuRadioGroupProps;

export function MenubarRadioGroup(props: MenubarRadioGroupProps) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />;
}

export type MenubarRadioItemProps = ClosedProps<Omit<MenuPrimitive.RadioItem.Props, 'render'>>;

export function MenubarRadioItem({ children, ...props }: MenubarRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={menubarChoiceItemClasses}
      {...props}
    >
      <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon aria-hidden />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export type MenubarLabelProps = DropdownMenuLabelProps;

export function MenubarLabel(props: MenubarLabelProps) {
  return <DropdownMenuLabel data-slot="menubar-label" {...props} />;
}

export type MenubarSeparatorProps = DropdownMenuSeparatorProps;

export function MenubarSeparator(props: MenubarSeparatorProps) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />;
}

export type MenubarShortcutProps = DropdownMenuShortcutProps;

export function MenubarShortcut(props: MenubarShortcutProps) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />;
}

export type MenubarSubProps = DropdownMenuSubProps;

export function MenubarSub(props: MenubarSubProps) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />;
}

export type MenubarSubTriggerProps = DropdownMenuSubTriggerProps;

export function MenubarSubTrigger(props: MenubarSubTriggerProps) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />;
}

export type MenubarSubContentProps = DropdownMenuSubContentProps;

export function MenubarSubContent(props: MenubarSubContentProps) {
  return <DropdownMenuSubContent data-slot="menubar-sub-content" {...props} />;
}
