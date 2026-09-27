import { Position, type InternalNode, type Node } from '@xyflow/react';

/**
 * Where an edge meets a node.
 *
 * Nodes have no fixed anchors any more, so an edge cannot ask a handle where to
 * start. It works the endpoint out from geometry instead: the point where the
 * line between the two node centres crosses the node's own border. Move either
 * node and the edge slides around the border to keep facing the other one.
 */

type Measured = { width: number; height: number };

function getMeasured(node: InternalNode<Node>): Measured | null {
  const width = node.measured?.width;
  const height = node.measured?.height;

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

function getCentre(node: InternalNode<Node>, measured: Measured) {
  return {
    x: node.internals.positionAbsolute.x + measured.width / 2,
    y: node.internals.positionAbsolute.y + measured.height / 2,
  };
}

/**
 * The point on `node`'s border that faces `other`.
 *
 * Solves the rectangle-line intersection in the node's own normalised space,
 * which is why the two halves are divided out before the sum is scaled back.
 * Same approach as React Flow's floating-edges example.
 */
function getBorderPoint(
  node: InternalNode<Node>,
  nodeMeasured: Measured,
  other: InternalNode<Node>,
  otherMeasured: Measured,
) {
  const halfWidth = nodeMeasured.width / 2;
  const halfHeight = nodeMeasured.height / 2;
  const centre = getCentre(node, nodeMeasured);
  const otherCentre = getCentre(other, otherMeasured);

  const dx = (otherCentre.x - centre.x) / (2 * halfWidth);
  const dy = (otherCentre.y - centre.y) / (2 * halfHeight);

  const u = dx - dy;
  const v = dx + dy;
  const scale = 1 / (Math.abs(u) + Math.abs(v) || 1);

  return {
    x: halfWidth * (scale * u + scale * v) + centre.x,
    y: halfHeight * (-scale * u + scale * v) + centre.y,
  };
}

/** Which border the point landed on, so the bezier leaves at a sane angle. */
function getBorderSide(
  node: InternalNode<Node>,
  measured: Measured,
  point: { x: number; y: number },
): Position {
  const left = Math.round(node.internals.positionAbsolute.x);
  const top = Math.round(node.internals.positionAbsolute.y);
  const x = Math.round(point.x);
  const y = Math.round(point.y);

  if (x <= left + 1) {
    return Position.Left;
  }
  if (x >= left + measured.width - 1) {
    return Position.Right;
  }
  if (y <= top + 1) {
    return Position.Top;
  }

  return Position.Bottom;
}

/**
 * A pinned attachment. Absent means the endpoint floats and keeps facing the
 * other node; set means the user chose that border and it stays there.
 */
import type { EdgeAnchorSide } from '../../blocks/graph-types.js';
export type { EdgeAnchorSide };

const ANCHOR_POSITIONS: Record<EdgeAnchorSide, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

export function isEdgeAnchorSide(value: unknown): value is EdgeAnchorSide {
  return value === 'top' || value === 'right' || value === 'bottom' || value === 'left';
}

/** The midpoint of a pinned border. */
function getAnchorPoint(node: InternalNode<Node>, measured: Measured, side: EdgeAnchorSide) {
  const { x, y } = node.internals.positionAbsolute;

  switch (side) {
    case 'top':
      return { x: x + measured.width / 2, y };
    case 'bottom':
      return { x: x + measured.width / 2, y: y + measured.height };
    case 'left':
      return { x, y: y + measured.height / 2 };
    case 'right':
      return { x: x + measured.width, y: y + measured.height / 2 };
  }
}

export type FloatingEdgeParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
};

/**
 * Returns `null` until React Flow has measured both nodes. The edge falls back
 * to the handle-based coordinates for that first frame rather than drawing a
 * line through the origin.
 */
export function getFloatingEdgeParams(
  source: InternalNode<Node> | undefined,
  target: InternalNode<Node> | undefined,
  anchors?: { source?: EdgeAnchorSide | undefined; target?: EdgeAnchorSide | undefined },
): FloatingEdgeParams | null {
  if (!source || !target) {
    return null;
  }

  const sourceMeasured = getMeasured(source);
  const targetMeasured = getMeasured(target);

  if (!sourceMeasured || !targetMeasured) {
    return null;
  }

  // A pinned side wins over the facing-border solve. That is the whole point of
  // pinning: the edge stays where it was put, even when moving a node would
  // otherwise swing it to another border.
  const sourcePoint = anchors?.source
    ? getAnchorPoint(source, sourceMeasured, anchors.source)
    : getBorderPoint(source, sourceMeasured, target, targetMeasured);
  const targetPoint = anchors?.target
    ? getAnchorPoint(target, targetMeasured, anchors.target)
    : getBorderPoint(target, targetMeasured, source, sourceMeasured);

  return {
    sourceX: sourcePoint.x,
    sourceY: sourcePoint.y,
    targetX: targetPoint.x,
    targetY: targetPoint.y,
    sourcePosition: anchors?.source
      ? ANCHOR_POSITIONS[anchors.source]
      : getBorderSide(source, sourceMeasured, sourcePoint),
    targetPosition: anchors?.target
      ? ANCHOR_POSITIONS[anchors.target]
      : getBorderSide(target, targetMeasured, targetPoint),
  };
}

/**
 * The bezier for an edge, with a capped hook on a pinned end that faces away
 * from the other one.
 *
 * React Flow's `getBezierPath` pulls each control point out of the side it is
 * given, and its opposing-side offset grows without bound
 * (`curvature * 25 * sqrt(distance)`). Pin the left border and connect to a
 * node on the right, and the control point sat 97px out the back — the curve
 * left the node the wrong way and swept round in an S. The aligned case is
 * unchanged. The opposing case keeps a short stub, so the edge still exits
 * perpendicular from the pinned border and then turns.
 */
const OPPOSING_CONTROL_STUB = 24;

function getControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance;
  }

  return Math.min(curvature * 25 * Math.sqrt(-distance), OPPOSING_CONTROL_STUB);
}

function getControlPoint(
  position: Position,
  x: number,
  y: number,
  otherX: number,
  otherY: number,
  curvature: number,
): { x: number; y: number } {
  switch (position) {
    case Position.Left:
      return { x: x - getControlOffset(x - otherX, curvature), y };
    case Position.Right:
      return { x: x + getControlOffset(otherX - x, curvature), y };
    case Position.Top:
      return { x, y: y - getControlOffset(y - otherY, curvature) };
    case Position.Bottom:
      return { x, y: y + getControlOffset(otherY - y, curvature) };
  }
}

/** Same shape as `getBezierPath`: the path and the label point. */
export function getFlowEdgePath(
  params: FloatingEdgeParams & { curvature?: number },
): [string, number, number] {
  const curvature = params.curvature ?? 0.2;
  const sourceControl = getControlPoint(
    params.sourcePosition,
    params.sourceX,
    params.sourceY,
    params.targetX,
    params.targetY,
    curvature,
  );
  const targetControl = getControlPoint(
    params.targetPosition,
    params.targetX,
    params.targetY,
    params.sourceX,
    params.sourceY,
    curvature,
  );

  // The cubic at t = 0.5, the same label point React Flow uses.
  const labelX =
    params.sourceX * 0.125 +
    sourceControl.x * 0.375 +
    targetControl.x * 0.375 +
    params.targetX * 0.125;
  const labelY =
    params.sourceY * 0.125 +
    sourceControl.y * 0.375 +
    targetControl.y * 0.375 +
    params.targetY * 0.125;

  return [
    `M${params.sourceX},${params.sourceY} C${sourceControl.x},${sourceControl.y} ${targetControl.x},${targetControl.y} ${params.targetX},${params.targetY}`,
    labelX,
    labelY,
  ];
}

/**
 * The in-progress connection line: where it leaves the node it is anchored to.
 *
 * With a pinned side it starts at that border's midpoint, which is exactly
 * where the finished edge will start — the drag previews the result. Without
 * one it leaves the border facing the pointer, the way a floating endpoint
 * will.
 */
export function getConnectionLineStart(
  source: InternalNode<Node> | undefined,
  pointer: { x: number; y: number },
  pinnedSide?: EdgeAnchorSide,
): { x: number; y: number; position: Position } | null {
  const measured = source ? getMeasured(source) : null;

  if (!source || !measured) {
    return null;
  }

  if (pinnedSide) {
    return {
      ...getAnchorPoint(source, measured, pinnedSide),
      position: ANCHOR_POSITIONS[pinnedSide],
    };
  }

  const pointerAsNode = {
    measured: { width: 1, height: 1 },
    internals: { positionAbsolute: pointer },
  } as InternalNode<Node>;

  const point = getBorderPoint(source, measured, pointerAsNode, {
    width: 1,
    height: 1,
  });

  return { ...point, position: getBorderSide(source, measured, point) };
}

/**
 * The border of `node` closest to `point`.
 *
 * A release on the node body has to pin somewhere, and the border the pointer
 * came nearest is the one the user was reaching for. Distance is measured to
 * each of the four edges of the node, so a release near a corner picks the side
 * it is truly closer to rather than a fixed preference.
 */
export function getNearestBorderSide(
  node: InternalNode<Node> | undefined,
  point: { x: number; y: number },
): EdgeAnchorSide | undefined {
  const measured = node ? getMeasured(node) : null;

  if (!node || !measured) {
    return undefined;
  }

  const left = node.internals.positionAbsolute.x;
  const top = node.internals.positionAbsolute.y;

  const distances: Record<EdgeAnchorSide, number> = {
    left: Math.abs(point.x - left),
    right: Math.abs(left + measured.width - point.x),
    top: Math.abs(point.y - top),
    bottom: Math.abs(top + measured.height - point.y),
  };

  return (Object.keys(distances) as EdgeAnchorSide[]).reduce((nearest, side) =>
    distances[side] < distances[nearest] ? side : nearest,
  );
}

/** Unit vector pointing out of the border an endpoint meets. */
const BORDER_NORMALS: Record<Position, { x: number; y: number }> = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
};

/**
 * How much curve an edge earns, given the borders it is pinned to.
 *
 * A bezier pushes its control point straight out of the side it is given. When
 * that side faces away from the other node the line leaves backwards before it
 * turns around: grabbing the left band of a node whose target is to the right
 * sent the start 112px the wrong way and bowed the path 29px off straight.
 *
 * A pinned edge must still leave its border, so the answer is a shorter stub,
 * not a straight line. An end that already faces the other node keeps the full
 * curve, so every arrangement that looked right still does.
 */
export function getPinnedCurvature(geometry: FloatingEdgeParams, base: number): number {
  const dx = geometry.targetX - geometry.sourceX;
  const dy = geometry.targetY - geometry.sourceY;
  const span = Math.hypot(dx, dy);

  if (span === 0) {
    return base;
  }

  const toTarget = { x: dx / span, y: dy / span };
  const sourceNormal = BORDER_NORMALS[geometry.sourcePosition];
  const targetNormal = BORDER_NORMALS[geometry.targetPosition];

  // Positive means the border faces the way the edge travels.
  const sourceFacing = sourceNormal.x * toTarget.x + sourceNormal.y * toTarget.y;
  const targetFacing = targetNormal.x * -toTarget.x + targetNormal.y * -toTarget.y;
  const worst = Math.min(sourceFacing, targetFacing);

  if (worst >= 0) {
    return base;
  }

  return base * (0.15 + 0.85 * ((worst + 1) / 2));
}
