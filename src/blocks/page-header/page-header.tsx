import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export type PageHeaderProps = ComponentProps<'header'>;
export type PageHeaderBreadcrumbProps = ComponentProps<'div'>;
export type PageHeaderContentProps = ComponentProps<'div'>;
export type PageHeaderTitleLevel = 1 | 2;
export type PageHeaderTitleProps = ComponentProps<'h1'> & { level?: PageHeaderTitleLevel };
export type PageHeaderDescriptionProps = ComponentProps<'p'>;
export type PageHeaderActionsProps = ComponentProps<'div'>;

export function PageHeader({ className, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn('flex w-full min-w-0 flex-wrap items-end justify-between gap-4', className)}
      {...props}
    />
  );
}

export function PageHeaderBreadcrumb({ className, ...props }: PageHeaderBreadcrumbProps) {
  return (
    <div
      data-slot="page-header-breadcrumb"
      className={cn('w-full min-w-0', className)}
      {...props}
    />
  );
}

export function PageHeaderContent({ className, ...props }: PageHeaderContentProps) {
  return (
    <div
      data-slot="page-header-content"
      className={cn('flex min-w-0 flex-1 basis-80 flex-col gap-1', className)}
      {...props}
    />
  );
}

export function PageHeaderTitle({ level = 1, className, ...props }: PageHeaderTitleProps) {
  const Heading = level === 2 ? 'h2' : 'h1';
  return (
    <Heading
      data-slot="page-header-title"
      className={cn(
        'font-heading font-semibold tracking-tight wrap-break-word text-foreground',
        level === 2 ? 'text-xl' : 'text-2xl',
        className,
      )}
      {...props}
    />
  );
}

export function PageHeaderDescription({ className, ...props }: PageHeaderDescriptionProps) {
  return (
    <p
      data-slot="page-header-description"
      className={cn('max-w-prose text-sm wrap-break-word text-muted-foreground', className)}
      {...props}
    />
  );
}

export function PageHeaderActions({ className, ...props }: PageHeaderActionsProps) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn('flex shrink-0 flex-wrap items-center gap-2', className)}
      {...props}
    />
  );
}
