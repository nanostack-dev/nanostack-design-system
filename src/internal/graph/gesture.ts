import type { Position } from '@xyflow/react';

import type { EdgeAnchorSide } from './geometry.js';

/**
 * Transient state of the connection gesture in flight.
 *
 * Three parties need it and none of them can reach the others. The connection
 * line knows where it drew, the canvas knows which edge a release produced,
 * and the edge that appears wants to travel from the line's last position
 * instead of teleporting to its resolved geometry. React Flow clears its
 * connection state before `onConnect` runs, so this module carries the
 * hand-off. Every read is gated on freshness — stale state cannot leak into
 * an unrelated mount.
 */

export type ConnectionLineSnapshot = {
  fromX: number;
  fromY: number;
  fromPosition: Position;
  toX: number;
  toY: number;
  toPosition: Position;
};

const SETTLE_MAX_AGE_MS = 400;

export function createGraphGestureStore() {
  let lineSnapshot: (ConnectionLineSnapshot & { at: number }) | null = null;
  let armedEdge: { id: string; at: number } | null = null;

  function recordConnectionLine(snapshot: ConnectionLineSnapshot): void {
    lineSnapshot = { ...snapshot, at: performance.now() };
  }

  /** Marks `edgeId` as the edge the release is about to produce. */
  function armConnectionSettle(edgeId: string): void {
    armedEdge = { id: edgeId, at: performance.now() };
  }

  /**
   * The line geometry to settle from, if `edgeId` is the edge the gesture just
   * produced. Freshness does the cleanup: the snapshot is not consumed, so a
   * StrictMode double mount settles the same edge twice instead of losing the
   * animation.
   */
  function takeConnectionSettle(edgeId: string): ConnectionLineSnapshot | null {
    const now = performance.now();

    if (!armedEdge || armedEdge.id !== edgeId) {
      return null;
    }
    if (now - armedEdge.at > SETTLE_MAX_AGE_MS) {
      return null;
    }
    if (!lineSnapshot || now - lineSnapshot.at > SETTLE_MAX_AGE_MS) {
      return null;
    }

    return lineSnapshot;
  }

  /**
   * The end that stays put while the other end of an edge is dragged.
   *
   * `null` means no reconnect is in flight. A record whose `side` is undefined
   * means a reconnect IS in flight and that end carries no pin, so it should
   * float and keep facing the pointer. The two cases must stay distinct: React
   * Flow resolves the retained end from `edge.sourceHandle`/`targetHandle`, which
   * this canvas never sets, so it falls back to the node's first handle — a top
   * one. Reading the side off that handle swings the far end to the top of its
   * node the moment an endpoint is picked up.
   */
  let retained: { side: EdgeAnchorSide | undefined } | null = null;

  function recordReconnectRetainedAnchor(side: EdgeAnchorSide | undefined): void {
    retained = { side };
  }

  function clearReconnectRetainedAnchor(): void {
    retained = null;
  }

  function getReconnectRetained(): {
    side: EdgeAnchorSide | undefined;
  } | null {
    return retained;
  }

  return {
    recordConnectionLine,
    armConnectionSettle,
    takeConnectionSettle,
    recordReconnectRetainedAnchor,
    clearReconnectRetainedAnchor,
    getReconnectRetained,
  };
}
