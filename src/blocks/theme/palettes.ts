/**
 * The themes a person can pick. Their colours are generated from the inputs in
 * palettes.json (scripts/generate-themes.mjs); the ids here and there match.
 * The first one is the default and needs no attribute.
 */
export const palettes = [
  { id: 'tide', label: 'Tide', description: 'Cobalt on slate blue, lime in dark' },
  { id: 'lagoon', label: 'Lagoon', description: 'Teal on blue-green sea glass' },
  { id: 'aurora', label: 'Aurora', description: 'Violet on mauve, with pink light' },
  { id: 'ember', label: 'Ember', description: 'Burnt orange on warm sand' },
] as const;

export type Palette = (typeof palettes)[number]['id'];
export type PaletteOption = (typeof palettes)[number];

export const defaultPalette: Palette = 'tide';

export function isPalette(value: unknown): value is Palette {
  return palettes.some((palette) => palette.id === value);
}

/** Standard, or high: more text contrast and stronger rules and edges in every palette. */
export type Contrast = 'standard' | 'high';

export function isContrast(value: unknown): value is Contrast {
  return value === 'standard' || value === 'high';
}
