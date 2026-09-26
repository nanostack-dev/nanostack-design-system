'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { safeProps, type ElementProps } from '../internal/props.js';

export type TabsProps = Omit<ElementProps<'div'>, 'defaultValue'> & {
  height?: 'content' | 'fill';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
/** String IDs make tab state serializable and preserve a narrow public contract. */
export function Tabs({ onValueChange, height = 'content', ...props }: TabsProps) {
  return (
    <BaseTabs.Root
      {...safeProps(props)}
      onValueChange={(value: unknown) => {
        if (typeof value === 'string') onValueChange?.(value);
      }}
      orientation="horizontal"
      className="ns-tabs"
      data-height={height}
    />
  );
}

export type TabsListProps = ElementProps<'div'> & { 'aria-label': string };
export function TabsList(props: TabsListProps) {
  return <BaseTabs.List {...safeProps(props)} activateOnFocus className="ns-tabs-list" />;
}

export type TabsTabProps = Omit<ElementProps<'button'>, 'value'> & { value: string };
export function TabsTab(props: TabsTabProps) {
  return <BaseTabs.Tab {...safeProps(props)} nativeButton className="ns-tabs-tab" />;
}

export type TabsPanelProps = ElementProps<'div'> & { value: string };
export function TabsPanel(props: TabsPanelProps) {
  return <BaseTabs.Panel {...safeProps(props)} className="ns-tabs-panel" />;
}
