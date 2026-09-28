import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { CaretDownIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import {
  createContext,
  createElement,
  useContext,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent } from '@/provider/design-system-provider';

export type NavigationMenuAlign = NonNullable<NavigationMenuPrimitive.Positioner.Props['align']>;

const InsideContentContext = createContext(false);

export type NavigationMenuProps = ClosedProps<
  Omit<NavigationMenuPrimitive.Root.Props, 'render'>
> & {
  align?: NavigationMenuAlign;
};

export function NavigationMenu({ align = 'start', children, ...props }: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center"
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

export type NavigationMenuListProps = ClosedProps<
  Omit<ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>, 'render'>
>;

export function NavigationMenuList(props: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className="group flex flex-1 list-none items-center justify-center gap-0"
      {...props}
    />
  );
}

export type NavigationMenuItemProps = ClosedProps<
  Omit<ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>, 'render'>
>;

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className="relative"
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  'group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-3xl px-4.5 py-2.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted',
);

export type NavigationMenuTriggerProps = ClosedProps<NavigationMenuPrimitive.Trigger.Props>;

export function NavigationMenuTrigger({ children, ...props }: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group')}
      {...props}
    >
      {children}{' '}
      <CaretDownIcon
        className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

export type NavigationMenuContentProps = ClosedProps<
  Omit<NavigationMenuPrimitive.Content.Props, 'render'>
>;

export function NavigationMenuContent({ children, ...props }: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className="data-ending-style:data-activation-direction=left:translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] h-full w-auto p-2.5 pr-3 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:rounded-3xl group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-lg group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/5 group-data-[viewport=false]/navigation-menu:duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:dark:ring-foreground/10 group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95"
      {...props}
    >
      <InsideContentContext.Provider value>{children}</InsideContentContext.Provider>
    </NavigationMenuPrimitive.Content>
  );
}

function NavigationMenuPositioner({ align }: { align: NavigationMenuAlign }) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side="bottom"
        sideOffset={8}
        align={align}
        alignOffset={0}
        className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0"
      >
        <NavigationMenuPrimitive.Popup className="data-[ending-style]:easing-[ease] xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0 dark:ring-foreground/10">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

const navigationMenuLinkClasses =
  "flex items-center gap-1.5 rounded-3xl p-3 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-2xl data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4";

export type NavigationMenuLinkProps = ClosedProps<
  Omit<NavigationMenuPrimitive.Link.Props, 'render' | 'href'>
> & {
  href: string;
  description?: ReactNode;
};

export function NavigationMenuLink({
  href,
  description,
  children,
  ...props
}: NavigationMenuLinkProps) {
  const insideContent = useContext(InsideContentContext);
  const linkComponent = useLinkComponent();
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        navigationMenuLinkClasses,
        !insideContent && navigationMenuTriggerStyle(),
        description !== undefined && 'flex-col items-start',
      )}
      render={createElement(linkComponent, { href })}
      {...props}
    >
      {description === undefined ? (
        children
      ) : (
        <>
          <span className="font-medium">{children}</span>
          <span className="text-muted-foreground">{description}</span>
        </>
      )}
    </NavigationMenuPrimitive.Link>
  );
}

export type NavigationMenuIndicatorProps = ClosedProps<
  Omit<ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>, 'render'>
>;

export function NavigationMenuIndicator(props: NavigationMenuIndicatorProps) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className="top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in"
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Icon>
  );
}
