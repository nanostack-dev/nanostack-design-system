import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { ConnectionLineSnapshot } from './gesture.js';
import { useGraphGestureStore } from './context.js';
import type { EdgeAnchorSide, FloatingEdgeParams } from './geometry.js';

/**
 * Travels a just-drawn edge from where the connection line last was to where
 * the edge resolved. Without it the endpoint jumps from the release point to
 * the pinned border's midpoint in a single frame — an SVG path `d` cannot be
 * CSS-transitioned, so the travel has to be computed.
 *
 * It arms on mount and whenever the edge's pinned anchors change, which
 * covers a new connection, a reconnect onto another node (new edge id), and a
 * reconnect onto another border of the same node (same id, new anchor). The
 * gesture store only answers for the edge the release actually produced, so
 * every other mount renders its resolved geometry straight away.
 */

const SETTLE_DURATION_MS = 160;
/** Shortened, not removed: the snap is the thing the travel exists to prevent. */
const SETTLE_REDUCED_MOTION_DURATION_MS = 120;

/** The `--ease-out` token, cubic-bezier(0.23, 1, 0.32, 1), evaluated in JS. */
const EASE_OUT_X1 = 0.23;
const EASE_OUT_Y1 = 1;
const EASE_OUT_X2 = 0.32;
const EASE_OUT_Y2 = 1;

function sampleCurve(t: number, p1: number, p2: number): number {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * p1 + 3 * inverse * t * t * p2 + t * t * t;
}

function sampleDerivative(t: number, p1: number, p2: number): number {
  const inverse = 1 - t;
  return 3 * inverse * inverse * p1 + 6 * inverse * t * (p2 - p1) + 3 * t * t * (1 - p2);
}

function easeOut(x: number): number {
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }

  let t = x;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const slope = sampleDerivative(t, EASE_OUT_X1, EASE_OUT_X2);
    if (slope === 0) {
      break;
    }
    t -= (sampleCurve(t, EASE_OUT_X1, EASE_OUT_X2) - x) / slope;
  }

  return sampleCurve(t, EASE_OUT_Y1, EASE_OUT_Y2);
}

type SettleState = {
  origin: ConnectionLineSnapshot;
  swapEnds: boolean;
  startedAt: number;
  duration: number;
};

function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

export function useEdgeSettle(
  edgeId: string,
  geometry: FloatingEdgeParams,
  anchors: { source?: EdgeAnchorSide | undefined; target?: EdgeAnchorSide | undefined },
): { originGeometry: FloatingEdgeParams | null; progress: number } {
  const { takeConnectionSettle } = useGraphGestureStore();
  const anchorKey = `${anchors.source ?? ''}:${anchors.target ?? ''}`;
  const [settle, setSettle] = useState<SettleState | null>(null);
  const [progress, setProgress] = useState(1);

  const geometryRef = useRef(geometry);
  const lastAnchorKey = useRef<string | null>(null);

  // Declared before the anchor effect, so the ref is fresh when it reads it.
  useLayoutEffect(() => {
    geometryRef.current = geometry;
  });

  useLayoutEffect(() => {
    if (lastAnchorKey.current === anchorKey) {
      return;
    }
    lastAnchorKey.current = anchorKey;

    const origin = takeConnectionSettle(edgeId);
    if (!origin) {
      return;
    }

    // A source-end reconnect draws its line from the retained target, so the
    // snapshot's ends can arrive swapped. The pairing with the shorter total
    // travel is the right one.
    const current = geometryRef.current;
    const straight =
      distance(origin.fromX, origin.fromY, current.sourceX, current.sourceY) +
      distance(origin.toX, origin.toY, current.targetX, current.targetY);
    const swapped =
      distance(origin.fromX, origin.fromY, current.targetX, current.targetY) +
      distance(origin.toX, origin.toY, current.sourceX, current.sourceY);

    setSettle({
      origin,
      swapEnds: swapped < straight,
      startedAt: performance.now(),
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? SETTLE_REDUCED_MOTION_DURATION_MS
        : SETTLE_DURATION_MS,
    });
    setProgress(0);
  }, [anchorKey, edgeId, takeConnectionSettle]);

  useEffect(() => {
    if (!settle) {
      return;
    }

    let frame: number;
    const tick = () => {
      const elapsed = performance.now() - settle.startedAt;
      if (elapsed >= settle.duration) {
        setProgress(1);
        setSettle(null);
        return;
      }
      setProgress(easeOut(elapsed / settle.duration));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [settle]);

  if (!settle || progress >= 1) {
    return { originGeometry: null, progress: 1 };
  }

  const { origin, swapEnds } = settle;
  const originGeometry: FloatingEdgeParams = swapEnds
    ? {
        sourceX: origin.toX,
        sourceY: origin.toY,
        sourcePosition: origin.toPosition,
        targetX: origin.fromX,
        targetY: origin.fromY,
        targetPosition: origin.fromPosition,
      }
    : {
        sourceX: origin.fromX,
        sourceY: origin.fromY,
        sourcePosition: origin.fromPosition,
        targetX: origin.toX,
        targetY: origin.toY,
        targetPosition: origin.toPosition,
      };

  return { originGeometry, progress };
}

const PATH_NUMBER_PATTERN = /-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi;

/**
 * Interpolates two paths from `getBezierPath` number by number. Both come
 * from the same generator, so the shapes always align; `null` says they did
 * not, and the caller falls back to the finished path.
 */
export function lerpEdgePath(from: string, to: string, progress: number): string | null {
  const fromNumbers = from.match(PATH_NUMBER_PATTERN);
  const toNumbers = to.match(PATH_NUMBER_PATTERN);

  if (!fromNumbers || !toNumbers || fromNumbers.length !== toNumbers.length) {
    return null;
  }

  let index = 0;
  return to.replace(PATH_NUMBER_PATTERN, (match) => {
    const start = Number(fromNumbers[index]);
    index += 1;
    return String(start + (Number(match) - start) * progress);
  });
}
