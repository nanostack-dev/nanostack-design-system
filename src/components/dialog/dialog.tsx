import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { buttonStyles } from '@/components/button/button';
import { useMaterialAttributes } from '@/lib/material';
import { useMotionAttributes, useMotionInput } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import {
  dialogBodyClass,
  dialogDescriptionClass,
  dialogFooterClass,
  dialogHeaderClass,
  dialogOverlayClass,
  dialogPopupStyles,
  dialogTitleClass,
  type DialogSize,
} from '@/recipes/dialog';

export type { DialogSize };

export type DialogProps = DialogPrimitive.Root.Props;
export type DialogTriggerProps = ClosedProps<DialogPrimitive.Trigger.Props>;
export type DialogCloseProps = ClosedProps<DialogPrimitive.Close.Props>;
export type DialogContentProps = ClosedProps<Omit<DialogPrimitive.Popup.Props, 'render'>> & {
  size?: DialogSize;
  showCloseButton?: boolean;
};
export type DialogPaletteSize = 'md' | 'lg';
type DialogPaletteContentProps = ClosedProps<DialogPrimitive.Popup.Props> & {
  size?: DialogPaletteSize;
};

export type DialogHeaderProps = ClosedProps<ComponentProps<'div'>> & {
  visuallyHidden?: boolean;
};
export type DialogFooterProps = ClosedProps<ComponentProps<'div'>> & {
  showCloseButton?: boolean;
};
export type DialogTitleProps = ClosedProps<Omit<DialogPrimitive.Title.Props, 'render'>>;
export type DialogDescriptionProps = ClosedProps<Omit<DialogPrimitive.Description.Props, 'render'>>;

type OverlayScrollBodyProps = {
  slot: string;
  viewportClassName: string;
  contentClassName: string;
  children: ReactNode;
};

export function OverlayScrollBody({
  slot,
  viewportClassName,
  contentClassName,
  children,
}: OverlayScrollBodyProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const measure = () => setOverflowing(viewport.scrollHeight > viewport.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      data-slot={slot}
      tabIndex={overflowing ? 0 : undefined}
      className={cn(
        'min-h-0 overflow-y-auto overscroll-contain outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset',
        viewportClassName,
      )}
    >
      <div ref={contentRef} className={contentClassName}>
        {children}
      </div>
    </div>
  );
}

function Dialog({ ...props }: DialogProps) {
  useMotionInput();
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogCloseProps) {
  const motion = useMotionAttributes();
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} {...motion} />;
}

function DialogOverlay({ animated = true }: { animated?: boolean }) {
  const motion = useMotionAttributes();
  const material = useMaterialAttributes();
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      data-palette={!animated || undefined}
      className={dialogOverlayClass}
      {...motion}
      {...material}
    />
  );
}

function DialogContent({
  children,
  size = 'md',
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  const motion = useMotionAttributes();
  const material = useMaterialAttributes();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        className={dialogPopupStyles({ size })}
        {...props}
        {...motion}
        {...material}
      >
        <OverlayScrollBody
          slot="dialog-body"
          viewportClassName="rounded-[inherit]"
          contentClassName={dialogBodyClass}
        >
          {children}
        </OverlayScrollBody>
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label="Close"
            className={cn(
              buttonStyles({ variant: 'soft', tone: 'neutral', size: 'sm', iconOnly: true }),
              'absolute top-4 right-4',
            )}
          >
            <XIcon aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

// A palette opens many times a day from the keyboard, so it neither fades nor zooms.
const paletteContentClasses = cva(
  'fixed left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 flex-col overflow-hidden bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none dark:ring-foreground/10',
  {
    variants: {
      size: {
        md: 'top-1/3 rounded-4xl sm:max-w-md',
        lg: 'top-4 max-h-[calc(100dvh-2rem)] rounded-3xl sm:top-[12vh] sm:max-w-[46rem]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export function DialogPaletteContent({ children, size, ...props }: DialogPaletteContentProps) {
  const motion = useMotionAttributes();
  const material = useMaterialAttributes();
  return (
    <DialogPortal>
      <DialogOverlay animated={false} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size ?? 'md'}
        data-palette
        className={paletteContentClasses({ size })}
        {...props}
        {...motion}
        {...material}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ visuallyHidden = false, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={visuallyHidden ? 'sr-only' : dialogHeaderClass}
      {...props}
    />
  );
}

function DialogFooter({ showCloseButton = false, children, ...props }: DialogFooterProps) {
  return (
    <div data-slot="dialog-footer" className={dialogFooterClass} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className={buttonStyles({ variant: 'outline' })}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ ...props }: DialogTitleProps) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={dialogTitleClass} {...props} />;
}

function DialogDescription({ ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={dialogDescriptionClass}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
