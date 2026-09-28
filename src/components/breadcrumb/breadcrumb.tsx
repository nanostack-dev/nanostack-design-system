import type { ComponentProps } from 'react';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export type BreadcrumbProps = ComponentProps<typeof Breadcrumb>;
export type BreadcrumbListProps = ComponentProps<typeof BreadcrumbList>;
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbItem>;
export type BreadcrumbLinkProps = ComponentProps<typeof BreadcrumbLink>;
export type BreadcrumbPageProps = ComponentProps<typeof BreadcrumbPage>;
export type BreadcrumbSeparatorProps = ComponentProps<typeof BreadcrumbSeparator>;
export type BreadcrumbEllipsisProps = ComponentProps<typeof BreadcrumbEllipsis>;

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
