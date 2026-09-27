'use client';

import { safeProps, type ElementProps } from '../internal/props.js';

export type ResourceTileGridProps = ElementProps<'div'>;
/** Fill the available width with tiles; wrap to a single track on narrow screens. */
export function ResourceTileGrid(props: ResourceTileGridProps) {
  return <div {...safeProps(props)} className="ns-resource-tile-grid" />;
}

export type ResourceTileProps = ElementProps<'button'> & {
  selected?: boolean;
  highlighted?: boolean;
  tone?: 'default' | 'warning' | 'danger';
};
/** A named, keyboard-operable resource control composed from phrasing-content parts. */
export function ResourceTile({
  selected = false,
  highlighted = false,
  tone = 'default',
  type = 'button',
  ...props
}: ResourceTileProps) {
  return (
    <button
      {...safeProps(props)}
      type={type}
      className="ns-resource-tile"
      data-ns-selected={selected}
      data-ns-highlighted={highlighted}
      data-tone={tone}
    />
  );
}

export type ResourceTilePlaceholderProps = ElementProps<'div'>;
export function ResourceTilePlaceholder(props: ResourceTilePlaceholderProps) {
  return <div {...safeProps(props)} className="ns-resource-tile ns-resource-tile-placeholder" />;
}

export type ResourceTileBodyProps = ElementProps<'span'>;
export function ResourceTileBody(props: ResourceTileBodyProps) {
  return <span {...safeProps(props)} className="ns-resource-tile-body" />;
}
export type ResourceTileHeaderProps = ElementProps<'span'>;
export function ResourceTileHeader(props: ResourceTileHeaderProps) {
  return <span {...safeProps(props)} className="ns-resource-tile-header" />;
}
export type ResourceTileLabelProps = ElementProps<'span'>;
export function ResourceTileLabel(props: ResourceTileLabelProps) {
  return <span {...safeProps(props)} className="ns-resource-tile-label" />;
}
export type ResourceTileMetaProps = ElementProps<'span'>;
export function ResourceTileMeta(props: ResourceTileMetaProps) {
  return <span {...safeProps(props)} className="ns-resource-tile-meta" />;
}
export type ResourceTileStatusProps = ElementProps<'span'> & {
  tone?: 'default' | 'warning' | 'danger';
};
export function ResourceTileStatus({ tone = 'default', ...props }: ResourceTileStatusProps) {
  return <span {...safeProps(props)} className="ns-resource-tile-status" data-tone={tone} />;
}
