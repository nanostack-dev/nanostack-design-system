import { useId, type ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type EmptyStateProps = Omit<ElementProps<'div'>, 'title' | 'children'> & {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action, ...props }: EmptyStateProps) {
  const titleId = useId();
  return (
    <div {...safeProps(props)} className="ns-empty" role="group" aria-labelledby={titleId}>
      {icon ? (
        <div className="ns-empty-icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 id={titleId} className="ns-empty-title">
        {title}
      </h3>
      <p className="ns-empty-description">{description}</p>
      {action ? <div className="ns-empty-action">{action}</div> : null}
    </div>
  );
}
