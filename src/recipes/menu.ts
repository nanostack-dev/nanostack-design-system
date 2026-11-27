import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const menuPositionerClass = 'isolate z-50 outline-none';

const menuPopupClasses = cva(
  'z-50 max-h-(--available-height) max-w-(--available-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10 data-closed:overflow-hidden',
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

export function menuPopupStyles(options: Parameters<typeof menuPopupClasses>[0]) {
  return cn(menuPopupClasses(options));
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

export function menuItemStyles(options: Parameters<typeof menuItemClasses>[0]) {
  return cn(menuItemClasses(options));
}
