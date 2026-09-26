import { describe, expect, it, vi } from 'vitest';
import { Position } from '@xyflow/react';
import { toEngineEdge, toEngineNode } from '../src/internal/graph/model.js';
import { createGraphGestureStore } from '../src/internal/graph/gesture.js';
import { applyGraphNodeChanges, applyGraphEdgeChanges } from '../src/blocks/graph-state.js';
import type { GraphNode, GraphEdge } from '../src/blocks/graph-types.js';

const node: GraphNode = {
  id: 'a',
  position: { x: 0, y: 0 },
  data: { title: 'First' },
  width: 'compact',
};

describe('graph adapter boundaries', () => {
  it('never forwards untyped CSS, engine dimensions, marker objects or renderer bags', () => {
    const unsafe = {
      ...node,
      className: 'custom',
      style: { width: 900 },
      width: 900,
      height: 900,
      domAttributes: { style: { color: 'red' } },
      nodeTypes: { injected: () => null },
    } as unknown as GraphNode;
    const rendered = toEngineNode(unsafe);
    expect(rendered.type).toBe('block');
    for (const prop of ['className', 'style', 'width', 'height', 'domAttributes', 'nodeTypes'])
      expect(rendered).not.toHaveProperty(prop);
    const edge = toEngineEdge({
      id: 'a-b',
      source: 'a',
      target: 'b',
      style: { stroke: 'red' },
      markerEnd: { type: 'custom' },
      type: 'injected',
      domAttributes: {},
    } as unknown as GraphEdge);
    expect(edge.type).toBe('graph');
    for (const prop of ['style', 'markerEnd', 'domAttributes'])
      expect(edge).not.toHaveProperty(prop);
  });

  it('retains application data, selection, drag positions and reported measurements across updates', () => {
    const moved = applyGraphNodeChanges(
      [
        { type: 'position', id: 'a', position: { x: 100, y: 80 }, dragging: true },
        { type: 'dimensions', id: 'a', dimensions: { width: 240, height: 180 } },
        { type: 'select', id: 'a', selected: true },
      ],
      [node],
    );
    expect(moved[0]).toMatchObject({
      data: { title: 'First' },
      width: 'compact',
      position: { x: 100, y: 80 },
      measured: { width: 240, height: 180 },
      selected: true,
      dragging: true,
    });
    expect(
      applyGraphNodeChanges([{ type: 'position', id: 'a', dragging: false }], moved)[0]?.measured,
    ).toEqual({ width: 240, height: 180 });
    const edge: GraphEdge = {
      id: 'a-b',
      source: 'a',
      target: 'b',
      sourceAnchor: 'right',
      targetAnchor: 'left',
      data: { business: true },
    };
    expect(
      applyGraphEdgeChanges([{ type: 'select', id: 'a-b', selected: true }], [edge])[0],
    ).toEqual({ ...edge, selected: true });
  });

  it('isolates gesture snapshots and reconnect pins between simultaneous canvases', () => {
    vi.spyOn(performance, 'now').mockReturnValue(100);
    const first = createGraphGestureStore();
    const second = createGraphGestureStore();
    const snapshot = {
      fromX: 0,
      fromY: 0,
      fromPosition: Position.Right,
      toX: 100,
      toY: 100,
      toPosition: Position.Left,
    };
    first.recordConnectionLine(snapshot);
    first.armConnectionSettle('same-id');
    first.recordReconnectRetainedAnchor('right');
    expect(first.takeConnectionSettle('same-id')).toMatchObject(snapshot);
    expect(second.takeConnectionSettle('same-id')).toBeNull();
    expect(second.getReconnectRetained()).toBeNull();
    vi.spyOn(performance, 'now').mockReturnValue(600);
    expect(first.takeConnectionSettle('same-id')).toBeNull();
    vi.restoreAllMocks();
  });
});
