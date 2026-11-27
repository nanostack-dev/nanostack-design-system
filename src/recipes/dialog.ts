import { cn } from '@/lib/utils';

export type DialogSize = 'md' | 'lg' | 'xl';

const sizeClass: Record<DialogSize, string> = {
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export const dialogOverlayClass =
  'fixed inset-0 isolate z-50 bg-foreground/30 supports-backdrop-filter:backdrop-blur-sm dark:bg-background/60';

export function dialogPopupStyles({ size = 'md' }: { size?: DialogSize } = {}) {
  return cn(
    'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-4xl bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none dark:ring-foreground/10',
    sizeClass[size],
  );
}

export const dialogBodyClass = 'grid gap-6 p-6';
export const dialogHeaderClass = 'flex flex-col gap-1.5';
export const dialogFooterClass = 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end';
export const dialogTitleClass = 'font-heading text-base leading-none font-medium';
export const dialogDescriptionClass =
  'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground';
