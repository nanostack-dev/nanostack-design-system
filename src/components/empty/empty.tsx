import type { Icon } from '@phosphor-icons/react';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type EmptyVariant = 'ghost' | 'outline';

type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export type EmptyProps = DivProps & { variant?: EmptyVariant };
export type EmptyHeaderProps = DivProps;
export type EmptyMediaProps = DivProps & { icon?: Icon };
export type EmptyTitleProps = DivProps;
export type EmptyDescriptionProps = DivProps;
export type EmptyContentProps = DivProps;

export function Empty({ variant = 'ghost', ...props }: EmptyProps) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-2xl p-12 text-center text-balance',
        variant === 'outline' && 'border border-dashed border-border',
      )}
      {...props}
    />
  );
}

export function EmptyHeader(props: EmptyHeaderProps) {
  return (
    <div
      data-slot="empty-header"
      className="flex max-w-sm flex-col items-center gap-2"
      {...props}
    />
  );
}

export function EmptyMedia({ icon: IconComponent, children, ...props }: EmptyMediaProps) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={IconComponent ? 'icon' : 'default'}
      className={cn(
        'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
        IconComponent
          ? 'size-10 rounded-xl bg-muted text-foreground [&_svg]:size-5'
          : 'bg-transparent',
      )}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden /> : children}
    </div>
  );
}

export function EmptyTitle(props: EmptyTitleProps) {
  return (
    <div
      data-slot="empty-title"
      className="font-heading text-lg font-medium tracking-tight"
      {...props}
    />
  );
}

export function EmptyDescription(props: EmptyDescriptionProps) {
  return (
    <div
      data-slot="empty-description"
      className="text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary"
      {...props}
    />
  );
}

export function EmptyContent(props: EmptyContentProps) {
  return (
    <div
      data-slot="empty-content"
      className="flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance"
      {...props}
    />
  );
}
