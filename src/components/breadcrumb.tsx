import { safeProps, type ElementProps } from '../internal/props.js';

export type BreadcrumbProps = ElementProps<'nav'>;
export function Breadcrumb({ 'aria-label': label = 'Breadcrumb', ...props }: BreadcrumbProps) {
  return <nav {...safeProps(props)} aria-label={label} className="ns-breadcrumb" />;
}
export type BreadcrumbListProps = ElementProps<'ol'>;
export function BreadcrumbList(props: BreadcrumbListProps) {
  return <ol {...safeProps(props)} className="ns-breadcrumb-list" />;
}
export type BreadcrumbItemProps = ElementProps<'li'>;
export function BreadcrumbItem(props: BreadcrumbItemProps) {
  return <li {...safeProps(props)} className="ns-breadcrumb-item" />;
}
export type BreadcrumbLinkProps = Omit<ElementProps<'a'>, 'href'> & { href: string };
export function BreadcrumbLink({ children, ...props }: BreadcrumbLinkProps) {
  return (
    <a {...safeProps(props)} className="ns-breadcrumb-link">
      {children}
    </a>
  );
}
export type BreadcrumbPageProps = ElementProps<'span'>;
export function BreadcrumbPage(props: BreadcrumbPageProps) {
  return <span {...safeProps(props)} aria-current="page" className="ns-breadcrumb-current" />;
}
export type BreadcrumbSeparatorProps = Omit<ElementProps<'li'>, 'children'> & {
  variant?: 'chevron' | 'slash';
};
export function BreadcrumbSeparator({ variant = 'chevron', ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      {...safeProps(props)}
      role="presentation"
      aria-hidden="true"
      className="ns-breadcrumb-separator"
    >
      {variant === 'slash' ? (
        '/'
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m6 3 5 5-5 5" />
        </svg>
      )}
    </li>
  );
}
export type BreadcrumbEllipsisProps = Omit<ElementProps<'span'>, 'children'>;
export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  return (
    <span {...safeProps(props)} className="ns-breadcrumb-ellipsis">
      <span aria-hidden="true">…</span>
      <span className="ns-visually-hidden">Collapsed ancestors</span>
    </span>
  );
}
