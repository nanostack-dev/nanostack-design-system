import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const sidebarMenuButtonClasses = cva(
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-9 text-sm',
        // In the rail a large button is exactly its 32 px content (a brand
        // tile, an avatar): the data-size attribute outranks the base p-2!,
        // and nothing is clipped by the button's own radius.
        lg: 'h-14 px-3 text-sm group-data-[collapsible=icon]:data-[size=lg]:overflow-visible group-data-[collapsible=icon]:data-[size=lg]:p-0!',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export function sidebarMenuButtonStyles(options: Parameters<typeof sidebarMenuButtonClasses>[0]) {
  return cn(sidebarMenuButtonClasses(options));
}
