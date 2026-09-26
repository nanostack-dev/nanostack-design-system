'use client';

import { useMemo } from 'react';
import { useNodes, useEdges, useReactFlow, useStore } from '@xyflow/react';
import { ArrowsInIcon } from '@phosphor-icons/react/dist/ssr/ArrowsIn';
import { MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { SquaresFourIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour';
import { Button } from '../components/button.js';
import { Icon, Spinner } from '../components/icon.js';
import {
  fromEngineNode,
  fromEngineEdge,
  type EngineNode,
  type EngineEdge,
} from '../internal/graph/model.js';
import type { NoCustomStyle } from '../internal/props.js';
import type { GraphNode, GraphEdge } from './graph-types.js';

export type GraphViewportControlsProps = NoCustomStyle & {
  onArrange?: () => void;
  arranging?: boolean;
  arrangeDisabled?: boolean;
};

function viewportDuration() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260;
}

/** Place inside GraphCanvas's controls part. Viewport mechanics remain library-owned. */
export function GraphViewportControls({
  onArrange,
  arranging = false,
  arrangeDisabled = false,
}: GraphViewportControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const zoomPercent = useStore((state) => Math.round(state.transform[2] * 100));
  const fit = () => {
    void fitView({ padding: 0.16, duration: viewportDuration() });
  };
  return (
    <div className="ns-graph-controls" role="group" aria-label="Graph view">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        onClick={() => {
          void zoomOut({ duration: viewportDuration() });
        }}
      >
        <Icon glyph={MinusIcon} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Zoom ${zoomPercent} percent, fit to view`}
        onClick={fit}
      >
        {zoomPercent}%
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        onClick={() => {
          void zoomIn({ duration: viewportDuration() });
        }}
      >
        <Icon glyph={PlusIcon} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Fit to view" onClick={fit}>
        <Icon glyph={ArrowsInIcon} />
      </Button>
      {onArrange ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Auto-layout"
          onClick={onArrange}
          disabled={arranging || arrangeDisabled}
        >
          {arranging ? <Spinner /> : <Icon glyph={SquaresFourIcon} />}
        </Button>
      ) : null}
    </div>
  );
}

/** Read-only application data, never the rendering engine's prop surface. */
export function useGraphNodes<NodeType extends GraphNode = GraphNode>(): NodeType[] {
  const nodes = useNodes<EngineNode>();
  return useMemo(() => nodes.map((node) => fromEngineNode(node) as NodeType), [nodes]);
}
export function useGraphEdges<EdgeType extends GraphEdge = GraphEdge>(): EdgeType[] {
  const edges = useEdges<EngineEdge>();
  return useMemo(() => edges.map((edge) => fromEngineEdge(edge) as EdgeType), [edges]);
}

export function useGraphViewport() {
  const { fitView, getNode, setCenter, getZoom } = useReactFlow<EngineNode, EngineEdge>();
  return useMemo(
    () => ({
      fit() {
        void fitView({ padding: 0.16, duration: viewportDuration() });
      },
      center(nodeId: string) {
        const node = getNode(nodeId);
        if (node)
          void setCenter(
            node.position.x + (node.measured?.width ?? 0) / 2,
            node.position.y + (node.measured?.height ?? 0) / 2,
            { zoom: getZoom(), duration: viewportDuration() },
          );
      },
    }),
    [fitView, getNode, getZoom, setCenter],
  );
}
