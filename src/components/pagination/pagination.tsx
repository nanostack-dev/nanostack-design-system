import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from '@phosphor-icons/react';
import {
  createElement,
  type AnchorHTMLAttributes,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from 'react';

import { buttonStyles } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

type AnchorProps = ClosedProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'color'>
> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

export type PaginationProps = ClosedProps<ComponentPropsWithRef<'nav'>>;
export type PaginationContentProps = ClosedProps<ComponentPropsWithRef<'ul'>>;
export type PaginationItemProps = ClosedProps<ComponentPropsWithRef<'li'>>;
export type PaginationLinkProps = AnchorProps & {
  children: ReactNode;
  isActive?: boolean;
};
export type PaginationPreviousProps = AnchorProps & { text?: string };
export type PaginationNextProps = AnchorProps & { text?: string };
export type PaginationEllipsisProps = ClosedProps<ComponentPropsWithRef<'span'>>;

export function Pagination(props: PaginationProps) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className="mx-auto flex w-full justify-center"
      {...props}
    />
  );
}

export function PaginationContent(props: PaginationContentProps) {
  return <ul data-slot="pagination-content" className="flex items-center gap-1" {...props} />;
}

export function PaginationItem(props: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationAnchor({
  slot,
  className,
  children,
  ...props
}: AnchorProps & { slot: string; className: string; children: ReactNode }) {
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & { 'data-slot': string } = {
    'data-slot': slot,
    className,
    ...props,
  };
  return createElement(linkComponent, linkProps, children);
}

export function PaginationLink({ isActive = false, ...props }: PaginationLinkProps) {
  return (
    <PaginationAnchor
      slot="pagination-link"
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive || undefined}
      className={buttonStyles({ variant: isActive ? 'outline' : 'ghost', iconOnly: true })}
      {...props}
    />
  );
}

export function PaginationPrevious({ text = 'Previous', ...props }: PaginationPreviousProps) {
  return (
    <PaginationAnchor
      slot="pagination-previous"
      aria-label="Go to previous page"
      className={cn(buttonStyles({ variant: 'ghost' }), 'pl-2!')}
      {...props}
    >
      <CaretLeftIcon aria-hidden data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationAnchor>
  );
}

export function PaginationNext({ text = 'Next', ...props }: PaginationNextProps) {
  return (
    <PaginationAnchor
      slot="pagination-next"
      aria-label="Go to next page"
      className={cn(buttonStyles({ variant: 'ghost' }), 'pr-2!')}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <CaretRightIcon aria-hidden data-icon="inline-end" />
    </PaginationAnchor>
  );
}

export function PaginationEllipsis(props: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className="flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      <DotsThreeIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}
