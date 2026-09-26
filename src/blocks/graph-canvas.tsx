'use client';

import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';

import {
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useConnection,
  useStoreApi,
  useEdgesState,
  useNodesState,
  type Connection,
  type XYPosition,
} from '@xyflow/react';

import { GraphConnectionLine } from '../internal/graph/connection-line.js';
import { GraphEdgeRenderer } from '../internal/graph/edge.js';
import { GraphNodeRenderer } from '../internal/graph/node.js';
import { GraphGestureProvider, useGraphGestureStore } from '../internal/graph/context.js';
import { getNearestBorderSide } from '../internal/graph/geometry.js';
import {
  toEngineNode,
  toEngineEdge,
  fromEngineNode,
  fromEngineEdge,
  type EngineNode,
  type EngineEdge,
} from '../internal/graph/model.js';
import {
  graphAnchorSideFromHandle,
  type GraphCanvasProps,
  type GraphNode,
  type GraphEdge,
  type GraphNodeChange,
  type GraphEdgeChange,
} from './graph-types.js';

const nodeTypes = { block: GraphNodeRenderer };
const edgeTypes = { graph: GraphEdgeRenderer };
const buildCanvasEdgeId = (connection: Connection) => `${connection.source}->${connection.target}`;
function connectedEdge(connection: Connection, previous?: GraphEdge): EngineEdge {
  const sourceAnchor = graphAnchorSideFromHandle(connection.sourceHandle) ?? previous?.sourceAnchor;
  const targetAnchor = graphAnchorSideFromHandle(connection.targetHandle) ?? previous?.targetAnchor;
  return toEngineEdge({
    label: 'New connection',
    tone: 'neutral',
    ...previous,
    id: buildCanvasEdgeId(connection),
    source: connection.source,
    target: connection.target,
    ...(sourceAnchor ? { sourceAnchor } : {}),
    ...(targetAnchor ? { targetAnchor } : {}),
  });
}

/** Must match the graph node transform transition in the library stylesheet. */
const RELAYOUT_DURATION_MS = 400;

function GraphCanvasInner<NodeType extends GraphNode, EdgeType extends GraphEdge>({
  ref,
  nodes: inputNodes,
  edges: inputEdges,
  mode = 'readonly',
  label,
  height = 'panel',
  title,
  description,
  footer,
  controls,
  overlay,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onBeforeDelete,
  onReconnect,
  onSelectionChange,
  onNodeClick,
  onNodeActivate,
  onPaneClick,
  onPaneContextMenu,
  onNodeContextMenu,
  onNodeDragStop,
}: GraphCanvasProps<NodeType, EdgeType>) {
  const { armConnectionSettle, clearReconnectRetainedAnchor, recordReconnectRetainedAnchor } =
    useGraphGestureStore();
  const { fitView, setCenter, getNode, getInternalNode, getZoom } = useReactFlow<
    EngineNode,
    EngineEdge
  >();
  const initialNodes = useMemo(() => inputNodes.map(toEngineNode), [inputNodes]);
  const initialEdges = useMemo(() => inputEdges.map(toEngineEdge), [inputEdges]);
  // Armed only while an auto-layout result is landing — see RELAYOUT_DURATION_MS.
  const [isRelayouting, setIsRelayouting] = useState(false);
  const relayoutTimer = useRef<number | undefined>(undefined);
  const [localNodes, setLocalNodes, onLocalNodesChange] = useNodesState<EngineNode>(initialNodes);
  const [localEdges, setLocalEdges, onLocalEdgesChange] = useEdgesState<EngineEdge>(initialEdges);
  const isInteractive = mode === 'interactive';
  const nodes = onNodesChange ? initialNodes : localNodes;
  const edges = onEdgesChange ? initialEdges : localEdges;

  const handleLocalConnect = useCallback(
    (connection: Connection) => {
      if (!isInteractive) {
        return;
      }

      setLocalEdges((currentEdges) => {
        return addEdge(connectedEdge(connection), currentEdges) as EngineEdge[];
      });
    },
    [isInteractive, setLocalEdges],
  );
  const localConnect = onConnect ?? handleLocalConnect;

  /**
   * Where the pointer was when the connection was released.
   *
   * `onConnect` reports the handles, not the point. React Flow clears the
   * in-flight connection before the callback runs, so the last position seen
   * while the drag was live is the release point. The raw pointer, not
   * `connection.to`: `to` snaps to the centre of the handle under the
   * pointer, and the whole-node drop target made every body release report
   * the node's centre — the pinned side then came from sub-pixel rounding,
   * not from where the user released.
   */
  const storeApi = useStoreApi();
  const releasePoint = useRef<XYPosition | null>(null);

  // Only the boolean. It flips twice per gesture, where the pointer changes
  // every frame, so this re-renders on start and end and nowhere between.
  const isConnecting = useConnection((connection) => connection.inProgress);

  // Subscribed outside React on purpose. The pointer changes every frame of a
  // drag, so `useConnection` would re-render this whole subtree — the graph,
  // the panels, the controls — once per frame. A store subscription writes to
  // a ref and renders nothing.
  useEffect(
    () =>
      storeApi.subscribe((state) => {
        const { connection, transform } = state;

        if (!connection.inProgress) {
          return;
        }

        const [translateX, translateY, zoom] = transform;
        releasePoint.current = {
          x: (connection.pointer.x - translateX) / zoom,
          y: (connection.pointer.y - translateY) / zoom,
        };
      }),
    [storeApi],
  );

  /**
   * Every edge ends on a border. A release on the node body carries the
   * whole-node handle, which pins nothing, so resolve it to the border the
   * pointer came nearest and hand on the matching border handle.
   */
  const handleConnect = useCallback(
    (connection: Connection) => {
      const droppedOnBody = connection.targetHandle?.startsWith('node-');
      const point = releasePoint.current;

      if (!droppedOnBody || !point || !connection.target) {
        localConnect(connection);
        return;
      }

      const side = getNearestBorderSide(getInternalNode(connection.target), point);

      localConnect(
        side
          ? {
              ...connection,
              targetHandle: `drop-${side}-${connection.target}`,
            }
          : connection,
      );
    },
    [getInternalNode, localConnect],
  );

  const handleConnectWithSettle = useCallback(
    (connection: Connection) => {
      armConnectionSettle(buildCanvasEdgeId(connection));
      handleConnect(connection);
    },
    [handleConnect, armConnectionSettle],
  );

  /**
   * A reconnect release follows the same border contract as a fresh
   * connection: a release on the node body resolves to the border the pointer
   * came nearest. Only the moved end carries a handle string here — the
   * retained end's handle is `null`, and `reconnectEdge` keeps its pin.
   */
  const resolveReconnectHandles = useCallback(
    (connection: Connection): Connection => {
      const point = releasePoint.current;

      if (!point) {
        return connection;
      }

      let resolved = connection;

      if (connection.targetHandle?.startsWith('node-') && connection.target) {
        const side = getNearestBorderSide(getInternalNode(connection.target), point);
        if (side) {
          resolved = {
            ...resolved,
            targetHandle: `drop-${side}-${connection.target}`,
          };
        }
      }

      if (connection.sourceHandle?.startsWith('node-') && connection.source) {
        const side = getNearestBorderSide(getInternalNode(connection.source), point);
        if (side) {
          resolved = {
            ...resolved,
            sourceHandle: `band-${side}-${connection.source}`,
          };
        }
      }

      return resolved;
    },
    [getInternalNode],
  );
  const handleNodesChange = (changes: import('@xyflow/react').NodeChange<EngineNode>[]) => {
    if (!onNodesChange) {
      onLocalNodesChange(changes);
      return;
    }
    onNodesChange(
      changes.map((change) =>
        change.type === 'add' || change.type === 'replace'
          ? { ...change, item: fromEngineNode(change.item) as NodeType }
          : change,
      ) as GraphNodeChange<NodeType>[],
    );
  };
  const handleEdgesChange = (changes: import('@xyflow/react').EdgeChange<EngineEdge>[]) => {
    if (!onEdgesChange) {
      onLocalEdgesChange(changes);
      return;
    }
    onEdgesChange(
      changes.map((change) =>
        change.type === 'add' || change.type === 'replace'
          ? { ...change, item: fromEngineEdge(change.item) as EdgeType }
          : change,
      ) as GraphEdgeChange<EdgeType>[],
    );
  };

  /**
   * Positions the incoming nodes carried the last time this synced.
   *
   * A drag lives in `localNodes` until the save round-trips, so an incoming
   * array that repeats the position it already had is older than what is on
   * screen, and taking it would put the node back where the drag started. An
   * incoming position that actually moved — a save landing, an auto-layout, a
   * version being viewed — is newer and wins.
   */
  const syncedPositions = useRef(new Map<string, XYPosition>());

  useEffect(() => {
    if (onNodesChange) {
      return;
    }

    const previous = syncedPositions.current;
    syncedPositions.current = new Map(initialNodes.map((node) => [node.id, node.position]));

    setLocalNodes((current) => {
      const localById = new Map(current.map((node) => [node.id, node]));

      return initialNodes.map((incoming) => {
        const local = localById.get(incoming.id);
        if (!local) {
          return incoming;
        }

        const lastSynced = previous.get(incoming.id);
        const serverHeldStill =
          lastSynced !== undefined &&
          lastSynced.x === incoming.position.x &&
          lastSynced.y === incoming.position.y;

        // Selection, drag state, and the measured size live only on the
        // canvas. The incoming nodes never carry them, so taking the array
        // wholesale would deselect everything after every save round-trip —
        // and drop every edge for a frame, see `measured` below.
        return {
          ...incoming,
          ...(local.selected !== undefined ? { selected: local.selected } : {}),
          ...(local.dragging !== undefined ? { dragging: local.dragging } : {}),
          // React Flow resets a node's handle bounds whenever the node it is
          // handed has no `measured`, and an edge with no handle bounds on
          // either end is not rendered at all. Dropping the size the canvas
          // already measured therefore unmounted every edge until the node's
          // ResizeObserver restored the bounds on the next frame.
          ...(local.measured !== undefined ? { measured: local.measured } : {}),
          position: serverHeldStill ? local.position : incoming.position,
        };
      });
    });
  }, [initialNodes, onNodesChange, setLocalNodes]);

  useEffect(() => {
    if (onEdgesChange) {
      return;
    }

    // Same contract as the nodes above: an edge's selection is canvas-local,
    // and losing it on a resync leaves Backspace with nothing to delete.
    setLocalEdges((current) => {
      const localById = new Map(current.map((edge) => [edge.id, edge]));

      return initialEdges.map((incoming) => {
        const local = localById.get(incoming.id);
        return local?.selected !== undefined ? { ...incoming, selected: local.selected } : incoming;
      });
    });
  }, [initialEdges, onEdgesChange, setLocalEdges]);

  // Memoised: React Flow subscribes to this in an effect keyed on the callback,
  // so a fresh arrow every render re-subscribes on every render.
  const handleSelectionChange = useCallback(
    ({ nodes: selected }: { nodes: EngineNode[] }) => {
      onSelectionChange?.(selected.map((node) => node.id));
    },
    [onSelectionChange],
  );

  const handleContainerKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter' || !onNodeActivate) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const focusedNode = target?.closest?.('.react-flow__node');
      // Interactive descendants own Enter; only the node itself opens its panel.
      if (!focusedNode || target !== focusedNode) return;
      const focusedNodeId = focusedNode.getAttribute('data-id');

      const node = nodes.find((candidate) => candidate.id === focusedNodeId);
      if (!node) {
        return;
      }

      event.preventDefault();
      onNodeActivate(fromEngineNode(node) as NodeType);
    },
    [nodes, onNodeActivate],
  );

  useImperativeHandle(
    ref,
    () => ({
      fit() {
        void fitView({ duration: 300, padding: 0.2, includeHiddenNodes: true });
      },
      center(nodeId: string) {
        const target = getNode(nodeId);
        if (target)
          void setCenter(
            target.position.x + (target.measured?.width ?? 0) / 2,
            target.position.y + (target.measured?.height ?? 0) / 2,
            { zoom: getZoom(), duration: 450 },
          );
      },
      animateLayout() {
        setIsRelayouting(true);
        window.clearTimeout(relayoutTimer.current);
        relayoutTimer.current = window.setTimeout(
          () => setIsRelayouting(false),
          RELAYOUT_DURATION_MS,
        );
      },
    }),
    [fitView, getNode, getZoom, setCenter],
  );
  useEffect(() => () => window.clearTimeout(relayoutTimer.current), []);

  return (
    <div
      className="ns-graph-canvas"
      role="region"
      aria-label={label}
      data-ns-height={height}
      data-ns-relayout={isRelayouting}
      data-ns-connecting={isConnecting}
    >
      <ReactFlow<EngineNode, EngineEdge>
        onKeyDown={handleContainerKeyDown}
        aria-label={label}
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          if (isInteractive) handleNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          if (isInteractive) handleEdgesChange(changes);
        }}
        onConnect={(connection) => {
          if (isInteractive) handleConnectWithSettle(connection);
        }}
        onBeforeDelete={async (items) => {
          if (!isInteractive) return false;
          if (!onBeforeDelete) return true;
          const result = await onBeforeDelete({
            nodes: items.nodes.map((node) => fromEngineNode(node) as NodeType),
            edges: items.edges.map((edge) => fromEngineEdge(edge) as EdgeType),
          });
          if (typeof result === 'boolean') return result;
          return { nodes: result.nodes.map(toEngineNode), edges: result.edges.map(toEngineEdge) };
        }}
        // An endpoint can be picked up and moved. Without `edgesReconnectable`
        // the drag handles never appear, and the edge is fixed once drawn.
        edgesReconnectable={isInteractive}
        onReconnect={(edge, connection) => {
          if (!isInteractive) return;
          const resolved = resolveReconnectHandles(connection);
          armConnectionSettle(buildCanvasEdgeId(resolved));
          if (onReconnect) onReconnect(fromEngineEdge(edge) as EdgeType, resolved);
          else
            setLocalEdges((current) =>
              current.map((item) =>
                item.id === edge.id ? connectedEdge(resolved, fromEngineEdge(item)) : item,
              ),
            );
        }}
        // The end that stays put may be pinned; the connection line reads the
        // recorded side so it draws from where the edge actually is.
        onReconnectStart={(_, edge, retainedType) =>
          recordReconnectRetainedAnchor(
            retainedType === 'source'
              ? edge.data?.model.sourceAnchor
              : edge.data?.model.targetAnchor,
          )
        }
        onReconnectEnd={clearReconnectRetainedAnchor}
        onSelectionChange={handleSelectionChange}
        onNodeClick={(event, node) => {
          if (!isControlTarget(event.target)) onNodeClick?.(fromEngineNode(node) as NodeType);
        }}
        onNodeDoubleClick={(event, node) => {
          if (!isControlTarget(event.target)) onNodeActivate?.(fromEngineNode(node) as NodeType);
        }}
        onPaneClick={() => onPaneClick?.()}
        onPaneContextMenu={(event) => onPaneContextMenu?.(event)}
        onNodeContextMenu={(event, node) =>
          onNodeContextMenu?.(
            event as unknown as MouseEvent | ReactMouseEvent,
            fromEngineNode(node) as NodeType,
          )
        }
        onNodeDragStop={(event, node, draggedNodes) => {
          if (isInteractive)
            onNodeDragStop?.(
              event,
              fromEngineNode(node) as NodeType,
              draggedNodes.map((item) => fromEngineNode(item) as NodeType),
            );
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // Loose lets a drag end on any handle regardless of its type, which is
        // what makes the whole target node a drop zone.
        connectionMode={ConnectionMode.Loose}
        connectionLineComponent={GraphConnectionLine}
        isValidConnection={(connection) => connection.source !== connection.target}
        fitView
        fitViewOptions={{ padding: 0.16, minZoom: 0.1 }}
        minZoom={0.1}
        maxZoom={1.5}
        nodesConnectable={isInteractive}
        nodesDraggable={isInteractive}
        elementsSelectable
        nodesFocusable
        proOptions={{ hideAttribution: true }}
        className="ns-graph-viewport"
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="var(--ns-border)" />
        {title ? (
          <Panel position="top-left" className="ns-graph-panel">
            <div className="ns-graph-caption">
              <h2>{title}</h2>
              {description ? <p>{description}</p> : null}
            </div>
          </Panel>
        ) : null}
        {footer ? (
          <Panel position="bottom-left" className="ns-graph-panel">
            {footer}
          </Panel>
        ) : null}
        {controls ? (
          <Panel position="bottom-right" className="ns-graph-panel">
            {controls}
          </Panel>
        ) : null}
      </ReactFlow>

      {overlay ? <div className="ns-graph-overlay">{overlay}</div> : null}
    </div>
  );
}

function isControlTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        'button, a, input, select, textarea, [contenteditable="true"], [role="button"], [role="checkbox"], [role="combobox"]',
      ),
    )
  );
}

export function GraphCanvas<NodeType extends GraphNode, EdgeType extends GraphEdge>(
  props: GraphCanvasProps<NodeType, EdgeType>,
) {
  return (
    <ReactFlowProvider>
      <GraphGestureProvider>
        <GraphCanvasInner {...props} />
      </GraphGestureProvider>
    </ReactFlowProvider>
  );
}
