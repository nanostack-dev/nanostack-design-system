import { safeProps, type ElementProps } from '../internal/props.js';

export type ResourceListProps = ElementProps<'ul'> & { density?: 'comfortable' | 'compact' };
export function ResourceList({ density = 'comfortable', ...props }: ResourceListProps) {
  return <ul {...safeProps(props)} className="ns-resource-list" data-ns-density={density} />;
}

export type ResourceRowProps = Omit<ElementProps<'li'>, 'draggable'> & {
  selected?: boolean;
  readOnly?: boolean;
  draggable?: boolean;
  dragging?: boolean;
};
/** A row owns layout; links and sibling actions retain their native behavior. */
export function ResourceRow({
  selected = false,
  readOnly = false,
  draggable = false,
  dragging = false,
  ...props
}: ResourceRowProps) {
  return (
    <li
      {...safeProps(props)}
      className="ns-resource-row"
      data-ns-selected={selected}
      data-ns-readonly={readOnly}
      data-ns-dragging={dragging}
      draggable={draggable && !readOnly}
    />
  );
}

export type ResourceRowLabelProps = ElementProps<'div'>;
export function ResourceRowLabel(props: ResourceRowLabelProps) {
  return <div {...safeProps(props)} className="ns-resource-row-label" />;
}

export type ResourceRowMetaProps = ElementProps<'div'>;
export function ResourceRowMeta(props: ResourceRowMetaProps) {
  return <div {...safeProps(props)} className="ns-resource-row-meta" />;
}

export type ResourceRowActionsProps = ElementProps<'div'>;
export function ResourceRowActions(props: ResourceRowActionsProps) {
  return <div {...safeProps(props)} className="ns-resource-row-actions" />;
}

export type ResourceRowLinkProps = Omit<ElementProps<'a'>, 'href'> & {
  href: string;
  active?: boolean;
};
/** The link covers its row while actions remain independent sibling controls. */
export function ResourceRowLink({
  active = false,
  href,
  children,
  ...props
}: ResourceRowLinkProps) {
  return (
    <a
      {...safeProps(props)}
      href={href}
      className="ns-resource-row-link"
      aria-current={active ? 'page' : props['aria-current']}
      draggable={false}
    >
      {children}
    </a>
  );
}

export type ResourceRowButtonProps = ElementProps<'button'> & { selected?: boolean };
export function ResourceRowButton({
  selected = false,
  type = 'button',
  ...props
}: ResourceRowButtonProps) {
  return (
    <button
      {...safeProps(props)}
      type={type}
      className="ns-resource-row-button"
      aria-pressed={selected}
    />
  );
}

export type ResourceDragImageProps = ElementProps<'div'>;
/** An off-screen snapshot target for the native DataTransfer.setDragImage API. */
export function ResourceDragImage(props: ResourceDragImageProps) {
  return <div {...safeProps(props)} className="ns-resource-drag-image" aria-hidden="true" />;
}
