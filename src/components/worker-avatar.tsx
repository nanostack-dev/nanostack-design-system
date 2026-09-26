'use client';
import { useId } from 'react';
import type { NoCustomStyle } from '../internal/props.js';
import { workerPhase, workerSteamTier } from '../internal/worker-tuning.js';
/**
 * A small character that reports the state of one worker.
 *
 * The drawing is fixed. Everything expressive is a live number handed in as a
 * CSS variable, so a panel can drive the character straight from its data and
 * never re-render the SVG to change how it behaves:
 *
 * - `load` sets the working rhythm, how hard the eyes narrow, and whether the
 *   character vents steam.
 * - `beat` and `activity` are values from the data, not counters. Changing one
 *   remounts its node, which restarts that animation, so a ping means the
 *   heartbeat really landed and a squash means the work really moved.
 * - `seed` desynchronises one character from the next. A crew bobbing in
 *   unison reads as one animation on repeat.
 */

export type WorkerAvatarProps = NoCustomStyle & {
  /** Fraction of worker capacity in use. Invalid values become idle. */
  load?: number;
  alarmed?: boolean;
  /** New observed heartbeat replays the signal. */
  beat?: string | number | null;
  /** New observed work state replays a reaction. */
  activity?: string | number | null;
  /** Stable worker identity; animation timing is derived internally. */
  seed?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Omit when the surrounding control already names the worker. */
  label?: string;
};

function clamp01(value: number) {
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0;
}

/**
 * Where each vent sits, and where its steam goes.
 *
 * A machine under load does not sweat, it runs hot — so the character vents.
 * The crown is the one place a plume can leave from and stay clear of the
 * body: the capsule top is flat from x=51 to x=69 at y=42, and the corner arcs
 * fall away either side of it.
 *
 * `driftX` carries each plume away from the antenna so three of them read as
 * three, and `spin` tumbles the puff as it climbs, because steam that rises
 * without turning reads as a shape being moved rather than a gas.
 */
const STEAM_VENTS = [
  { x: 76, y: 42, driftX: 9, riseY: 30, spin: 26 },
  { x: 44, y: 42, driftX: -9, riseY: 30, spin: -22 },
  { x: 60, y: 36, driftX: 3, riseY: 36, spin: 14 },
];

/**
 * A lumpy cluster of discs. Blurred and roughened by the smoke filter they
 * fuse into one cloud, which is what separates smoke from a row of dots.
 *
 * Five, not three: the extra lumps are what the displacement map has to bite
 * into. Their radii are deliberately uneven, because a cluster of equal discs
 * blurs back into a circle.
 */
const PUFF_DISCS = [
  { dx: -3.6, dy: 1.8, r: 3 },
  { dx: 0.4, dy: 2.6, r: 2.6 },
  { dx: 3.4, dy: 0.9, r: 2.9 },
  { dx: -1.4, dy: -1.6, r: 3.6 },
  { dx: 2.2, dy: -2.8, r: 2.4 },
];

export function WorkerAvatar({
  load = 0,
  alarmed = false,
  beat = null,
  activity,
  seed = '',
  size = 'md',
  label,
}: WorkerAvatarProps) {
  const phase = workerPhase(seed);
  const clipId = useId();
  const smokeId = `${clipId}-smoke`;
  const safeLoad = clamp01(load);
  const steam = workerSteamTier(safeLoad);

  return (
    <svg
      className="ns-worker-avatar"
      data-size={size}
      data-alarmed={alarmed}
      data-working={safeLoad > 0}
      data-steam={steam}
      style={{
        ['--bot-load' as string]: safeLoad.toFixed(3),
        ['--bot-phase' as string]: clamp01(phase).toFixed(3),
      }}
      viewBox="0 -22 120 146"
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="34" y="58" width="52" height="24" rx="12" />
        </clipPath>

        {/*
          What turns discs into smoke. Perlin noise chews an irregular edge
          into the cluster, then a blur softens what is left — a hard outline
          is the single thing that stops a shape reading as a gas.

          `fractalNoise` rather than the default `turbulence`, because it is
          the smooth, cloudy variant. The seed comes from the character's own
          phase, so two runners venting side by side do not wear the same
          silhouette. `sRGB` keeps the colour off the washed-out linear ramp.

          The filter sits on a static inner group while the animation drives
          the outer one, so this runs once per puff instead of once per frame.
        */}
        {steam > 0 && (
          <filter
            id={smokeId}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.085"
              numOctaves="2"
              seed={Math.round(clamp01(phase) * 90)}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
              result="rough"
            />
            <feGaussianBlur in="rough" stdDeviation="1.7" />
          </filter>
        )}
      </defs>

      <ellipse className="ns-worker-avatar-shadow" cx="60" cy="112" rx="27" ry="4.5" />

      {beat != null && (
        <circle key={beat} className="ns-worker-avatar-beat" cx="60" cy="19" r="30" />
      )}

      {/* Behind the body on purpose: a plume that is occluded where it leaves
          the crown reads as venting from the machine, and one drawn over the
          face reads as pasted on top of it. Only the vents this load has
          opened are drawn, so the number of plumes on screen is the reading. */}
      {STEAM_VENTS.slice(0, steam).map((vent, index) => (
        <g
          key={index}
          className="ns-worker-avatar-steam"
          style={{
            ['--puff' as string]: index,
            ['--steam-drift-x' as string]: `${vent.driftX}px`,
            ['--steam-rise-y' as string]: `${vent.riseY}px`,
            ['--steam-spin' as string]: `${vent.spin}deg`,
          }}
        >
          <g filter={`url(#${smokeId})`}>
            {PUFF_DISCS.map((disc, discIndex) => (
              <circle key={discIndex} cx={vent.x + disc.dx} cy={vent.y + disc.dy} r={disc.r} />
            ))}
          </g>
        </g>
      ))}

      {/* One keyed wrapper for both one-shot reactions: which of them plays is
          picked by what changed, so a remount never runs two at once. */}
      <g key={activity} className="ns-worker-avatar-react" data-react={alarmed ? 'alarm' : 'jolt'}>
        <g className="ns-worker-avatar-rig">
          {/* The antenna trails the body rather than moving with it. Nothing
              rigid enough to bob in perfect step reads as alive. */}
          <g className="ns-worker-avatar-antenna">
            <path className="ns-worker-avatar-stalk" d="M60 42 L60 24" />
            <circle className="ns-worker-avatar-bulb" cx="60" cy="19" r="4.6" />
          </g>

          <ellipse className="ns-worker-avatar-shell" cx="45" cy="106" rx="8.5" ry="4.5" />
          <ellipse className="ns-worker-avatar-shell" cx="75" cy="106" rx="8.5" ry="4.5" />
          <rect className="ns-worker-avatar-shell" x="24" y="42" width="72" height="66" rx="27" />
          <rect className="ns-worker-avatar-visor" x="34" y="58" width="52" height="24" rx="12" />

          {/* Clipped to the visor, so the eyes can travel to its edge
              without leaving the face. Two nested groups, because the two
              motions mean different things: the outer narrows the eyes with
              load, the inner darts them across at the working rhythm. */}
          <g clipPath={`url(#${clipId})`}>
            <g className="ns-worker-avatar-eyes">
              <g className="ns-worker-avatar-pupils">
                <circle className="ns-worker-avatar-eye" cx="49" cy="70" r="4.6" />
                <circle className="ns-worker-avatar-eye" cx="71" cy="70" r="4.6" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
