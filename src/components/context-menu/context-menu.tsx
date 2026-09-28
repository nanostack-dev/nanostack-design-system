import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { CaretRightIcon, CheckIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type ContextMenuItemTone = 'neutral' | 'critical';

const contextMenuItemClasses = cva(
  "group/context-menu-item relative flex cursor-default items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      tone: {
        neutral: 'focus:*:[svg]:text-accent-foreground',
        critical:
          'text-destructive-on-tint focus:bg-destructive/10 focus:text-destructive-on-tint dark:focus:bg-destructive/20 *:[svg]:text-destructive-on-tint',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

const contextMenuChoiceItemClasses =
  "relative flex cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-9.5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export type ContextMenuProps = ContextMenuPrimitive.Root.Props;

export function ContextMenu(props: ContextMenuProps) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

export type ContextMenuTriggerProps = ClosedProps<ContextMenuPrimitive.Trigger.Props>;

export function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className="select-none"
      {...props}
    />
  );
}

type ContextMenuPopupProps = ClosedProps<Omit<ContextMenuPrimitive.Popup.Props, 'render'>> & {
  side?: ContextMenuPrimitive.Positioner.Props['side'];
  alignOffset?: number;
};

function ContextMenuPopup({ side = 'right', alignOffset = 4, ...props }: ContextMenuPopupProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align="start"
        alignOffset={alignOffset}
        side={side}
        sideOffset={0}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className="z-50 max-h-(--available-height) w-auto max-w-(--available-width) min-w-48 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export type ContextMenuContentProps = ClosedProps<Omit<ContextMenuPrimitive.Popup.Props, 'render'>>;

export function ContextMenuContent(props: ContextMenuContentProps) {
  return <ContextMenuPopup {...props} />;
}

export type ContextMenuGroupProps = ClosedProps<Omit<ContextMenuPrimitive.Group.Props, 'render'>>;

export function ContextMenuGroup(props: ContextMenuGroupProps) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

export type ContextMenuLabelProps = ClosedProps<
  Omit<ContextMenuPrimitive.GroupLabel.Props, 'render'>
> & {
  inset?: boolean;
};

export function ContextMenuLabel({ inset, ...props }: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className="px-3 py-2.5 text-xs text-muted-foreground data-inset:pl-9.5"
      {...props}
    />
  );
}

export type ContextMenuItemProps = ClosedProps<Omit<ContextMenuPrimitive.Item.Props, 'render'>> & {
  inset?: boolean;
  tone?: ContextMenuItemTone;
};

export function ContextMenuItem({ inset, tone = 'neutral', ...props }: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-tone={tone}
      className={cn(contextMenuItemClasses({ tone }))}
      {...props}
    />
  );
}

export type ContextMenuSubProps = ContextMenuPrimitive.SubmenuRoot.Props;

export function ContextMenuSub(props: ContextMenuSubProps) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

export type ContextMenuSubTriggerProps = ClosedProps<
  Omit<ContextMenuPrimitive.SubmenuTrigger.Props, 'render'>
> & {
  inset?: boolean;
};

export function ContextMenuSubTrigger({ inset, children, ...props }: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className="flex cursor-default items-center rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-9.5 data-open:bg-accent data-open:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      {children}
      <CaretRightIcon aria-hidden className="ml-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

export type ContextMenuSubContentProps = ContextMenuContentProps;

export function ContextMenuSubContent(props: ContextMenuSubContentProps) {
  return <ContextMenuPopup data-slot="context-menu-sub-content" alignOffset={-3} {...props} />;
}

export type ContextMenuCheckboxItemProps = ClosedProps<
  Omit<ContextMenuPrimitive.CheckboxItem.Props, 'render'>
> & {
  inset?: boolean;
};

export function ContextMenuCheckboxItem({
  children,
  inset,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={contextMenuChoiceItemClasses}
      {...props}
    >
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon aria-hidden />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export type ContextMenuRadioGroupProps = ClosedProps<
  Omit<ContextMenuPrimitive.RadioGroup.Props, 'render'>
>;

export function ContextMenuRadioGroup(props: ContextMenuRadioGroupProps) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

export type ContextMenuRadioItemProps = ClosedProps<
  Omit<ContextMenuPrimitive.RadioItem.Props, 'render'>
> & {
  inset?: boolean;
};

export function ContextMenuRadioItem({ children, inset, ...props }: ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={contextMenuChoiceItemClasses}
      {...props}
    >
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon aria-hidden />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export type ContextMenuSeparatorProps = ClosedProps<
  Omit<ContextMenuPrimitive.Separator.Props, 'render'>
>;

export function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className="-mx-1.5 my-1.5 h-px bg-border/50"
      {...props}
    />
  );
}

export type ContextMenuShortcutProps = ClosedProps<ComponentProps<'span'>>;

export function ContextMenuShortcut(props: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className="ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground"
      {...props}
    />
  );
}
