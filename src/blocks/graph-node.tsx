'use client';

import { useState } from 'react';
import { GraphAnnotationContext } from '../internal/graph/annotation.js';
import { safeProps, type ElementProps } from '../internal/props.js';
import type { GraphTone } from './graph-types.js';

export type GraphNodeFrameProps = ElementProps<'article'> & {
  tone?: GraphTone;
  width?: 'compact' | 'standard';
  family?: 'call' | 'wait' | 'logic' | 'data';
  phase?: 'idle' | 'running' | 'success' | 'error' | 'skipped';
  instant?: boolean;
  selected?: boolean;
  emphasis?: 'normal' | 'focused' | 'critical';
};

export function GraphNodeFrame({
  tone = 'neutral',
  family = 'call',
  phase,
  instant = false,
  children,
  width = 'standard',
  selected = false,
  emphasis = 'normal',
  ...props
}: GraphNodeFrameProps) {
  const [annotationHost, setAnnotationHost] = useState<HTMLDivElement | null>(null);
  return (
    <div
      className="ns-graph-node-shell"
      data-ns-family={family}
      data-ns-run-instant={instant || undefined}
    >
      <article
        {...safeProps(props)}
        className="ns-graph-node-frame"
        data-tone={tone}
        data-ns-family={family}
        data-ns-run-phase={phase}
        data-ns-run-instant={instant || undefined}
        data-ns-width={width}
        data-selected={selected}
        data-ns-emphasis={emphasis}
      >
        {phase === 'running' ? <span aria-hidden="true" className="ns-graph-node-beam" /> : null}
        <GraphAnnotationContext.Provider value={annotationHost}>
          {children}
        </GraphAnnotationContext.Provider>
      </article>
      <div ref={setAnnotationHost} className="ns-graph-node-annotations" />
    </div>
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
