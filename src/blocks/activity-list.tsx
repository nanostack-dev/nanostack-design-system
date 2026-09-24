import type { ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export function ActivityList(props: ElementProps<'ul'>) {
  return <ul {...safeProps(props)} className="ns-activity-list" />;
}

type ActivityContentProps = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  status?: ReactNode;
  icon?: ReactNode;
};

type LinkedActivityItemProps = Omit<ElementProps<'a'>, 'title' | 'children'> &
  ActivityContentProps & { href: string };
type StaticActivityItemProps = Omit<ElementProps<'li'>, 'title' | 'children'> &
  ActivityContentProps & { href?: never };
export type ActivityItemProps = LinkedActivityItemProps | StaticActivityItemProps;

function ActivityContent({ title, description, meta, status, icon }: ActivityContentProps) {
  return (
    <>
      {icon ? (
        <div className="ns-activity-icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="ns-activity-content">
        <div className="ns-activity-title">{title}</div>
        {description ? <div className="ns-activity-description">{description}</div> : null}
      </div>
      {status ? <div className="ns-activity-status">{status}</div> : null}
      {meta ? <div className="ns-activity-meta">{meta}</div> : null}
    </>
  );
}

function LinkedActivityItem({
  title,
  description,
  meta,
  status,
  icon,
  ...props
}: LinkedActivityItemProps) {
  return (
    <li className="ns-activity-item">
      <a {...safeProps(props)} className="ns-activity-link">
        <ActivityContent
          title={title}
          description={description}
          meta={meta}
          status={status}
          icon={icon}
        />
      </a>
    </li>
  );
}

export function ActivityItem(props: ActivityItemProps) {
  if (props.href !== undefined) return <LinkedActivityItem {...props} />;
  const { title, description, meta, status, icon, ...rest } = props;
  return (
    <li {...safeProps(rest)} className="ns-activity-item ns-activity-static">
      <ActivityContent
        title={title}
        description={description}
        meta={meta}
        status={status}
        icon={icon}
      />
    </li>
  );
}
