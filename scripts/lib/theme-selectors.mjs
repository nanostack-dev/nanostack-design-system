/**
 * The selectors of the generated theme blocks, shared by the generator and the
 * token checks so both agree on where a palette's tokens live.
 *
 * The palette and contrast attributes sit on <html> (ThemeProvider writes
 * them), and a palette can also be set on any element, which re-themes its
 * subtree (the theme picker's previews). Specificity, in source order:
 *   light base   (0,1,0)  `:root` for the default palette, `[data-ns-palette]`
 *   dark base    (0,1,0)  `.dark` for the default; (0,2,0) for the others
 *   high deltas  (0,3,0)  only the tokens the high-contrast ladder changes
 */
import { readFileSync } from 'node:fs';

export const palettesPath = 'src/blocks/theme/palettes.json';

export function readPalettes(path = palettesPath) {
  return JSON.parse(readFileSync(path, 'utf8')).palettes;
}

export const MODES = ['light', 'dark'];
export const CONTRASTS = ['standard', 'high'];

const attr = (palette) => `[data-ns-palette='${palette}']`;
const high = "[data-ns-contrast='high']";

/** Selector list of one generated block. The first palette is the default. */
export function themeSelectors(palette, isDefault, mode, contrast) {
  const own = attr(palette);
  if (contrast === 'standard') {
    if (mode === 'light') return isDefault ? [':root', own] : [own];
    return isDefault ? ['.dark', `.dark ${own}`] : [`.dark${own}`, `.dark ${own}`];
  }
  if (mode === 'light') {
    const list = [`${high}:not(.dark)${own}`, `${high}:not(.dark) ${own}`];
    return isDefault ? [`${high}:not(.dark):not([data-ns-palette])`, ...list] : list;
  }
  const list = [`.dark${high}${own}`, `.dark${high} ${own}`];
  return isDefault ? [`.dark${high}:not([data-ns-palette])`, ...list] : list;
}
