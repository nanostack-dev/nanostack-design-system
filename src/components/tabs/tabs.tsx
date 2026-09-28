import type { ComponentProps } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from '@/components/ui/tabs';

export type TabsProps = ComponentProps<typeof Tabs>;
export type TabsListProps = ComponentProps<typeof TabsList>;
export type TabsListVariant = NonNullable<TabsListProps['variant']>;
export type TabsTriggerProps = ComponentProps<typeof TabsTrigger>;
export type TabsContentProps = ComponentProps<typeof TabsContent>;

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
