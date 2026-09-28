import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type TabsSize = 'sm' | 'md';
export type TabsWidth = 'auto' | 'fill';

export type TabsProps = ClosedProps<Omit<TabsPrimitive.Root.Props, 'render'>>;

export type TabsListProps = ClosedProps<Omit<TabsPrimitive.List.Props, 'render'>> & {
  size?: TabsSize;
  width?: TabsWidth;
};

export type TabsTriggerProps = ClosedProps<Omit<TabsPrimitive.Tab.Props, 'render'>>;

export type TabsContentProps = ClosedProps<Omit<TabsPrimitive.Panel.Props, 'render'>>;

export function Tabs({ orientation = 'horizontal', ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className="group/tabs flex min-h-0 gap-2 data-horizontal:flex-col"
      {...props}
    />
  );
}

const listSizeClass: Record<TabsSize, string> = {
  sm: 'group-data-horizontal/tabs:h-8 p-0.5',
  md: 'group-data-horizontal/tabs:h-9 p-1',
};

const listWidthClass: Record<TabsWidth, string> = {
  auto: 'w-fit',
  fill: 'w-full min-w-0',
};

export function TabsList({ size = 'md', width = 'auto', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-size={size}
      data-width={width}
      className={cn(
        'group/tabs-list inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:rounded-2xl',
        listSizeClass[size],
        listWidthClass[width],
      )}
      {...props}
    />
  );
}

export function TabsTrigger(props: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-transparent! px-3 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:rounded-2xl group-data-vertical/tabs:px-3 group-data-vertical/tabs:py-1.5 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'group-data-[size=sm]/tabs-list:gap-1.5 group-data-[size=sm]/tabs-list:px-2 group-data-[size=sm]/tabs-list:text-xs',
        'data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground',
      )}
      {...props}
    />
  );
}

export function TabsContent(props: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className="min-h-0 flex-1 text-sm outline-none"
      {...props}
    />
  );
}
