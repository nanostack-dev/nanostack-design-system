import type { CSSProperties } from 'react';

import { useLayoutEffect, useRef } from 'react';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useInternalNode,
  type EdgeProps,
} from '@xyflow/react';

import { getFloatingEdgeParams, getPinnedCurvature } from './geometry.js';
import { useGraphEdgePresentation } from './presentation.js';
import type { EngineEdge } from './model.js';
import { lerpEdgePath, useEdgeSettle } from './use-edge-settle.js';

/**
 * How far a reconnect anchor sits back from the border it meets.
 *
 * An endpoint lands on the node's border, and the border carries the 12px
 * connect band. Nodes render above edges, so an anchor left on the endpoint is
 * covered by that band and the pointer never reaches it — the drag starts a new
 * connection instead of moving the end of this one. Standing the anchor off the
 * border clears the band and keeps it on the line.
 */
const ANCHOR_STANDOFF = 14;

/**
 * The target anchor stands off further, because that end carries the arrowhead.
 *
 * The head is 9px long, measured back from the border. At the shared standoff
 * the dot's near edge landed 1px from the head's tail, so the two read as one
 * smeared blob. Clearing the head plus the dot's own radius puts a real gap
 * between them: 9 for the head, 4 for the radius, 5 of air.
 */
const TARGET_ANCHOR_STANDOFF = 18;

/** Unit vector pointing away from the node, out of the border it meets. */
const awayFromNode: Record<Position, { x: number; y: number }> = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
};

/** The head sits on the border it arrives at, pointing into the node. */
const arrowRotationByTargetSide: Record<Position, number> = {
  [Position.Left]: 0,
  [Position.Right]: 180,
  [Position.Top]: 90,
  [Position.Bottom]: 270,
};

export function GraphEdgeRenderer({
  id,
  source,
  target,
  data: engineData,
  selected,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}: EdgeProps<EngineEdge>) {
  const data = engineData?.model;
  const presentation = useGraphEdgePresentation(id);
  // Endpoints come from the two nodes' geometry, not from a handle, so the edge
  // meets whichever border faces the other node. The props are the fallback for
  // the frame before React Flow has measured them.
  const floating = getFloatingEdgeParams(useInternalNode(source), useInternalNode(target), {
    source: data?.sourceAnchor,
    target: data?.targetAnchor,
  });
  const geometry = floating ?? {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };
  const tone = presentation?.tone ?? data?.tone ?? 'neutral';
  const phase = presentation?.phase;
  const travelMs = Number.isFinite(presentation?.travelMs)
    ? Math.max(0, Math.min(presentation!.travelMs!, 60_000))
    : 340;
  const shouldAnimate = data?.motion === 'flow';
  const dashDuration = tone === 'danger' ? '1s' : '1.5s';

  const [finalPath, finalLabelX, finalLabelY] = getBezierPath({
    ...geometry,
    curvature: getPinnedCurvature(geometry, 0.2),
  });

  // A just-released connection travels from where its line was to where the
  // edge resolved, instead of teleporting there in one frame.
  const { originGeometry, progress } = useEdgeSettle(id, geometry, {
    source: data?.sourceAnchor,
    target: data?.targetAnchor,
  });

  let path = finalPath;
  let labelX = finalLabelX;
  let labelY = finalLabelY;
  let drawnTargetX = geometry.targetX;
  let drawnTargetY = geometry.targetY;

  if (originGeometry) {
    const [originPath, originLabelX, originLabelY] = getBezierPath({
      ...originGeometry,
      curvature: getPinnedCurvature(originGeometry, 0.2),
    });
    path = lerpEdgePath(originPath, finalPath, progress) ?? finalPath;
    labelX = originLabelX + (finalLabelX - originLabelX) * progress;
    labelY = originLabelY + (finalLabelY - originLabelY) * progress;
    drawnTargetX = originGeometry.targetX + (geometry.targetX - originGeometry.targetX) * progress;
    drawnTargetY = originGeometry.targetY + (geometry.targetY - originGeometry.targetY) * progress;
  }

  /**
   * React Flow draws the two reconnect anchors from the handle it resolved for
   * the edge, and a floating edge ends wherever its geometry says. The two
   * disagree, so the anchors sat on the node tops while the edge ran between
   * two side borders — the grab point was never on the line.
   *
   * The anchors are siblings of this component inside the edge's own `<g>`, so
   * move them onto the real endpoints. Everything else about reconnect —
   * validity, the `connectingto` state, `onReconnect` — keeps working, because
   * the drag reads the pointer, not the circle.
   *
   * Their radius stays untouched: it is the hit area, and the visible dot is
   * drawn separately below. Sizing the circle itself would shrink the target
   * to whatever the dot looks like.
   */
  const anchorRef = useRef<SVGGElement>(null);

  // Two short edges would put the pair on top of each other, so the standoff
  // never eats more than a third of the run.
  const span = Math.hypot(geometry.targetX - geometry.sourceX, geometry.targetY - geometry.sourceY);
  const sourceStandoff = Math.min(ANCHOR_STANDOFF, span / 3);
  const targetStandoff = Math.min(TARGET_ANCHOR_STANDOFF, span / 3);

  const sourceStep = awayFromNode[geometry.sourcePosition];
  const targetStep = awayFromNode[geometry.targetPosition];

  const anchors = {
    sourceX: geometry.sourceX + sourceStep.x * sourceStandoff,
    sourceY: geometry.sourceY + sourceStep.y * sourceStandoff,
    targetX: geometry.targetX + targetStep.x * targetStandoff,
    targetY: geometry.targetY + targetStep.y * targetStandoff,
  };

  useLayoutEffect(() => {
    const group = anchorRef.current?.parentElement;
    if (!group) {
      return;
    }

    const place = (selector: string, x: number, y: number) => {
      const anchor = group.querySelector(selector);
      if (anchor) {
        anchor.setAttribute('cx', String(x));
        anchor.setAttribute('cy', String(y));
      }
    };

    place('.react-flow__edgeupdater-source', anchors.sourceX, anchors.sourceY);
    place('.react-flow__edgeupdater-target', anchors.targetX, anchors.targetY);
  }, [anchors.sourceX, anchors.sourceY, anchors.targetX, anchors.targetY]);

  return (
    <g
      ref={anchorRef}
      data-tone={tone}
      data-selected={selected}
      data-ns-settling={progress < 1}
      data-ns-phase={phase}
      data-ns-pattern={data?.pattern ?? 'solid'}
      data-ns-instant={presentation?.instant || undefined}
      style={presentation ? ({ '--ns-edge-travel': `${travelMs}ms` } as CSSProperties) : undefined}
    >
      {/* A selected edge used to differ by 0.75px of stroke width, which reads
          as nothing. The halo is the selection: it traces the same path, wide
          and faint, under the edge itself. */}
      {selected ? (
        <path
          d={path}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          className="ns-graph-edge-halo"
        />
      ) : null}

      <BaseEdge
        id={id}
        path={path}
        interactionWidth={28}
        data-ns-phase={phase}
        className={
          shouldAnimate ? 'ns-graph-edge-path ns-graph-edge-animated' : 'ns-graph-edge-path'
        }
        style={
          {
            ...(shouldAnimate ? { strokeDasharray: '12, 12' } : {}),
            ...(shouldAnimate ? { '--flow-edge-dash-duration': dashDuration } : {}),
          } as CSSProperties
        }
      />

      {phase ? (
        <>
          <path d={path} pathLength={1} className="ns-graph-edge-progress" data-ns-phase={phase} />
          {phase === 'traversed' && !presentation?.instant ? (
            <path d={path} pathLength={1} className="ns-graph-edge-comet" data-ns-phase={phase} />
          ) : null}
        </>
      ) : null}

      <polygon
        points="0,-4.5 9,0 0,4.5"
        className="ns-graph-edge-arrow"
        transform={`translate(${drawnTargetX} ${drawnTargetY}) rotate(${arrowRotationByTargetSide[geometry.targetPosition]}) translate(-9 0)`}
      />

      {data?.label ? (
        <EdgeLabelRenderer>
          <div
            className="ns-graph-edge-label-position"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <span className="ns-graph-edge-label" data-tone={tone}>
              {data.label}
            </span>
          </div>
        </EdgeLabelRenderer>
      ) : null}

      {/* What the user aims at. Inert, because React Flow's own anchor sits at
          the same point and carries the full grab radius. */}
      <circle className="ns-graph-edge-anchor" cx={anchors.sourceX} cy={anchors.sourceY} r={4} />
      <circle className="ns-graph-edge-anchor" cx={anchors.targetX} cy={anchors.targetY} r={4} />
    </g>
  );
}
