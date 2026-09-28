import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { mergeProps } from '@base-ui/react/merge-props';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { useRender } from '@base-ui/react/use-render';
import { SidebarIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { IconButton, type IconButtonProps } from '@/components/button/button';
import { Input, type InputProps } from '@/components/input/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

export type SidebarSide = 'left' | 'right';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
export type SidebarMaterial = 'solid' | 'frosted';
export type SidebarWidth = 'md' | 'lg';
export type SidebarIconWidth = 'md' | 'lg';
export type SidebarMenuButtonSize = 'sm' | 'md' | 'lg';
export type SidebarMenuSubButtonSize = 'sm' | 'md';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

const sidebarWidthValue: Record<SidebarWidth, string> = { md: '16rem', lg: '17rem' };
const sidebarIconWidthValue: Record<SidebarIconWidth, string> = { md: '3rem', lg: '3.75rem' };

const materialClass: Record<SidebarMaterial, string> = {
  solid: 'bg-sidebar',
  frosted:
    'bg-sidebar/82 backdrop-blur-xl backdrop-saturate-180 [@media(prefers-reduced-transparency:reduce)]:bg-sidebar [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none [@media(prefers-reduced-transparency:reduce)]:backdrop-saturate-100',
};

type DivProps = ClosedProps<React.ComponentPropsWithRef<'div'>>;
type RenderButtonProps = ClosedProps<useRender.ComponentProps<'button'>>;

export type SidebarContextValue = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export type SidebarProviderProps = DivProps & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: SidebarWidth;
  iconWidth?: SidebarIconWidth;
};
export type SidebarProps = DivProps & {
  side?: SidebarSide;
  collapsible?: SidebarCollapsible;
  material?: SidebarMaterial;
};
export type SidebarTriggerProps = Omit<
  IconButtonProps,
  'icon' | 'label' | 'tooltip' | 'pressed'
> & {
  label?: string;
};
export type SidebarRailProps = ClosedProps<
  Omit<React.ComponentPropsWithRef<'button'>, 'children'>
> & {
  label?: string;
};
export type SidebarInsetProps = ClosedProps<React.ComponentPropsWithRef<'main'>>;
export type SidebarInputProps = Omit<InputProps, 'size' | 'variant'>;
export type SidebarHeaderProps = DivProps;
export type SidebarFooterProps = DivProps;
export type SidebarSeparatorProps = ClosedProps<
  Omit<SeparatorPrimitive.Props, 'render' | 'orientation'>
>;
export type SidebarContentProps = DivProps;
export type SidebarGroupProps = DivProps;
export type SidebarGroupLabelProps = DivProps;
export type SidebarGroupActionProps = RenderButtonProps;
export type SidebarGroupContentProps = DivProps;
export type SidebarMenuProps = ClosedProps<React.ComponentPropsWithRef<'ul'>>;
export type SidebarMenuItemProps = ClosedProps<React.ComponentPropsWithRef<'li'>>;
export type SidebarMenuButtonProps = RenderButtonProps & {
  href?: string;
  isActive?: boolean;
  size?: SidebarMenuButtonSize;
  tooltip?: string;
};
export type SidebarMenuActionProps = RenderButtonProps & {
  showOnHover?: boolean;
};
export type SidebarMenuBadgeProps = DivProps;
export type SidebarMenuSkeletonProps = Omit<DivProps, 'children'> & {
  showIcon?: boolean;
};
export type SidebarMenuSubProps = ClosedProps<React.ComponentPropsWithRef<'ul'>>;
export type SidebarMenuSubItemProps = ClosedProps<React.ComponentPropsWithRef<'li'>>;
export type SidebarMenuSubButtonProps = ClosedProps<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'color'>
> & {
  href: string;
  size?: SidebarMenuSubButtonSize;
  isActive?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  width = 'md',
  iconWidth = 'md',
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        setUncontrolledOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((current) => !current) : setOpen((current) => !current);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        data-width={width}
        data-icon-width={iconWidth}
        style={
          {
            '--sidebar-width': sidebarWidthValue[width],
            '--sidebar-width-icon': sidebarIconWidthValue[iconWidth],
          } as React.CSSProperties
        }
        className="group/sidebar-wrapper flex min-h-svh w-full"
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = 'left',
  collapsible = 'offcanvas',
  material = 'solid',
  children,
  dir,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        data-material={material}
        className={cn(
          'flex h-full w-(--sidebar-width) flex-col text-sidebar-foreground',
          materialClass[material],
        )}
        dir={dir}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <SheetPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
        <SheetPrimitive.Portal>
          <SheetPrimitive.Backdrop
            data-slot="sidebar-overlay"
            className="fixed inset-0 z-50 bg-foreground/30 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-background/60"
          />
          <SheetPrimitive.Popup
            dir={dir}
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            data-side={side}
            data-material={material}
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
            className={cn(
              'fixed inset-y-0 z-50 flex h-full w-(--sidebar-width) flex-col p-0 text-sidebar-foreground shadow-xl transition duration-200 ease-in-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=left]:left-0 data-[side=left]:border-r data-[side=left]:data-ending-style:-translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 data-[side=right]:right-0 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10',
              materialClass[material],
            )}
          >
            <SheetPrimitive.Title className="sr-only">Sidebar</SheetPrimitive.Title>
            <SheetPrimitive.Description className="sr-only">
              Displays the mobile sidebar.
            </SheetPrimitive.Description>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetPrimitive.Popup>
        </SheetPrimitive.Portal>
      </SheetPrimitive.Root>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-material={material}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180"
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        dir={dir}
        className="fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex"
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn('flex size-full flex-col', materialClass[material])}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ label = 'Toggle Sidebar', onClick, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <IconButton
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="sm"
      icon={SidebarIcon}
      label={label}
      tooltip={false}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    />
  );
}

function SidebarRail({ label = 'Toggle Sidebar', ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label={label}
      tabIndex={-1}
      onClick={toggleSidebar}
      title={label}
      className="absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2"
      {...props}
    />
  );
}

function SidebarInset(props: SidebarInsetProps) {
  return (
    <main
      data-slot="sidebar-inset"
      className="relative flex w-full min-w-0 flex-1 flex-col bg-background"
      {...props}
    />
  );
}

function SidebarInput(props: SidebarInputProps) {
  return <Input data-slot="sidebar-input" data-sidebar="input" size="sm" {...props} />;
}

function SidebarHeader(props: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className="flex flex-col gap-2 p-2 [--radius:var(--radius-xl)]"
      {...props}
    />
  );
}

function SidebarFooter(props: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className="flex flex-col gap-2 p-2"
      {...props}
    />
  );
}

function SidebarSeparator(props: SidebarSeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="sidebar-separator"
      data-sidebar="separator"
      orientation="horizontal"
      className="mx-2 h-px w-auto shrink-0 bg-sidebar-border"
      {...props}
    />
  );
}

function SidebarContent(props: SidebarContentProps) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto [--radius:var(--radius-xl)] group-data-[collapsible=icon]:overflow-hidden"
      {...props}
    />
  );
}

function SidebarGroup(props: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className="relative flex w-full min-w-0 flex-col p-2"
      {...props}
    />
  );
}

function SidebarGroupLabel(props: SidebarGroupLabelProps) {
  return (
    <div
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className="flex h-8 shrink-0 items-center rounded-xl px-3 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0"
      {...props}
    />
  );
}

function SidebarGroupAction({ render, ...props }: SidebarGroupActionProps) {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className:
          'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-xl p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
      },
      props,
    ),
    render,
    state: { slot: 'sidebar-group-action', sidebar: 'group-action' },
  });
}

function SidebarGroupContent(props: SidebarGroupContentProps) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className="w-full text-sm"
      {...props}
    />
  );
}

function SidebarMenu(props: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className="flex w-full min-w-0 flex-col gap-0.5"
      {...props}
    />
  );
}

function SidebarMenuItem(props: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className="group/menu-item relative"
      {...props}
    />
  );
}

const sidebarMenuButtonClasses = cva(
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-9 text-sm',
        lg: 'h-14 px-3 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

function SidebarMenuButton({
  render,
  href,
  isActive = false,
  size = 'md',
  tooltip,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar();
  const linkComponent = useLinkComponent();
  const target =
    render ?? (href === undefined ? undefined : React.createElement(linkComponent, { href }));
  const element = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>({ className: sidebarMenuButtonClasses({ size }) }, props),
    render: tooltip ? <TooltipTrigger render={target} /> : target,
    state: { slot: 'sidebar-menu-button', sidebar: 'menu-button', size, active: isActive },
  });

  if (!tooltip) return element;

  return (
    <Tooltip>
      {element}
      <TooltipContent side="right" align="center" hidden={state !== 'collapsed' || isMobile}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarMenuAction({ render, showOnHover = false, ...props }: SidebarMenuActionProps) {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-xl p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=md]/menu-button:top-2 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
          showOnHover &&
            'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
        ),
      },
      props,
    ),
    render,
    state: { slot: 'sidebar-menu-action', sidebar: 'menu-action' },
  });
}

function SidebarMenuBadge(props: SidebarMenuBadgeProps) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className="pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-xl px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=md]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground"
      {...props}
    />
  );
}

function SidebarMenuSkeleton({ showIcon = false, ...props }: SidebarMenuSkeletonProps) {
  const [width] = React.useState(() => `${Math.floor(Math.random() * 40) + 50}%`);
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      aria-hidden
      className="flex h-8 items-center gap-2 rounded-xl px-2"
      {...props}
    >
      {showIcon && (
        <div
          data-sidebar="menu-skeleton-icon"
          className="size-4 shrink-0 animate-pulse rounded-xl bg-muted motion-reduce:animate-none"
        />
      )}
      <div
        data-sidebar="menu-skeleton-text"
        className="h-4 max-w-(--skeleton-width) flex-1 animate-pulse rounded-full bg-muted motion-reduce:animate-none"
        style={{ '--skeleton-width': width } as React.CSSProperties}
      />
    </div>
  );
}

function SidebarMenuSub(props: SidebarMenuSubProps) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden"
      {...props}
    />
  );
}

function SidebarMenuSubItem(props: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className="group/menu-sub-item relative"
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  size = 'md',
  isActive = false,
  ...props
}: SidebarMenuSubButtonProps) {
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & Record<`data-${string}`, string | undefined> = {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    'data-size': size,
    'data-active': isActive ? '' : undefined,
    className:
      'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-xl px-3 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
    ...props,
  };
  return React.createElement(linkComponent, linkProps);
}

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
