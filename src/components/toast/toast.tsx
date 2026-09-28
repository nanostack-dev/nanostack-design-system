import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { MouseEventHandler, ReactNode } from 'react';

import { buttonStyles } from '@/components/button/button';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastActionOptions = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  'aria-label'?: string;
};

export type ToastOptions = {
  id?: string;
  type?: ToastType;
  title?: ReactNode;
  description?: ReactNode;
  timeout?: number;
  priority?: 'low' | 'high';
  actionProps?: ToastActionOptions;
  onClose?: () => void;
  onRemove?: () => void;
};

export type ToastUpdateOptions = Omit<ToastOptions, 'id'>;

export type ToastPromiseOptions<Value> = {
  loading: string | ToastUpdateOptions;
  success: string | ToastUpdateOptions | ((result: Value) => string | ToastUpdateOptions);
  error: string | ToastUpdateOptions | ((error: unknown) => string | ToastUpdateOptions);
};

export type ToastManager = {
  add: (options: ToastOptions) => string;
  close: (id?: string) => void;
  update: (id: string, options: ToastUpdateOptions) => void;
  promise: <Value>(promise: Promise<Value>, options: ToastPromiseOptions<Value>) => Promise<Value>;
};

export type ToasterProps = {
  children?: ReactNode;
  timeout?: number;
  limit?: number;
};

const toastManager = ToastPrimitive.createToastManager();

export const toast: ToastManager = toastManager;

type ToastTone = 'neutral' | 'critical' | 'success' | 'warning' | 'info';

const toneOfType: Record<ToastType, ToastTone> = {
  success: 'success',
  error: 'critical',
  warning: 'warning',
  info: 'info',
  loading: 'neutral',
};

const iconOfType: Record<ToastType, Icon> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
  loading: SpinnerIcon,
};

const toastIconClasses = cva('flex shrink-0 [&_svg]:pointer-events-none [&_svg]:size-4', {
  variants: {
    tone: {
      neutral: 'text-muted-foreground',
      critical: 'text-destructive-on-tint',
      success: 'text-success-on-tint',
      warning: 'text-warning-on-tint',
      info: 'text-info-on-tint',
    },
  },
});

function isToastType(type: string | undefined): type is ToastType {
  return type !== undefined && type in toneOfType;
}

function ToastIcon({ type }: { type: string | undefined }) {
  if (!isToastType(type)) return null;
  const IconComponent = iconOfType[type];
  const tone = toneOfType[type];
  return (
    <span
      data-slot="toast-icon"
      data-type={type}
      data-tone={tone}
      className={toastIconClasses({ tone })}
    >
      <IconComponent aria-hidden className={type === 'loading' ? 'animate-spin' : undefined} />
    </span>
  );
}

const toastRootClasses = cn(
  'group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  '[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
  'h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]',
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
  'data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
  'data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]',
  '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
  'data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
  'data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
  'data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
  'data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
  'data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
  'data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
  'data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
  'data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
);

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((toastItem) => (
    <ToastPrimitive.Root
      key={toastItem.id}
      toast={toastItem}
      data-slot="toast"
      className={toastRootClasses}
    >
      <ToastPrimitive.Content
        data-slot="toast-content"
        className="flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100"
      >
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastPrimitive.Title data-slot="toast-title" className="text-sm font-medium" />
          <ToastPrimitive.Description
            data-slot="toast-description"
            className="text-sm text-muted-foreground"
          />
        </div>
        <ToastPrimitive.Action
          data-slot="toast-action"
          className={cn(buttonStyles({ variant: 'outline', size: 'sm' }), 'shrink-0')}
        />
        <ToastPrimitive.Close
          data-slot="toast-close"
          aria-label="Close toast"
          className={cn(
            buttonStyles({ variant: 'ghost', size: 'sm', iconOnly: true }),
            "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
          )}
        >
          <XIcon aria-hidden />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ));
}

export function Toaster({ children, timeout, limit }: ToasterProps) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} timeout={timeout} limit={limit}>
      {children}
      <ToastPrimitive.Portal data-slot="toast-portal">
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          className="pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full"
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
