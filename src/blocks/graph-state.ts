import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import {
  fromEngineEdge,
  fromEngineNode,
  toEngineEdge,
  toEngineNode,
} from '../internal/graph/model.js';
import type { GraphEdge, GraphEdgeChange, GraphNode, GraphNodeChange } from './graph-types.js';

/** Apply canvas events while retaining application data and closed variants. */
export function applyGraphNodeChanges<NodeType extends GraphNode>(
  changes: GraphNodeChange<NodeType>[],
  nodes: NodeType[],
): NodeType[] {
  const engineChanges = changes.map((change) =>
    change.type === 'add' || change.type === 'replace'
      ? { ...change, item: toEngineNode(change.item) }
      : change,
  );
  return applyNodeChanges(engineChanges, nodes.map(toEngineNode)).map(
    (node) => fromEngineNode(node) as NodeType,
  );
}
export function applyGraphEdgeChanges<EdgeType extends GraphEdge>(
  changes: GraphEdgeChange<EdgeType>[],
  edges: EdgeType[],
): EdgeType[] {
  const engineChanges = changes.map((change) =>
    change.type === 'add' || change.type === 'replace'
      ? { ...change, item: toEngineEdge(change.item) }
      : change,
  );
  return applyEdgeChanges(engineChanges, edges.map(toEngineEdge)).map(
    (edge) => fromEngineEdge(edge) as EdgeType,
  );
}
export function addGraphEdge<EdgeType extends GraphEdge>(
  edge: EdgeType,
  edges: EdgeType[],
): EdgeType[] {
  return addEdge(toEngineEdge(edge), edges.map(toEngineEdge)).map(
    (item) => fromEngineEdge(item) as EdgeType,
  );
}
