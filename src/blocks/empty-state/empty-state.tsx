import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  type EmptyProps,
} from '@/components/empty';

export type EmptyStateProps = Omit<EmptyProps, 'title' | 'children'> & {
  icon?: Icon;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export function EmptyState({
  icon: StateIcon,
  title,
  description,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <Empty data-slot="empty-state" {...props}>
      <EmptyHeader>
        {StateIcon ? (
          <EmptyMedia variant="icon">
            <StateIcon aria-hidden="true" />
          </EmptyMedia>
        ) : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
}
