/**
 * Thresholds and helpers the character reads, kept out of the component file
 * so that file exports components only and stays fast-refreshable.
 */

/**
 * Loads at which another vent starts letting go.
 *
 * Three steps rather than one threshold, so the character keeps saying
 * something as the last of its capacity goes: half full vents from one place,
 * three quarters from two, and full from all three.
 */
export const WORKER_STEAM_STEPS = [0.5, 0.75, 1] as const;

/** How many vents a load opens. 0.4 opens none, 0.75 opens two, 1 opens three. */
export function workerSteamTier(load: number) {
  return WORKER_STEAM_STEPS.filter((step) => load >= step).length;
}

/**
 * A stable 0-1 phase from any identifier.
 *
 * Pass a worker's id so its rhythm is its own and does not change between
 * renders. `"8f21c4de-…"` and `"b40917aa-…"` land on visibly different offsets,
 * which is what keeps a row of characters from reading as one animation on
 * repeat.
 */
export function workerPhase(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 997;
  }

  return hash / 997;
}
