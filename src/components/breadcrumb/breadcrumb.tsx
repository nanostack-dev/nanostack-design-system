import { CaretRightIcon, DotsThreeIcon } from '@phosphor-icons/react';
import {
  createElement,
  type AnchorHTMLAttributes,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

export type BreadcrumbProps = ClosedProps<ComponentPropsWithRef<'nav'>>;
export type BreadcrumbListProps = ClosedProps<ComponentPropsWithRef<'ol'>>;
export type BreadcrumbItemProps = ClosedProps<ComponentPropsWithRef<'li'>>;
export type BreadcrumbLinkProps = ClosedProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'color'>
> & {
  href: string;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
};
export type BreadcrumbPageProps = ClosedProps<ComponentPropsWithRef<'span'>>;
export type BreadcrumbSeparatorProps = ClosedProps<ComponentPropsWithRef<'li'>>;
export type BreadcrumbEllipsisProps = ClosedProps<ComponentPropsWithRef<'span'>>;

export function Breadcrumb(props: BreadcrumbProps) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" className="min-w-0" {...props} />;
}

export function BreadcrumbList(props: BreadcrumbListProps) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className="flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5"
      {...props}
    />
  );
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  return (
    <li
      data-slot="breadcrumb-item"
      className="inline-flex min-w-0 items-center gap-1.5"
      {...props}
    />
  );
}

export function BreadcrumbLink(props: BreadcrumbLinkProps) {
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & { 'data-slot': string } = {
    'data-slot': 'breadcrumb-link',
    className:
      'rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30',
    ...props,
  };
  return createElement(linkComponent, linkProps);
}

export function BreadcrumbPage(props: BreadcrumbPageProps) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className="font-normal text-foreground"
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ children, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className="[&>svg]:size-3.5"
      {...props}
    >
      {children ?? <CaretRightIcon />}
    </li>
  );
}

export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className="flex size-5 items-center justify-center [&>svg]:size-4"
      {...props}
    >
      <DotsThreeIcon />
      <span className="sr-only">More</span>
    </span>
  );
}
