'use client';

import { useLayoutEffect, useRef } from 'react';
import { Handle, Position, useConnection, type NodeProps } from '@xyflow/react';
import { GraphNodeFrame } from '../../blocks/graph-node.js';
import type { EngineNode } from './model.js';

const borders = [Position.Top, Position.Right, Position.Bottom, Position.Left];

function ConnectionSurface({ id, connectable }: { id: string; connectable: boolean }) {
  const connecting = useConnection((connection) => connection.inProgress);
  return (
    <>
      <span aria-hidden="true" className="ns-graph-connect-ring" />
      {borders.map((side) => (
        <Handle
          key={side}
          id={`band-${side}-${id}`}
          type="source"
          position={side}
          isConnectable={connectable}
          className="ns-graph-connect-band"
          data-side={side}
          data-inert={connecting || !connectable}
        />
      ))}
      <Handle
        id={`node-${id}`}
        type="target"
        position={Position.Top}
        isConnectable={connectable}
        className="ns-graph-drop-surface"
        data-inert={!connecting || !connectable}
      />
      {borders.map((side) => (
        <Handle
          key={`drop-${side}`}
          id={`drop-${side}-${id}`}
          type="target"
          position={side}
          isConnectable={connectable}
          className="ns-graph-connect-band"
          data-side={side}
          data-inert={!connecting || !connectable}
        />
      ))}
    </>
  );
}

export function GraphNodeRenderer({ id, data, selected, isConnectable }: NodeProps<EngineNode>) {
  const { model } = data;
  const content = useRef<HTMLDivElement>(null);
  // The engine reads its no-drag marker before React's delegated handlers.
  // Register controls centrally, including controls mounted by disclosures.
  useLayoutEffect(() => {
    const element = content.current;
    if (!element) return;
    const markControls = () => {
      element
        .querySelectorAll(
          'button, a, input, select, textarea, [contenteditable="true"], [role="button"], [role="checkbox"], [role="combobox"]',
        )
        .forEach((control) => control.classList.add('nodrag'));
    };
    markControls();
    const observer = new MutationObserver(markControls);
    observer.observe(element, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={content} className="ns-graph-node">
      <GraphNodeFrame
        tone={model.tone ?? 'neutral'}
        width={model.width ?? 'standard'}
        selected={selected}
        emphasis={model.emphasis ?? 'normal'}
      >
        {model.content}
      </GraphNodeFrame>
      <ConnectionSurface id={id} connectable={isConnectable} />
    </div>
  );
}
