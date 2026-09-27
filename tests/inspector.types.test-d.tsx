import { BarStrip, DockSheet, DockSidebar, type GraphCanvasHandle } from '../src/index.js';

export const supported = <DockSidebar open side="end" size="inspector"><DockSheet open /><BarStrip label="Runs" selection="single" points={[{ id: 'live', value: 1, label: 'Live run', tone: 'info' }]} onPreview={() => {}} /></DockSidebar>;
// @ts-expect-error Position is a finite variant, never CSS.
export const invalidSide = <DockSidebar open side="left" />;
// @ts-expect-error Sheet height is library-owned.
export const invalidHeight = <DockSheet open height="75%" />;
// @ts-expect-error Selection behavior uses a closed union.
export const invalidSelection = <BarStrip label="Runs" points={[]} selection="custom" />;
export function reveal(handle: GraphCanvasHandle) {
  handle.revealNode('selected', { occlusion: 'bottom-sheet' });
  // @ts-expect-error Consumers cannot inject panel dimensions.
  handle.revealNode('selected', { width: 123 });
  // @ts-expect-error Structural spreads cannot introduce CSS.
  handle.revealNode('selected', { ...{ style: {} }, occlusion: 'sidebar' });
}
