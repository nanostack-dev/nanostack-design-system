import type { ComponentProps } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink as PaginationLinkPrimitive,
  PaginationNext as PaginationNextPrimitive,
  PaginationPrevious as PaginationPreviousPrimitive,
} from '@/components/ui/pagination';

export type PaginationProps = ComponentProps<typeof Pagination>;
export type PaginationContentProps = ComponentProps<typeof PaginationContent>;
export type PaginationItemProps = ComponentProps<typeof PaginationItem>;
export type PaginationLinkProps = ComponentProps<typeof PaginationLinkPrimitive>;
export type PaginationPreviousProps = ComponentProps<typeof PaginationPreviousPrimitive>;
export type PaginationNextProps = ComponentProps<typeof PaginationNextPrimitive>;
export type PaginationEllipsisProps = ComponentProps<typeof PaginationEllipsis>;

export function PaginationLink({ role = 'link', ...props }: PaginationLinkProps) {
  return <PaginationLinkPrimitive role={role} {...props} />;
}

export function PaginationPrevious({ role = 'link', ...props }: PaginationPreviousProps) {
  return <PaginationPreviousPrimitive role={role} {...props} />;
}

export function PaginationNext({ role = 'link', ...props }: PaginationNextProps) {
  return <PaginationNextPrimitive role={role} {...props} />;
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem };
