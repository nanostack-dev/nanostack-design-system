import type { Edge, Node } from '@xyflow/react';
import type { GraphEdge, GraphNode } from '../../blocks/graph-types.js';

export type EngineNode = Node<{ model: GraphNode }, 'block'>;
export type EngineEdge = Edge<{ model: GraphEdge }, 'graph'>;

/** Copy only supported data. A JavaScript object cannot smuggle engine styling props. */
export function toEngineNode(model: GraphNode): EngineNode {
  return {
    id: model.id,
    type: 'block',
    position: { x: model.position.x, y: model.position.y },
    data: { model },
    ...(model.selected === undefined ? {} : { selected: model.selected }),
    ...(model.measured === undefined ? {} : { measured: model.measured }),
    ...(model.hidden === undefined ? {} : { hidden: model.hidden }),
    ...(model.draggable === undefined ? {} : { draggable: model.draggable }),
    ...(model.connectable === undefined ? {} : { connectable: model.connectable }),
    ...(model.selectable === undefined ? {} : { selectable: model.selectable }),
    ...(model.deletable === undefined ? {} : { deletable: model.deletable }),
    ...(model.ariaLabel === undefined ? {} : { ariaLabel: model.ariaLabel }),
  };
}

export function toEngineEdge(model: GraphEdge): EngineEdge {
  return {
    id: model.id,
    type: 'graph',
    source: model.source,
    target: model.target,
    data: { model },
    ...(model.selected === undefined ? {} : { selected: model.selected }),
    ...(model.hidden === undefined ? {} : { hidden: model.hidden }),
    ...(model.deletable === undefined ? {} : { deletable: model.deletable }),
  };
}

export function fromEngineNode(node: EngineNode): GraphNode {
  return {
    ...node.data.model,
    position: node.position,
    ...(node.selected === undefined ? {} : { selected: node.selected }),
    ...(node.dragging === undefined ? {} : { dragging: node.dragging }),
    ...(node.measured === undefined ? {} : { measured: node.measured }),
  };
}

export function fromEngineEdge(edge: EngineEdge): GraphEdge {
  if (!edge.data) throw new Error('Graph edge data is missing.');
  return {
    ...edge.data.model,
    ...(edge.selected === undefined ? {} : { selected: edge.selected }),
  };
}
