import { safeProps, type ElementProps } from '../internal/props.js';

export type DockProps = ElementProps<'section'>;
export function Dock(props: DockProps) {
  return <section {...safeProps(props)} className="ns-dock" />;
}
export type DockToolbarProps = ElementProps<'header'>;
export function DockToolbar(props: DockToolbarProps) {
  return <header {...safeProps(props)} className="ns-dock-toolbar" />;
}
export type DockBodyProps = ElementProps<'div'>;
export function DockBody(props: DockBodyProps) {
  return <div {...safeProps(props)} className="ns-dock-body" />;
}
export type DockRailProps = ElementProps<'nav'>;
export function DockRail(props: DockRailProps) {
  return <nav {...safeProps(props)} className="ns-dock-rail" />;
}
export type DockSidebarProps = ElementProps<'aside'> & {
  open: boolean;
  size?: 'standard' | 'wide';
};
export function DockSidebar({ open, size = 'standard', children, ...props }: DockSidebarProps) {
  return (
    <aside
      {...safeProps(props)}
      className="ns-dock-sidebar"
      data-open={open}
      data-size={size}
      inert={!open}
      aria-hidden={!open}
    >
      <div className="ns-dock-sidebar-content">{children}</div>
    </aside>
  );
}
export type DockMainProps = ElementProps<'div'>;
export function DockMain(props: DockMainProps) {
  return <div {...safeProps(props)} className="ns-dock-main" />;
}
export type DockBannerProps = ElementProps<'div'>;
export function DockBanner(props: DockBannerProps) {
  return <div {...safeProps(props)} className="ns-dock-banner" />;
}
