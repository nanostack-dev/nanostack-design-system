// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Brand, ColorScheme, Density } from '../src/theme.js';

const stylesheet = readFileSync(resolve(import.meta.dirname, '../src/styles.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);
type Theme = { brand: Brand; colorScheme: ColorScheme; density: Density };
type TokenPair = readonly [foreground: string, background: string];

// Parse only the finite theme selectors. This deliberately rejects unsupported color
// formats instead of silently asserting contrast against hard-coded duplicate values.
const tokenRules = Array.from(stylesheet.matchAll(/([^{}]+)\{([^{}]*)\}/g))
  .flatMap((match, order) => {
    const selector = match[1]?.trim() ?? '';
    if (!/^\.ns-theme(?:\[data-ns-(?:theme|brand|density)=['"][^'"]+['"]\])*$/.test(selector))
      return [];
    const conditions = Array.from(
      selector.matchAll(/\[data-ns-(theme|brand|density)=['"]([^'"]+)['"]\]/g),
      ([, key, value]) => [key, value] as const,
    );
    const tokens = Object.fromEntries(
      Array.from((match[2] ?? '').matchAll(/(--ns-[\w-]+)\s*:\s*([^;]+);/g), ([, key, value]) => [
        key,
        value?.trim(),
      ]),
    );
    return [{ conditions, tokens, order }];
  })
  .sort(
    (left, right) => left.conditions.length - right.conditions.length || left.order - right.order,
  );

function themeTokens(theme: Theme) {
  const attributes = { theme: theme.colorScheme, brand: theme.brand, density: theme.density };
  return Object.assign(
    {},
    ...tokenRules
      .filter(({ conditions }) =>
        conditions.every(([key, value]) => attributes[key as keyof typeof attributes] === value),
      )
      .map(({ tokens }) => tokens),
  ) as Record<string, string>;
}

function luminance(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex))
    throw new Error(`Expected an opaque six-digit sRGB token, received ${hex}`);
  const channels = [1, 3, 5].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

const textSurfaces = ['canvas', 'surface', 'subtle', 'hover'] as const;
const statusTones = ['success', 'warning', 'danger'] as const;
const pairs: TokenPair[] = [
  ...textSurfaces.flatMap((surface): TokenPair[] => [
    ['text', surface],
    ['muted', surface],
  ]),
  ['accent', 'canvas'],
  ['accent', 'surface'],
  ['accent', 'accent-soft'],
  ['on-accent', 'accent'],
  ['on-accent', 'accent-hover'],
  ...statusTones.flatMap((tone): TokenPair[] => [
    [tone, `${tone}-soft`],
    [tone, 'surface'],
    [tone, 'canvas'],
  ]),
];
const brands: Brand[] = ['nanostack', 'echopoint', 'anchor'];
const colorSchemes: ColorScheme[] = ['light', 'dark'];
const densities: Density[] = ['comfortable', 'compact'];
const themes = brands.flatMap((brand) =>
  colorSchemes.flatMap((colorScheme) =>
    densities.map((density) => ({ brand, colorScheme, density })),
  ),
);

describe('semantic text contrast (WCAG 2.2 SC 1.4.3)', () => {
  it('uses the standard luminance ratio with no rounded pass threshold', () => {
    expect(contrast('#000000', '#ffffff')).toBe(21);
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
    expect(contrast('#767676', '#ffffff')).toBeGreaterThan(4.5);
    expect(contrast('#777777', '#ffffff')).toBeLessThan(4.5);
    expect(tokenRules.length).toBeGreaterThanOrEqual(2);
  });

  it.each(themes)(
    '$brand / $colorScheme / $density keeps every text pair at least 4.5:1',
    (theme) => {
      const tokens = themeTokens(theme);
      for (const [foreground, background] of pairs) {
        const foregroundColor = tokens[`--ns-${foreground}`];
        const backgroundColor = tokens[`--ns-${background}`];
        expect(foregroundColor, `Missing --ns-${foreground}`).toBeDefined();
        expect(backgroundColor, `Missing --ns-${background}`).toBeDefined();
        const ratio = contrast(foregroundColor ?? '', backgroundColor ?? '');
        expect(
          ratio,
          `${foreground} on ${background} is ${ratio.toFixed(3)}:1 in ${theme.brand}/${theme.colorScheme}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
      for (const surface of ['surface', 'canvas']) {
        const border = tokens['--ns-control-border'];
        const background = tokens[`--ns-${surface}`];
        expect(border, 'Missing --ns-control-border').toBeDefined();
        const ratio = contrast(border ?? '', background ?? '');
        expect(ratio, `Input border on ${surface} is ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(
          3,
        );
      }
    },
  );
});
