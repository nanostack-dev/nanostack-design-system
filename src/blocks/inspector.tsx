import type { ReactNode } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type InspectorProps = ElementProps<'section'> & { height?: 'content' | 'fill' };
export function Inspector({ height = 'content', ...props }: InspectorProps) {
  return <section {...safeProps(props)} className="ns-inspector" data-ns-height={height} />;
}

export type InspectorHeaderProps = ElementProps<'div'>;
export function InspectorHeader(props: InspectorHeaderProps) {
  return <div {...safeProps(props)} className="ns-inspector-header" />;
}

export type InspectorBodyProps = ElementProps<'div'>;
export function InspectorBody(props: InspectorBodyProps) {
  return <div {...safeProps(props)} className="ns-inspector-body" />;
}

export type InspectorFooterProps = ElementProps<'footer'>;
export function InspectorFooter(props: InspectorFooterProps) {
  return <footer {...safeProps(props)} className="ns-inspector-footer" />;
}

export type DefinitionListProps = ElementProps<'dl'> & { layout?: 'stacked' | 'columns' };
export function DefinitionList({ layout = 'columns', ...props }: DefinitionListProps) {
  return <dl {...safeProps(props)} className="ns-definition-list" data-layout={layout} />;
}

export type DefinitionItemProps = ElementProps<'div'> & { label: ReactNode };
export function DefinitionItem({ label, children, ...props }: DefinitionItemProps) {
  return (
    <div {...safeProps(props)} className="ns-definition-item">
      <dt className="ns-definition-term">{label}</dt>
      <dd className="ns-definition-value">{children}</dd>
    </div>
  );
}
