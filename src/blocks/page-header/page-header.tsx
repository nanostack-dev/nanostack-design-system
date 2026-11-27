import type { ComponentPropsWithRef } from 'react';

import { Heading } from '@/components/heading';
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

// The page title is one step above a level 1 `Heading`: it stands alone on the
// page ground, often without an eyebrow above it, and has to lead the page. A
// level 2 title sits under it and keeps the `Heading` size.
export function PageHeaderTitle({ level = 1, ...props }: PageHeaderTitleProps) {
  if (level === 2) {
    return <Heading data-slot="page-header-title" level={2} {...props} />;
  }
  return (
    <h1
      data-slot="page-header-title"
      className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground"
      {...props}
    />
  );
}

// The description is foreground at 75% rather than `--muted-foreground`. On
// the glass backdrop the muted grey passes contrast but reads as one more grey
// over a tinted wash; mixing the foreground keeps the palette's own ink, and a
// high-contrast theme darkens it with the foreground.
export function PageHeaderDescription(props: PageHeaderDescriptionProps) {
  return (
    <Box data-slot="page-header-description" className="max-w-prose">
      <p data-slot="text" className="font-sans text-sm text-foreground/75" {...props} />
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
