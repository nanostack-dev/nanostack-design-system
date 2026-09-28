import type { ComponentProps } from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export type NavigationMenuProps = ComponentProps<typeof NavigationMenu>;
export type NavigationMenuListProps = ComponentProps<typeof NavigationMenuList>;
export type NavigationMenuItemProps = ComponentProps<typeof NavigationMenuItem>;
export type NavigationMenuTriggerProps = ComponentProps<typeof NavigationMenuTrigger>;
export type NavigationMenuContentProps = ComponentProps<typeof NavigationMenuContent>;
export type NavigationMenuLinkProps = ComponentProps<typeof NavigationMenuLink>;
export type NavigationMenuIndicatorProps = ComponentProps<typeof NavigationMenuIndicator>;
export type NavigationMenuPositionerProps = ComponentProps<typeof NavigationMenuPositioner>;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
};
