'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import type { ButtonProps } from './button.js';

export type MenuProps = NoCustomStyle &
  Pick<
    BaseMenu.Root.Props,
    'open' | 'defaultOpen' | 'onOpenChange' | 'onOpenChangeComplete' | 'disabled'
  > & {
    children: ReactNode;
  };

export function Menu(props: MenuProps) {
  return <BaseMenu.Root {...safeProps(props)} orientation="vertical" loopFocus />;
}

export type MenuTriggerProps = Omit<ButtonProps, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'icon';
};

export function MenuTrigger({
  variant = 'ghost',
  size = 'md',
  type = 'button',
  ...props
}: MenuTriggerProps) {
  return (
    <BaseMenu.Trigger
      {...safeProps(props)}
      nativeButton
      type={type}
      className="ns-button"
      data-variant={variant}
      data-size={size}
    />
  );
}

export type MenuContentProps = ElementProps<'div'> & {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export function MenuContent({ align = 'start', side = 'bottom', ...props }: MenuContentProps) {
  const theme = useThemeSettings();
  return (
    <BaseMenu.Portal>
      <Theme {...theme}>
        <BaseMenu.Positioner
          align={align}
          side={side}
          sideOffset={4}
          className="ns-menu-positioner"
        >
          <BaseMenu.Popup {...safeProps(props)} className="ns-menu-content" />
        </BaseMenu.Positioner>
      </Theme>
    </BaseMenu.Portal>
  );
}

export type MenuItemProps = ElementProps<'div'> &
  Pick<BaseMenu.Item.Props, 'disabled' | 'closeOnClick' | 'label'> & {
    tone?: 'neutral' | 'danger';
  };

export function MenuItem({ tone = 'neutral', ...props }: MenuItemProps) {
  return <BaseMenu.Item {...safeProps(props)} className="ns-menu-item" data-tone={tone} />;
}

export type MenuLinkProps = ElementProps<'a'> & {
  href: string;
  tone?: 'neutral' | 'danger';
  disabled?: boolean;
};

/** A native anchor supports router adapters, modified clicks, and open-in-new-tab. */
export function MenuLink({ tone = 'neutral', disabled, ...props }: MenuLinkProps) {
  return (
    <BaseMenu.Item
      disabled={disabled}
      render={<a {...safeProps(props)}>{props.children}</a>}
      className="ns-menu-item"
      data-tone={tone}
    />
  );
}

export type MenuGroupProps = ElementProps<'div'>;
export function MenuGroup(props: MenuGroupProps) {
  return <BaseMenu.Group {...safeProps(props)} className="ns-menu-group" />;
}

export type MenuLabelProps = ElementProps<'div'>;
export function MenuLabel(props: MenuLabelProps) {
  return <BaseMenu.GroupLabel {...safeProps(props)} className="ns-menu-label" />;
}

export type MenuSeparatorProps = ElementProps<'div'>;
export function MenuSeparator(props: MenuSeparatorProps) {
  return <BaseMenu.Separator {...safeProps(props)} className="ns-menu-separator" />;
}

export type MenuCheckboxItemProps = ElementProps<'div'> &
  Pick<
    BaseMenu.CheckboxItem.Props,
    'checked' | 'defaultChecked' | 'onCheckedChange' | 'disabled' | 'closeOnClick' | 'label'
  >;

export function MenuCheckboxItem({ children, ...props }: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem {...safeProps(props)} className="ns-menu-item ns-menu-checkbox-item">
      <BaseMenu.CheckboxItemIndicator className="ns-menu-check-indicator" keepMounted>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m3 8 3 3 7-7" />
        </svg>
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export type MenuRadioGroupProps = ElementProps<'div'> & {
  value: string;
  onValueChange: (value: string) => void;
};
export function MenuRadioGroup({ value, onValueChange, ...props }: MenuRadioGroupProps) {
  return (
    <BaseMenu.RadioGroup
      {...safeProps(props)}
      value={value}
      onValueChange={(next: unknown) => {
        if (typeof next === 'string') onValueChange(next);
      }}
    />
  );
}
export type MenuRadioItemProps = ElementProps<'div'> &
  Pick<BaseMenu.RadioItem.Props, 'disabled' | 'closeOnClick' | 'label'> & { value: string };
export function MenuRadioItem({ children, ...props }: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem {...safeProps(props)} className="ns-menu-item ns-menu-checkbox-item">
      <BaseMenu.RadioItemIndicator className="ns-menu-check-indicator" keepMounted>
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="8" cy="8" r="3" />
        </svg>
      </BaseMenu.RadioItemIndicator>
      {children}
    </BaseMenu.RadioItem>
  );
}
export type MenuSubProps = NoCustomStyle &
  Pick<BaseMenu.SubmenuRoot.Props, 'open' | 'defaultOpen' | 'onOpenChange' | 'disabled'> & {
    children: ReactNode;
  };
export function MenuSub(props: MenuSubProps) {
  return <BaseMenu.SubmenuRoot {...safeProps(props)} />;
}
export type MenuSubTriggerProps = ElementProps<'div'> &
  Pick<BaseMenu.SubmenuTrigger.Props, 'disabled' | 'label'>;
export function MenuSubTrigger({ children, ...props }: MenuSubTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger {...safeProps(props)} className="ns-menu-item ns-menu-sub-trigger">
      {children}
      <span aria-hidden="true">›</span>
    </BaseMenu.SubmenuTrigger>
  );
}
export type MenuSubContentProps = MenuContentProps;
export function MenuSubContent({ side = 'right', align = 'start', ...props }: MenuSubContentProps) {
  return <MenuContent {...props} side={side} align={align} />;
}
