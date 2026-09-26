import type { MouseEvent, ReactNode, Ref } from 'react';
import type { NoCustomStyle } from '../internal/props.js';
export type EdgeAnchorSide = 'top' | 'right' | 'bottom' | 'left';

export type GraphPosition = { x: number; y: number };
export type GraphTone = 'neutral' | 'info' | 'success' | 'danger' | 'warning';
/** Cached snapshots let live data update one element without rebuilding the graph. */
export type GraphNodePresentation = NoCustomStyle & {
  tone: GraphTone;
  phase?: 'idle' | 'running' | 'success' | 'error' | 'skipped';
  instant?: boolean;
  emphasis?: 'normal' | 'focused' | 'critical';
};
export type GraphEdgePresentation = NoCustomStyle & {
  phase: 'idle' | 'traversed' | 'blocked' | 'skipped';
  tone: GraphTone;
  travelMs?: number;
  instant?: boolean;
};
export type GraphPresentationStore = {
  subscribe: (listener: () => void) => () => void;
  getNodeSnapshot: (id: string) => GraphNodePresentation | undefined;
  getEdgeSnapshot: (id: string) => GraphEdgePresentation | undefined;
  getServerNodeSnapshot?: (id: string) => GraphNodePresentation | undefined;
  getServerEdgeSnapshot?: (id: string) => GraphEdgePresentation | undefined;
};

export type GraphConnection = {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
};

export type GraphNode<
  Data extends Record<string, unknown> = Record<string, unknown>,
  Kind extends string = string,
> = NoCustomStyle & {
  id: string;
  type?: Kind;
  position: GraphPosition;
  data: Data;
  content?: ReactNode;
  ariaLabel?: string;
  tone?: GraphTone;
  emphasis?: 'normal' | 'focused' | 'critical';
  width?: 'compact' | 'standard';
  family?: 'call' | 'wait' | 'logic' | 'data';
  phase?: 'idle' | 'running' | 'success' | 'error' | 'skipped';
  instant?: boolean;
  selected?: boolean;
  hidden?: boolean;
  draggable?: boolean;
  connectable?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  // The canvas reports its measurements; hosts never choose a CSS dimension.
  measured?: { width?: number; height?: number };
  dragging?: boolean;
  domAttributes?: never;
  nodeTypes?: never;
};

export type GraphEdge<Data extends Record<string, unknown> = Record<string, unknown>> =
  NoCustomStyle & {
    id: string;
    source: string;
    target: string;
    data?: Data;
    label?: string;
    tone?: GraphTone;
    motion?: 'static' | 'flow';
    pattern?: 'solid' | 'dashed';
    sourceAnchor?: EdgeAnchorSide;
    targetAnchor?: EdgeAnchorSide;
    selected?: boolean;
    hidden?: boolean;
    deletable?: boolean;
    domAttributes?: never;
    markerStart?: never;
    markerEnd?: never;
    edgeTypes?: never;
  };

export type GraphNodeChange<NodeType extends GraphNode = GraphNode> =
  | {
      type: 'position';
      id: string;
      position?: GraphPosition;
      positionAbsolute?: GraphPosition;
      dragging?: boolean;
    }
  | {
      type: 'dimensions';
      id: string;
      dimensions?: { width: number; height: number };
      resizing?: boolean;
      setAttributes?: boolean | 'width' | 'height';
    }
  | { type: 'select'; id: string; selected: boolean }
  | { type: 'remove'; id: string }
  | { type: 'add'; item: NodeType; index?: number }
  | { type: 'replace'; item: NodeType; id: string };
export type GraphEdgeChange<EdgeType extends GraphEdge = GraphEdge> =
  | { type: 'select'; id: string; selected: boolean }
  | { type: 'remove'; id: string }
  | { type: 'add'; item: EdgeType; index?: number }
  | { type: 'replace'; item: EdgeType; id: string };

export type GraphDeleteItems<
  NodeType extends GraphNode = GraphNode,
  EdgeType extends GraphEdge = GraphEdge,
> = {
  nodes: NodeType[];
  edges: EdgeType[];
};
export type GraphBeforeDelete<
  NodeType extends GraphNode = GraphNode,
  EdgeType extends GraphEdge = GraphEdge,
> = (
  items: GraphDeleteItems<NodeType, EdgeType>,
) => Promise<boolean | GraphDeleteItems<NodeType, EdgeType>>;

export interface GraphCanvasHandle {
  fit(): void;
  center(nodeId: string): void;
  animateLayout(): void;
}

export type GraphCanvasProps<
  NodeType extends GraphNode = GraphNode,
  EdgeType extends GraphEdge = GraphEdge,
> = NoCustomStyle & {
  ref?: Ref<GraphCanvasHandle>;
  nodes: NodeType[];
  edges: EdgeType[];
  presentation?: GraphPresentationStore;
  mode?: 'readonly' | 'interactive';
  height?: 'panel' | 'fill';
  label: string;
  title?: string;
  description?: string;
  footer?: ReactNode;
  controls?: ReactNode;
  overlay?: ReactNode;
  onNodesChange?: (changes: GraphNodeChange<NodeType>[]) => void;
  onEdgesChange?: (changes: GraphEdgeChange<EdgeType>[]) => void;
  onConnect?: (connection: GraphConnection) => void;
  onBeforeDelete?: GraphBeforeDelete<NodeType, EdgeType>;
  onReconnect?: (edge: EdgeType, connection: GraphConnection) => void;
  onSelectionChange?: (ids: string[]) => void;
  onNodeClick?: (node: NodeType) => void;
  onNodeActivate?: (node: NodeType) => void;
  onPaneClick?: () => void;
  onPaneContextMenu?: (event: globalThis.MouseEvent | MouseEvent) => void;
  onNodeContextMenu?: (event: globalThis.MouseEvent | MouseEvent, node: NodeType) => void;
  onNodeDragStop?: (
    event: globalThis.MouseEvent | TouchEvent,
    node: NodeType,
    nodes: NodeType[],
  ) => void;
};

export function graphAnchorSideFromHandle(
  handleId: string | null | undefined,
): EdgeAnchorSide | undefined {
  const side = handleId?.match(/^(?:band|drop)-(top|right|bottom|left)-/)?.[1];
  return side === 'top' || side === 'right' || side === 'bottom' || side === 'left'
    ? side
    : undefined;
}

export function isGraphAnchorSide(value: unknown): value is EdgeAnchorSide {
  return value === 'top' || value === 'right' || value === 'bottom' || value === 'left';
}
