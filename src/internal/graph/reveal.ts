/** Keep these geometry and motion choices aligned with styles/dock.css. */
export const INSPECTOR_WIDTH = 416;
export const SHEET_SHARE = 0.6;
export const INSPECTOR_DURATION = 260;

function shortestMove(start: number, end: number, available: number) {
  const min = 24;
  const max = Math.max(min, available - 24);
  if (end - start > max - min || start < min) return min - start;
  return end > max ? max - end : 0;
}

/** Reveal an item with minimal movement; oversized items keep their start readable. */
export function revealOffset(
  rect: { left: number; top: number; right: number; bottom: number },
  width: number,
  height: number,
) {
  return {
    dx: shortestMove(rect.left, rect.right, width),
    dy: shortestMove(rect.top, rect.bottom, height),
  };
}

/** Evaluate the inspector's CSS cubic-bezier(0.32, 0.72, 0, 1). */
export function inspectorEase(progress: number) {
  if (progress <= 0 || progress >= 1) return Math.max(0, Math.min(1, progress));
  const sample = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 20; i += 1) {
    const middle = (low + high) / 2;
    if (sample(middle, 0.32, 0) < progress) low = middle;
    else high = middle;
  }
  return sample((low + high) / 2, 0.72, 1);
}
