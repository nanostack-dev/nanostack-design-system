import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { CaretRightIcon, CheckIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import { createElement, type ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent } from '@/provider/design-system-provider';

type PositionerProps = MenuPrimitive.Positioner.Props;

export type DropdownMenuSide = NonNullable<PositionerProps['side']>;
export type DropdownMenuAlign = NonNullable<PositionerProps['align']>;
export type DropdownMenuContentWidth = 'auto' | 'sm' | 'md';
export type DropdownMenuItemTone = 'neutral' | 'critical';

const menuPopupClasses = cva(
  'z-50 max-h-(--available-height) max-w-(--available-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
  {
    variants: {
      width: {
        auto: 'w-auto min-w-[max(var(--anchor-width),12rem)]',
        sm: 'w-56 min-w-(--anchor-width)',
        md: 'w-64 min-w-(--anchor-width)',
        submenu: 'w-auto min-w-36',
      },
    },
    defaultVariants: { width: 'auto' },
  },
);

type MenuPopupWidth = DropdownMenuContentWidth | 'submenu';

export type MenuPopupProps = ClosedProps<Omit<MenuPrimitive.Popup.Props, 'render'>> & {
  side?: DropdownMenuSide;
  align?: DropdownMenuAlign;
  sideOffset?: number;
  alignOffset?: number;
  width?: MenuPopupWidth;
};

export function MenuPopup({
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset = 0,
  width = 'auto',
  ...props
}: MenuPopupProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          data-width={width}
          className={cn(menuPopupClasses({ width }))}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

const menuItemClasses = cva(
  "group/dropdown-menu-item relative flex cursor-default items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      tone: {
        neutral: 'focus:**:text-accent-foreground',
        critical:
          'text-destructive-on-tint focus:bg-destructive/10 focus:text-destructive-on-tint dark:focus:bg-destructive/20 *:[svg]:text-destructive-on-tint',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

const menuChoiceItemClasses =
  "relative flex cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export type DropdownMenuProps = MenuPrimitive.Root.Props;

export function DropdownMenu(props: DropdownMenuProps) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

export type DropdownMenuTriggerProps = ClosedProps<MenuPrimitive.Trigger.Props>;

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export type DropdownMenuContentProps = ClosedProps<Omit<MenuPrimitive.Popup.Props, 'render'>> & {
  side?: DropdownMenuSide;
  align?: DropdownMenuAlign;
  width?: DropdownMenuContentWidth;
};

export function DropdownMenuContent(props: DropdownMenuContentProps) {
  return <MenuPopup {...props} />;
}

export type DropdownMenuGroupProps = ClosedProps<Omit<MenuPrimitive.Group.Props, 'render'>>;

export function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

export type DropdownMenuLabelProps = ClosedProps<Omit<MenuPrimitive.GroupLabel.Props, 'render'>> & {
  inset?: boolean;
};

export function DropdownMenuLabel({ inset, ...props }: DropdownMenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className="px-3 py-2.5 text-xs text-muted-foreground data-inset:pl-9.5"
      {...props}
    />
  );
}

export type DropdownMenuItemProps = ClosedProps<Omit<MenuPrimitive.Item.Props, 'render'>> & {
  inset?: boolean;
  tone?: DropdownMenuItemTone;
};

export function DropdownMenuItem({ inset, tone = 'neutral', ...props }: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-tone={tone}
      className={cn(menuItemClasses({ tone }))}
      {...props}
    />
  );
}

export type DropdownMenuLinkItemProps = ClosedProps<
  Omit<MenuPrimitive.LinkItem.Props, 'render' | 'href'>
> & {
  href: string;
  inset?: boolean;
};

export function DropdownMenuLinkItem({
  href,
  inset,
  closeOnClick = true,
  ...props
}: DropdownMenuLinkItemProps) {
  const linkComponent = useLinkComponent();
  return (
    <MenuPrimitive.LinkItem
      data-slot="dropdown-menu-link-item"
      data-inset={inset}
      className={cn(
        menuItemClasses({ tone: 'neutral' }),
        'aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground',
      )}
      closeOnClick={closeOnClick}
      render={createElement(linkComponent, { href })}
      {...props}
    />
  );
}

export type DropdownMenuSubProps = MenuPrimitive.SubmenuRoot.Props;

export function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

export type DropdownMenuSubTriggerProps = ClosedProps<
  Omit<MenuPrimitive.SubmenuTrigger.Props, 'render'>
> & {
  inset?: boolean;
};

export function DropdownMenuSubTrigger({ inset, children, ...props }: DropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className="flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      {children}
      <CaretRightIcon aria-hidden className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

export type DropdownMenuSubContentProps = ClosedProps<Omit<MenuPrimitive.Popup.Props, 'render'>>;

export function DropdownMenuSubContent(props: DropdownMenuSubContentProps) {
  return (
    <MenuPopup
      data-slot="dropdown-menu-sub-content"
      side="right"
      align="start"
      sideOffset={0}
      alignOffset={-3}
      width="submenu"
      {...props}
    />
  );
}

export type DropdownMenuCheckboxItemProps = ClosedProps<
  Omit<MenuPrimitive.CheckboxItem.Props, 'render'>
> & {
  inset?: boolean;
};

export function DropdownMenuCheckboxItem({
  children,
  inset,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={menuChoiceItemClasses}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon aria-hidden />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export type DropdownMenuRadioGroupProps = ClosedProps<
  Omit<MenuPrimitive.RadioGroup.Props, 'render'>
>;

export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

export type DropdownMenuRadioItemProps = ClosedProps<
  Omit<MenuPrimitive.RadioItem.Props, 'render'>
> & {
  inset?: boolean;
};

export function DropdownMenuRadioItem({ children, inset, ...props }: DropdownMenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={menuChoiceItemClasses}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon aria-hidden />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export type DropdownMenuSeparatorProps = ClosedProps<Omit<MenuPrimitive.Separator.Props, 'render'>>;

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className="-mx-1.5 my-1.5 h-px bg-border/50"
      {...props}
    />
  );
}

export type DropdownMenuShortcutProps = ClosedProps<ComponentProps<'span'>>;

export function DropdownMenuShortcut(props: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className="ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground"
      {...props}
    />
  );
}
