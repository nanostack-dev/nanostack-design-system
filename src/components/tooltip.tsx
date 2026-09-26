'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import type { MenuTriggerProps } from './menu.js';

export type TooltipProviderProps = NoCustomStyle & { children: ReactNode };

/** Adjacent triggers share the library's delay policy. */
export function TooltipProvider({ children }: TooltipProviderProps) {
  return <BaseTooltip.Provider delay={500}>{children}</BaseTooltip.Provider>;
}

export type TooltipProps = NoCustomStyle &
  Pick<BaseTooltip.Root.Props, 'open' | 'defaultOpen' | 'onOpenChange' | 'disabled'> & {
    children: ReactNode;
  };

export function Tooltip(props: TooltipProps) {
  return <BaseTooltip.Root {...safeProps(props)} />;
}

export type TooltipTriggerProps = MenuTriggerProps & { 'aria-label': string };

/** The trigger owns its button, so disabled semantics and focus remain predictable. */
export function TooltipTrigger({
  variant = 'ghost',
  size = 'md',
  disabled,
  ...props
}: TooltipTriggerProps) {
  return (
    <BaseTooltip.Trigger
      {...safeProps(props)}
      disabled={disabled}
      delay={500}
      render={<button type="button" disabled={disabled} />}
      className="ns-button"
      data-variant={variant}
      data-size={size}
    />
  );
}

export type TooltipContentProps = ElementProps<'div'> & {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
};

/** A visual label only: essential explanations belong in inline content or a popover. */
export function TooltipContent({ align = 'center', side = 'top', ...props }: TooltipContentProps) {
  const theme = useThemeSettings();
  return (
    <BaseTooltip.Portal>
      <Theme {...theme}>
        <BaseTooltip.Positioner
          align={align}
          side={side}
          sideOffset={6}
          className="ns-tooltip-positioner"
        >
          <BaseTooltip.Popup {...safeProps(props)} className="ns-tooltip-content" />
        </BaseTooltip.Positioner>
      </Theme>
    </BaseTooltip.Portal>
  );
}
