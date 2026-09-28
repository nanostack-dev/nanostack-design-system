import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { buttonStyles } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type DialogSize = 'md' | 'lg' | 'xl';

export type DialogProps = DialogPrimitive.Root.Props;
export type DialogTriggerProps = ClosedProps<DialogPrimitive.Trigger.Props>;
export type DialogCloseProps = ClosedProps<DialogPrimitive.Close.Props>;
export type DialogContentProps = ClosedProps<Omit<DialogPrimitive.Popup.Props, 'render'>> & {
  size?: DialogSize;
  showCloseButton?: boolean;
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

const sizeClass: Record<DialogSize, string> = {
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay() {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className="fixed inset-0 isolate z-50 bg-foreground/30 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 dark:bg-background/60"
    />
  );
}

function DialogContent({
  children,
  size = 'md',
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-4xl bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          sizeClass[size],
        )}
        {...props}
      >
        <OverlayScrollBody
          slot="dialog-body"
          viewportClassName="rounded-[inherit]"
          contentClassName="grid gap-6 p-6"
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

function DialogHeader({ visuallyHidden = false, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={visuallyHidden ? 'sr-only' : 'flex flex-col gap-1.5'}
      {...props}
    />
  );
}

function DialogFooter({ showCloseButton = false, children, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
      {...props}
    >
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
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className="font-heading text-base leading-none font-medium"
      {...props}
    />
  );
}

function DialogDescription({ ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className="text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground"
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
