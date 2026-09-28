import type { ComponentProps } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export type SidebarProviderProps = ComponentProps<typeof SidebarProvider>;
export type SidebarProps = ComponentProps<typeof Sidebar>;
export type SidebarSide = NonNullable<SidebarProps['side']>;
export type SidebarVariant = NonNullable<SidebarProps['variant']>;
export type SidebarCollapsible = NonNullable<SidebarProps['collapsible']>;
export type SidebarTriggerProps = ComponentProps<typeof SidebarTrigger>;
export type SidebarRailProps = ComponentProps<typeof SidebarRail>;
export type SidebarInsetProps = ComponentProps<typeof SidebarInset>;
export type SidebarInputProps = ComponentProps<typeof SidebarInput>;
export type SidebarHeaderProps = ComponentProps<typeof SidebarHeader>;
export type SidebarFooterProps = ComponentProps<typeof SidebarFooter>;
export type SidebarSeparatorProps = ComponentProps<typeof SidebarSeparator>;
export type SidebarContentProps = ComponentProps<typeof SidebarContent>;
export type SidebarGroupProps = ComponentProps<typeof SidebarGroup>;
export type SidebarGroupLabelProps = ComponentProps<typeof SidebarGroupLabel>;
export type SidebarGroupActionProps = ComponentProps<typeof SidebarGroupAction>;
export type SidebarGroupContentProps = ComponentProps<typeof SidebarGroupContent>;
export type SidebarMenuProps = ComponentProps<typeof SidebarMenu>;
export type SidebarMenuItemProps = ComponentProps<typeof SidebarMenuItem>;
export type SidebarMenuButtonProps = ComponentProps<typeof SidebarMenuButton>;
export type SidebarMenuActionProps = ComponentProps<typeof SidebarMenuAction>;
export type SidebarMenuBadgeProps = ComponentProps<typeof SidebarMenuBadge>;
export type SidebarMenuSkeletonProps = ComponentProps<typeof SidebarMenuSkeleton>;
export type SidebarMenuSubProps = ComponentProps<typeof SidebarMenuSub>;
export type SidebarMenuSubItemProps = ComponentProps<typeof SidebarMenuSubItem>;
export type SidebarMenuSubButtonProps = ComponentProps<typeof SidebarMenuSubButton>;
export type SidebarContextValue = ReturnType<typeof useSidebar>;

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useIsMobile,
  useSidebar,
};
