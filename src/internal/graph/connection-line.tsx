import { useLayoutEffect } from 'react';

import {
  getBezierPath,
  Position,
  useStore,
  type ConnectionLineComponentProps,
} from '@xyflow/react';

import { graphAnchorSideFromHandle as anchorSideFromHandle } from '../../blocks/graph-types.js';
import { getConnectionLineStart } from './geometry.js';
import { useGraphGestureStore } from './context.js';
import type { EngineNode } from './model.js';

/**
 * The line drawn while a connection is in flight.
 *
 * Both ends preview the result. The anchored end starts where the finished
 * edge will start: on the grabbed border's midpoint for a new connection, on
 * the retained end's pinned border for a reconnect, and facing the pointer
 * when that end floats. The far end rides the raw pointer — React Flow's own
 * `to` snaps to the centre of whatever handle the pointer is over, and the
 * whole-node drop target makes that snap a teleport to the node's centre.
 */
/**
 * Which way the line arrives at the pointer.
 *
 * The pointer has no border to meet, so this end used to be pinned to `Top`.
 * A bezier pulls its control point out of the side it is given, so the line
 * always reached up and over before it came back down — drag left or down and
 * it hooked against the direction of travel. Facing the way the drag is going
 * makes it read as one line the pointer is pulling.
 */
function getPointerSide(from: { x: number; y: number }, to: { x: number; y: number }): Position {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ? Position.Left : Position.Right;
  }

  return dy > 0 ? Position.Top : Position.Bottom;
}

export function GraphConnectionLine({
  toX,
  toY,
  fromNode,
  fromHandle,
  pointer,
}: ConnectionLineComponentProps<EngineNode>) {
  // `pointer` is container-relative; the transform maps it into flow space.
  const { recordConnectionLine, getReconnectRetained } = useGraphGestureStore();
  const [translateX, translateY, zoom] = useStore((state) => state.transform);
  const endX = pointer ? (pointer.x - translateX) / zoom : toX;
  const endY = pointer ? (pointer.y - translateY) / zoom : toY;

  // A reconnect wins outright, including when the retained end has no pin: its
  // record is the only honest source. React Flow's own `fromHandle` is a
  // fallback it picked, not the border this edge actually meets.
  const retained = getReconnectRetained();
  const pinnedSide = retained ? retained.side : anchorSideFromHandle(fromHandle?.id);
  const start = getConnectionLineStart(fromNode, { x: endX, y: endY }, pinnedSide);

  const sourceX = start?.x ?? endX;
  const sourceY = start?.y ?? endY;
  const sourcePosition = start?.position ?? Position.Bottom;
  const targetPosition = getPointerSide({ x: sourceX, y: sourceY }, { x: endX, y: endY });

  // In an effect, not the render body. Recording is a side effect, and React
  // may render this component without committing it — a discarded render would
  // otherwise publish a position that never reached the screen, and the settle
  // would travel from somewhere the line never was.
  useLayoutEffect(() => {
    recordConnectionLine({
      fromX: sourceX,
      fromY: sourceY,
      fromPosition: sourcePosition,
      toX: endX,
      toY: endY,
      toPosition: targetPosition,
    });
  }, [sourceX, sourceY, sourcePosition, endX, endY, targetPosition, recordConnectionLine]);

  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: endX,
    targetY: endY,
    targetPosition,
    curvature: 0.2,
  });

  return (
    <g>
      <path
        d={path}
        fill="none"
        className="ns-graph-connection-path"
        strokeWidth={2}
        strokeDasharray="6 6"
      />
      <circle cx={endX} cy={endY} r={4} className="ns-graph-connection-pointer" strokeWidth={2} />
    </g>
  );
}
