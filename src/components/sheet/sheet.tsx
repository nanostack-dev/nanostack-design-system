import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import type * as React from 'react';

import { buttonStyles } from '@/components/button/button';
import { OverlayScrollBody } from '@/components/dialog/dialog';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl';

export type SheetProps = SheetPrimitive.Root.Props;
export type SheetTriggerProps = ClosedProps<SheetPrimitive.Trigger.Props>;
export type SheetCloseProps = ClosedProps<SheetPrimitive.Close.Props>;
export type SheetContentProps = ClosedProps<Omit<SheetPrimitive.Popup.Props, 'render'>> & {
  side?: SheetSide;
  size?: SheetSize;
  showCloseButton?: boolean;
};
export type SheetHeaderProps = ClosedProps<React.ComponentProps<'div'>> & {
  visuallyHidden?: boolean;
};
export type SheetFooterProps = ClosedProps<React.ComponentProps<'div'>>;
export type SheetTitleProps = ClosedProps<Omit<SheetPrimitive.Title.Props, 'render'>>;
export type SheetDescriptionProps = ClosedProps<Omit<SheetPrimitive.Description.Props, 'render'>>;

const sideWidthClass: Record<SheetSize, string> = {
  sm: 'sm:max-w-xs',
  md: 'sm:max-w-sm',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-none sm:data-[side=left]:w-[min(100vw,clamp(52rem,65vw,84rem))] sm:data-[side=right]:w-[min(100vw,clamp(52rem,65vw,84rem))]',
};

function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetCloseProps) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay() {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className="fixed inset-0 z-50 bg-foreground/30 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm dark:bg-background/60"
    />
  );
}

function SheetContent({
  children,
  side = 'right',
  size = 'md',
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  const vertical = side === 'left' || side === 'right';
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden bg-popover bg-clip-padding text-sm text-popover-foreground shadow-xl transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-[90dvh] data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-h-[90dvh] data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]',
          vertical && sideWidthClass[size],
        )}
        {...props}
      >
        <OverlayScrollBody
          slot="sheet-body"
          viewportClassName="flex flex-1 flex-col"
          contentClassName="flex flex-1 flex-col"
        >
          {children}
        </OverlayScrollBody>
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            aria-label="Close"
            className={cn(
              buttonStyles({ variant: 'soft', tone: 'neutral', size: 'sm', iconOnly: true }),
              'absolute top-4 right-4',
            )}
          >
            <XIcon aria-hidden />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ visuallyHidden = false, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={visuallyHidden ? 'sr-only' : 'flex flex-col gap-1.5 p-6'}
      {...props}
    />
  );
}

function SheetFooter({ ...props }: SheetFooterProps) {
  return <div data-slot="sheet-footer" className="mt-auto flex flex-col gap-2 p-6" {...props} />;
}

function SheetTitle({ ...props }: SheetTitleProps) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className="font-heading text-base font-medium text-foreground"
      {...props}
    />
  );
}

function SheetDescription({ ...props }: SheetDescriptionProps) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className="text-sm text-muted-foreground"
      {...props}
    />
  );
}

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
