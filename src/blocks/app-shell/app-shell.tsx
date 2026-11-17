import type { Icon } from '@phosphor-icons/react';
import { createContext, useContext, useId, useLayoutEffect, useRef, type ReactNode } from 'react';

import { NanostackMark } from '@/blocks/nanostack-mark';
import { ScrollArea } from '@/components/scroll-area';
import { Separator } from '@/components/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
  type SidebarContentProps,
  type SidebarFooterProps,
  type SidebarHeaderProps,
  type SidebarIconWidth,
  type SidebarInsetProps,
  type SidebarMaterial,
  type SidebarWidth,
} from '@/components/sidebar';
import { Box } from '@/layout/box';
import { Inline } from '@/layout/inline';
import { useMaterialAttributes } from '@/lib/material';

export type AppShellSidebarWidth = SidebarWidth;
export type AppShellSidebarIconWidth = SidebarIconWidth;
export type AppShellSidebarMaterial = SidebarMaterial;

export interface AppShellProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sidebarWidth?: AppShellSidebarWidth;
  sidebarIconWidth?: AppShellSidebarIconWidth;
  skipLinkLabel?: string;
  mainId?: string;
}

export interface AppShellSidebarProps {
  children: ReactNode;
  /** Omitted, the sidebar follows the `DesignSystemProvider` material. */
  material?: AppShellSidebarMaterial;
}

export type AppShellSidebarHeaderProps = SidebarHeaderProps;
export type AppShellSidebarContentProps = SidebarContentProps;
export type AppShellSidebarFooterProps = SidebarFooterProps;

export interface AppShellNavProps {
  label?: string;
  children: ReactNode;
}

export interface AppShellNavItemProps {
  label: string;
  href: string;
  icon?: Icon;
  active?: boolean;
  badge?: ReactNode;
}

export type AppShellInsetProps = SidebarInsetProps;

export type AppShellHeaderSidebarTrigger = 'always' | 'mobile';

export interface AppShellHeaderProps {
  children?: ReactNode;
  actions?: ReactNode;
  /** `mobile` shows the sidebar trigger below the md breakpoint only. */
  sidebarTrigger?: AppShellHeaderSidebarTrigger;
}

export interface AppShellMainProps {
  children?: ReactNode;
}

export interface AppShellContentProps {
  children?: ReactNode;
}

export interface AppShellContextValue {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggle: () => void;
}

const defaultMainId = 'app-shell-main';

const MainIdContext = createContext(defaultMainId);

export function AppShell({
  children,
  defaultOpen,
  open,
  onOpenChange,
  sidebarWidth = 'md',
  sidebarIconWidth = 'md',
  skipLinkLabel,
  mainId = defaultMainId,
}: AppShellProps) {
  return (
    <MainIdContext.Provider value={mainId}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        width={sidebarWidth}
        iconWidth={sidebarIconWidth}
      >
        {skipLinkLabel ? (
          <a
            href={`#${mainId}`}
            onClick={(event) => {
              const main = document.getElementById(mainId);
              if (!main) return;
              event.preventDefault();
              main.focus();
            }}
            data-slot="app-shell-skip-link"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:h-9 focus:items-center focus:rounded-xl focus:border focus:border-border focus:bg-popover focus:px-3 focus:text-sm focus:font-medium focus:text-popover-foreground focus:shadow-lg focus:ring-3 focus:ring-ring/30 focus:outline-none"
          >
            {skipLinkLabel}
          </a>
        ) : null}
        {children}
      </SidebarProvider>
    </MainIdContext.Provider>
  );
}

export function AppShellSidebar({ children, material }: AppShellSidebarProps) {
  return (
    <Sidebar collapsible="icon" material={material}>
      {children}
      <SidebarRail />
    </Sidebar>
  );
}

export function AppShellSidebarHeader(props: AppShellSidebarHeaderProps) {
  return <SidebarHeader {...props} />;
}

export function AppShellSidebarContent(props: AppShellSidebarContentProps) {
  return <SidebarContent {...props} />;
}

export function AppShellSidebarFooter(props: AppShellSidebarFooterProps) {
  return <SidebarFooter {...props} />;
}

export function AppShellNav({ label, children }: AppShellNavProps) {
  const labelId = useId();
  return (
    <SidebarGroup role="group" aria-labelledby={label ? labelId : undefined}>
      {label ? <SidebarGroupLabel id={labelId}>{label}</SidebarGroupLabel> : null}
      <SidebarMenu>{children}</SidebarMenu>
    </SidebarGroup>
  );
}

export type AppShellBrandProps = {
  /** The product name, shown next to the mark. */
  name: string;
  href: string;
  description?: string;
  /** The product's own mark or icon, 32 px. Defaults to the Nanostack mark. */
  mark?: ReactNode;
};

export function AppShellBrand({ name, href, description, mark }: AppShellBrandProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" href={href} tooltip={name}>
          <span
            data-slot="app-shell-brand-mark"
            className="flex size-8 shrink-0 items-center justify-center text-sidebar-foreground [&>svg]:size-full!"
          >
            {mark ?? <NanostackMark size="lg" />}
          </span>
          <span className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate font-heading text-sm font-semibold">{name}</span>
            {description ? (
              <span className="truncate text-xs text-muted-foreground">{description}</span>
            ) : null}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppShellNavItem({
  label,
  href,
  icon: ItemIcon,
  active = false,
  badge,
}: AppShellNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        href={href}
        isActive={active}
        aria-current={active ? 'page' : undefined}
        tooltip={label}
      >
        {ItemIcon ? <ItemIcon aria-hidden /> : null}
        <span>{label}</span>
      </SidebarMenuButton>
      {badge != null ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );
}

export function AppShellInset(props: AppShellInsetProps) {
  return <SidebarInset {...props} />;
}

export function AppShellHeader({
  children,
  actions,
  sidebarTrigger = 'always',
}: AppShellHeaderProps) {
  const material = useMaterialAttributes();
  const glass = material['data-ns-material'] === 'glass';
  const headerRef = useRef<HTMLElement>(null);

  // A glass top bar floats over the content. Its siblings read its height, plus
  // its top gap, from --app-shell-header-offset to start below it.
  useLayoutEffect(() => {
    const header = headerRef.current;
    const container = header?.parentElement;
    if (!glass || !header || !container) return;
    const update = () => {
      const gap = Number.parseFloat(getComputedStyle(header).marginTop) || 0;
      container.style.setProperty('--app-shell-header-offset', `${header.offsetHeight + gap}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => {
      observer.disconnect();
      container.style.removeProperty('--app-shell-header-offset');
    };
  }, [glass]);

  return (
    <Box
      as="header"
      ref={headerRef}
      data-slot="app-shell-header"
      className="sticky top-0 z-10 flex min-h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2 md:px-4"
      {...material}
    >
      <Box
        data-slot="app-shell-header-trigger"
        className={
          sidebarTrigger === 'mobile'
            ? 'flex shrink-0 items-center gap-2 md:hidden'
            : 'flex shrink-0 items-center gap-2'
        }
      >
        <SidebarTrigger />
        <Box data-slot="app-shell-header-divider" className="hidden items-center sm:flex">
          <Separator orientation="vertical" length="short" />
        </Box>
      </Box>
      <Box data-slot="app-shell-header-content" className="flex min-w-0 flex-1 items-center gap-2">
        {children}
      </Box>
      {actions ? (
        <Inline data-slot="app-shell-header-actions" space="sm" wrap={false}>
          {actions}
        </Inline>
      ) : null}
    </Box>
  );
}

export function AppShellMain({ children }: AppShellMainProps) {
  const mainId = useContext(MainIdContext);
  const material = useMaterialAttributes();
  return (
    <Box
      id={mainId}
      tabIndex={-1}
      data-slot="app-shell-main"
      className="flex flex-1 flex-col gap-6 p-4 outline-none md:p-6"
      {...material}
    >
      {children}
    </Box>
  );
}

/**
 * A page region that scrolls inside the frame, under the top bar. Its start is
 * the skip-link target. The page inside sets its own padding.
 */
export function AppShellContent({ children }: AppShellContentProps) {
  const mainId = useContext(MainIdContext);
  const material = useMaterialAttributes();
  return (
    <Box data-slot="app-shell-content" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ScrollArea height="fill" orientation="both">
        <Box
          id={mainId}
          tabIndex={-1}
          data-slot="app-shell-content-start"
          className="outline-none"
          {...material}
        />
        {children}
      </ScrollArea>
    </Box>
  );
}

export function useAppShell(): AppShellContextValue {
  const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  return { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggle: toggleSidebar };
}
