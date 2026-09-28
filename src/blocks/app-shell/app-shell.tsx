import type { Icon } from '@phosphor-icons/react';
import { type ComponentProps, type ReactElement, type ReactNode, useId } from 'react';

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
} from '@/components/sidebar';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface AppShellSidebarProps {
  children: ReactNode;
}

export type AppShellSidebarHeaderProps = ComponentProps<typeof SidebarHeader>;
export type AppShellSidebarContentProps = ComponentProps<typeof SidebarContent>;
export type AppShellSidebarFooterProps = ComponentProps<typeof SidebarFooter>;

export interface AppShellNavProps {
  label?: string;
  children: ReactNode;
}

export interface AppShellNavItemProps {
  label: string;
  icon?: Icon;
  active?: boolean;
  render?: ReactElement;
  href?: string;
  badge?: ReactNode;
}

export type AppShellInsetProps = ComponentProps<typeof SidebarInset>;

export interface AppShellHeaderProps {
  children?: ReactNode;
}

export type AppShellMainProps = ComponentProps<'div'>;

export interface AppShellContextValue {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggle: () => void;
}

export function AppShell({ children, defaultOpen, open, onOpenChange }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      {children}
    </SidebarProvider>
  );
}

export function AppShellSidebar({ children }: AppShellSidebarProps) {
  return (
    <Sidebar collapsible="icon">
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

export function AppShellNavItem({
  label,
  icon: ItemIcon,
  active = false,
  render,
  href,
  badge,
}: AppShellNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={render ?? <a href={href} />}
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

export function AppShellHeader({ children }: AppShellHeaderProps) {
  return (
    <header
      data-slot="app-shell-header"
      className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4"
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" length="short" />
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </header>
  );
}

export function AppShellMain({ className, ...props }: AppShellMainProps) {
  return (
    <div
      data-slot="app-shell-main"
      className={cn('flex flex-1 flex-col gap-4 p-4 md:p-6', className)}
      {...props}
    />
  );
}

export function useAppShell(): AppShellContextValue {
  const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  return { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggle: toggleSidebar };
}
