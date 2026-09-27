'use client';
import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactNode } from 'react';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import type { ButtonProps } from './button.js';

export type PopoverProps = NoCustomStyle &
  Pick<BasePopover.Root.Props, 'open' | 'defaultOpen' | 'onOpenChange'> & { children: ReactNode };
export function Popover(props: PopoverProps) {
  return <BasePopover.Root {...safeProps(props)} />;
}
export type PopoverTriggerProps = ButtonProps;
export function PopoverTrigger({
  variant = 'ghost',
  size = 'md',
  type = 'button',
  ...props
}: PopoverTriggerProps) {
  return (
    <BasePopover.Trigger
      {...safeProps(props)}
      nativeButton
      type={type}
      className="ns-button"
      data-variant={variant}
      data-size={size}
    />
  );
}
export type PopoverContentProps = ElementProps<'div'> & {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
};
export function PopoverContent({
  align = 'start',
  side = 'bottom',
  ...props
}: PopoverContentProps) {
  const theme = useThemeSettings();
  return (
    <BasePopover.Portal>
      <Theme {...theme}>
        <BasePopover.Positioner
          align={align}
          side={side}
          sideOffset={8}
          className="ns-popover-positioner"
        >
          <BasePopover.Popup {...safeProps(props)} className="ns-popover-content" />
        </BasePopover.Positioner>
      </Theme>
    </BasePopover.Portal>
  );
}
export type PopoverTitleProps = ElementProps<'h2'>;
export function PopoverTitle(props: PopoverTitleProps) {
  return <BasePopover.Title {...safeProps(props)} className="ns-popover-title" />;
}
export type PopoverDescriptionProps = ElementProps<'p'>;
export function PopoverDescription(props: PopoverDescriptionProps) {
  return <BasePopover.Description {...safeProps(props)} className="ns-popover-description" />;
}
