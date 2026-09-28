import type { ComponentPropsWithRef } from 'react';

import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Box } from '@/layout/box';
import type { ClosedProps } from '@/lib/closed-props';

export type PageHeaderProps = ClosedProps<ComponentPropsWithRef<'header'>>;
export type PageHeaderBreadcrumbProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type PageHeaderContentProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type PageHeaderTitleLevel = 1 | 2;
export type PageHeaderTitleProps = ClosedProps<ComponentPropsWithRef<'h1'>> & {
  level?: PageHeaderTitleLevel;
};
export type PageHeaderDescriptionProps = ClosedProps<ComponentPropsWithRef<'p'>>;
export type PageHeaderActionsProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export function PageHeader(props: PageHeaderProps) {
  return (
    <Box
      as="header"
      data-slot="page-header"
      className="flex w-full min-w-0 flex-wrap items-end justify-between gap-4"
      {...props}
    />
  );
}

export function PageHeaderBreadcrumb(props: PageHeaderBreadcrumbProps) {
  return <Box data-slot="page-header-breadcrumb" className="w-full min-w-0" {...props} />;
}

export function PageHeaderContent(props: PageHeaderContentProps) {
  return (
    <Box
      data-slot="page-header-content"
      className="flex min-w-0 flex-1 basis-80 flex-col gap-1 wrap-break-word"
      {...props}
    />
  );
}

export function PageHeaderTitle({ level = 1, ...props }: PageHeaderTitleProps) {
  return <Heading data-slot="page-header-title" level={level} {...props} />;
}

export function PageHeaderDescription(props: PageHeaderDescriptionProps) {
  return (
    <Box data-slot="page-header-description" className="max-w-prose">
      <Text tone="muted" {...props} />
    </Box>
  );
}

export function PageHeaderActions(props: PageHeaderActionsProps) {
  return (
    <Box
      data-slot="page-header-actions"
      className="flex shrink-0 flex-wrap items-center gap-2"
      {...props}
    />
  );
}
