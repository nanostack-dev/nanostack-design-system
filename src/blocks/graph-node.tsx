import { safeProps, type ElementProps } from '../internal/props.js';
import type { GraphTone } from './graph-types.js';

export type GraphNodeFrameProps = ElementProps<'article'> & {
  tone?: GraphTone;
  width?: 'compact' | 'standard';
  selected?: boolean;
  emphasis?: 'normal' | 'focused' | 'critical';
};

export function GraphNodeFrame({
  tone = 'neutral',
  width = 'standard',
  selected = false,
  emphasis = 'normal',
  ...props
}: GraphNodeFrameProps) {
  return (
    <article
      {...safeProps(props)}
      className="ns-graph-node-frame"
      data-tone={tone}
      data-ns-width={width}
      data-selected={selected}
      data-ns-emphasis={emphasis}
    />
  );
}

export type GraphNodeHeaderProps = ElementProps<'header'>;
export function GraphNodeHeader(props: GraphNodeHeaderProps) {
  return <header {...safeProps(props)} className="ns-graph-node-header" />;
}
export type GraphNodeBodyProps = ElementProps<'div'>;
export function GraphNodeBody(props: GraphNodeBodyProps) {
  return <div {...safeProps(props)} className="ns-graph-node-body" />;
}
export type GraphNodeFooterProps = ElementProps<'footer'>;
export function GraphNodeFooter(props: GraphNodeFooterProps) {
  return <footer {...safeProps(props)} className="ns-graph-node-footer" />;
}
