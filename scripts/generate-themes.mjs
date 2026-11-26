/**
 * Generates the colour tokens of every theme into src/styles.css.
 *
 *   node scripts/generate-themes.mjs           write the generated region
 *   node scripts/generate-themes.mjs --check   exit 1 when the region is stale
 *
 * A theme is a few inputs (src/blocks/theme/palettes.json): a neutral hue and
 * chroma, an accent per mode and three glow hues. Every colour token comes
 * from those inputs and one OKLCH lightness ladder per mode and contrast
 * level below, so a ratio that holds in one theme holds in all of them
 * (docs/technical/theming.md, ADR 0004). Values are written as literal, in-gamut
 * hsl() so scripts/check-contrast.mjs reads exactly what the browser paints.
 *
 * Tokens that do not depend on the theme (status colours, charts 2 to 5,
 * radius, blur, grain) stay hand-written in the `:root` and `.dark` blocks.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import prettier from 'prettier';

import { hsl } from './lib/oklch.mjs';
import { stylesPath } from './lib/css-tokens.mjs';
import { CONTRASTS, MODES, readPalettes, themeSelectors } from './lib/theme-selectors.mjs';

const START = '/* @generated themes:start */';
const END = '/* @generated themes:end */';

/*
 * The ladder: [lightness, share of the neutral chroma] per step. Radix roles
 * in brackets. Light and dark keep the order of today's tokens: background
 * under card in both, so a solid page and full-pane panels stay behind cards.
 */
const LADDER = {
  light: {
    ground: [0.925, 1.5], // the page ground under the glass
    groundHi: 0.885, // the backdrop's top-left stop, toward the glows
    background: [0.985, 0.4], // [1] page (solid material), outline controls
    card: [1, 0], // [2] cards and data surfaces
    elevated: [1, 0],
    subtle: [0.968, 1],
    fill: [0.958, 1.3], // [3] soft fill: muted, secondary, chips
    border: [0.905, 1.6], // [6] divider
    borderStrong: [0.845, 1.8], // [7] strong rule
    edge: [0.6, 2], // [8] unfilled control and field edge, 3:1
    edgeGlass: [0.54, 2], // the same edge on translucent glass
    ink: [0.205, 2.2], // [12]
    inkMuted: [0.47, 2], // [11]
    wash: [0.955, 0.28], // accent wash, share of the accent chroma
    washInk: [0.44, 0.85],
    sidebarAccent: [0.97, 0.15],
    segment: [0.975, 1.2, 0.62], // segmented track: lightness, chroma, alpha
    segmentThumb: [1, 0],
    onAccent: [1, 0],
    glass: { surface: 0.4, strong: 0.94, overlay: 0.9 },
    glow: { lightness: 0.82, alpha: 0.7 },
  },
  dark: {
    ground: [0.155, 1.8],
    groundHi: 0.19,
    background: [0.175, 1.8],
    card: [0.225, 1.8],
    elevated: [0.255, 1.8],
    subtle: [0.195, 1.8],
    fill: [0.28, 1.6],
    border: [0.305, 1.6],
    borderStrong: [0.37, 1.6],
    edge: [0.56, 1.6],
    edgeGlass: [0.62, 1.6],
    ink: [0.965, 0.5],
    inkMuted: [0.745, 1.1],
    wash: [0.3, 0.3],
    washInk: [0.86, 0.6],
    sidebarAccent: [0.28, 1.6],
    segment: [1, 0, 0.06],
    segmentThumb: [0.3, 1.6],
    onAccent: [0.17, 1],
    glass: { surface: 0.55, strong: 0.9, overlay: 0.88 },
    glow: { lightness: 0.55, alpha: 0.3 },
  },
};

/* High contrast moves the ladder apart (Linear's contrast input): ink darker,
   rules and edges stronger, the ground further from the surfaces. */
const HIGH = {
  light: {
    ground: [0.9, 1.5],
    ink: [0.16, 2.2],
    inkMuted: [0.4, 2],
    border: [0.86, 1.6],
    borderStrong: [0.76, 1.8],
    edge: [0.5, 2],
    edgeGlass: [0.46, 2],
    washInk: [0.38, 0.85],
    segment: [0.975, 1.2, 0.78],
  },
  dark: {
    ground: [0.12, 1.8],
    ink: [0.99, 0.5],
    inkMuted: [0.84, 1.1],
    border: [0.38, 1.6],
    borderStrong: [0.47, 1.6],
    edge: [0.68, 1.6],
    edgeGlass: [0.72, 1.6],
    washInk: [0.92, 0.6],
  },
};

function tokens(palette, mode, contrast) {
  const ladder = contrast === 'high' ? { ...LADDER[mode], ...HIGH[mode] } : LADDER[mode];
  const dark = mode === 'dark';
  const n = palette.neutral;
  const a = palette.accent[mode];
  const [g1, g2, g3] = palette.glow.hues;
  const gc = palette.glow.chroma;

  const neutral = ([l, k], alpha = 1) => hsl(l, n.chroma * k, n.hue, alpha);
  const ink = (l, k, alpha) => hsl(l, n.chroma * k, n.hue, alpha);
  const accent = (l, share, alpha = 1) => hsl(l, a.chroma * share, a.hue, alpha);
  const white = (alpha) => hsl(1, 0, 0, alpha);
  const pale = (alpha) => hsl(0.97, n.chroma, n.hue, alpha);
  const shade = (alpha) => hsl(0.04, n.chroma * 2, n.hue, alpha);

  const primary = accent(a.lightness, 1);
  const onPrimary = neutral(ladder.onAccent);
  const foreground = neutral(ladder.ink);
  const card = neutral(ladder.card);
  const border = neutral(ladder.border);
  const accentForeground = accent(ladder.washInk[0], ladder.washInk[1]);
  const glow = (hue, alpha, boost = 1) =>
    hsl(ladder.glow.lightness, gc * boost, hue, ladder.glow.alpha * alpha);
  const [cardL, cardK] = ladder.card;
  const [segL, segK, segA] = ladder.segment;
  const segmentEdge = dark ? white(0.08) : ink(0.3, 3, 0.12);
  const groundL = ladder.ground[0];

  return {
    background: neutral(ladder.background),
    foreground,
    card,
    'card-foreground': foreground,
    popover: card,
    'popover-foreground': foreground,
    primary,
    'primary-foreground': onPrimary,
    secondary: neutral(ladder.fill),
    'secondary-foreground': foreground,
    muted: neutral(ladder.fill),
    'muted-foreground': neutral(ladder.inkMuted),
    accent: accent(ladder.wash[0], ladder.wash[1]),
    'accent-foreground': accentForeground,
    border,
    'border-strong': neutral(ladder.borderStrong),
    'control-edge': neutral(ladder.edge),
    'control-edge-glass': neutral(ladder.edgeGlass),
    input: border,
    ring: primary,
    'surface-subtle': neutral(ladder.subtle),
    'surface-elevated': neutral(ladder.elevated),
    sidebar: card,
    'sidebar-foreground': foreground,
    'sidebar-primary': primary,
    'sidebar-primary-foreground': onPrimary,
    'sidebar-accent': dark
      ? neutral(ladder.sidebarAccent)
      : accent(ladder.sidebarAccent[0], ladder.sidebarAccent[1]),
    'sidebar-accent-foreground': dark ? foreground : accentForeground,
    'sidebar-border': border,
    'sidebar-ring': primary,
    ground: neutral(ladder.ground),
    segment: hsl(segL, n.chroma * segK, n.hue, segA),
    'segment-thumb': neutral(ladder.segmentThumb),
    'segment-edge': segmentEdge,
    'segment-thumb-shadow': dark
      ? `inset 0 1px 0 ${white(0.1)}, 0 0 0 1px ${segmentEdge}, 0 1px 2px ${shade(0.3)}, 0 4px 12px -6px ${accent(a.lightness, 1, 0.3)}`
      : `0 0 0 1px ${segmentEdge}, 0 1px 2px ${ink(0.3, 3, 0.1)}, 0 4px 12px -6px ${accent(a.lightness, 1, 0.35)}`,
    'glass-surface': dark
      ? hsl(0.21, n.chroma * 1.8, n.hue, ladder.glass.surface)
      : white(ladder.glass.surface),
    'glass-surface-strong': hsl(cardL, n.chroma * cardK, n.hue, ladder.glass.strong),
    'glass-surface-overlay': hsl(cardL, n.chroma * cardK, n.hue, ladder.glass.overlay),
    'glass-rim': dark
      ? `linear-gradient(180deg, ${pale(0.34)}, ${pale(0.14)} 45%, ${pale(0.12)})`
      : `linear-gradient(180deg, ${white(1)}, ${white(0.55)} 28%, ${ink(0.32, 3, 0.14)} 62%, ${ink(0.28, 3.5, 0.22)})`,
    'glass-shadow': dark
      ? `0 1px 1px ${shade(0.3)}, 0 4px 8px -2px ${shade(0.35)}, 0 24px 48px -16px ${shade(0.6)}`
      : `0 1px 2px ${ink(0.3, 3, 0.08)}, 0 4px 10px -2px ${ink(0.3, 3, 0.06)}, 0 24px 48px -16px ${accent(0.35, 0.4, 0.2)}`,
    'glass-shadow-raised': dark
      ? `0 1px 1px ${shade(0.25)}, 0 12px 28px -14px ${shade(0.5)}`
      : `0 1px 2px ${ink(0.3, 3, 0.08)}, 0 18px 36px -18px ${accent(0.35, 0.4, 0.22)}`,
    'glass-item-active-shadow': dark
      ? `inset 0 1px 0 ${pale(0.22)}, inset 0 0 0 1px ${pale(0.08)}, 0 8px 18px -10px ${accent(a.lightness, 1, 0.35)}`
      : `inset 0 1px 0 ${white(1)}, inset 0 0 0 1px ${white(0.75)}, inset 0 -1px 0 ${ink(0.3, 3, 0.06)}, 0 1px 2px ${ink(0.3, 3, 0.06)}, 0 8px 18px -10px ${accent(a.lightness, 1, 0.45)}`,
    'glass-chip-shadow': dark
      ? `inset 0 1px 0 ${pale(0.14)}, inset 0 0 0 1px ${pale(0.07)}, 0 4px 10px -4px ${shade(0.5)}`
      : `inset 0 1px 0 ${white(1)}, inset 0 0 0 1px ${white(0.55)}, inset 0 -1px 0 ${ink(0.3, 3, 0.06)}, 0 1px 2px ${ink(0.3, 3, 0.06)}, 0 4px 10px -4px ${ink(0.35, 3, 0.14)}`,
    'glass-sidebar-rim': dark
      ? `linear-gradient(150deg, ${pale(0.42)}, ${pale(0.16)} 35%, ${pale(0.13)} 65%, ${pale(0.12)})`
      : `linear-gradient(150deg, ${white(1)}, ${white(0.55)} 35%, ${white(0.35)} 65%, ${ink(0.32, 3, 0.14)})`,
    'glass-sidebar-thickness': dark
      ? `inset 0 1px 0 ${pale(0.12)}, inset 1px 0 0 ${pale(0.06)}`
      : `inset 0 1px 0 ${white(0.9)}, inset 1px 0 0 ${white(0.55)}, inset 0 -1px 0 ${ink(0.3, 3, 0.05)}`,
    'glass-backdrop': dark
      ? [
          `radial-gradient(50% 60% at 0% 0%, ${glow(g1, 1, 1.6)}, transparent 72%)`,
          `radial-gradient(40% 50% at 6% 100%, ${glow(g2, 0.8, 1.6)}, transparent 72%)`,
          `radial-gradient(42% 40% at 100% 0%, ${glow(g3, 0.55, 1.6)}, transparent 72%)`,
          `linear-gradient(180deg, ${neutral([groundL + 0.012, ladder.ground[1]])}, ${neutral([groundL - 0.01, ladder.ground[1]])})`,
        ].join(', ')
      : [
          `radial-gradient(22% 60% at 0% 72%, ${glow(g1, 1)}, transparent 75%)`,
          `radial-gradient(18% 40% at 10% 30%, ${glow(g2, 0.85)}, transparent 72%)`,
          `radial-gradient(14% 28% at 4% 100%, ${glow(g3, 0.8)}, transparent 70%)`,
          `linear-gradient(155deg, ${hsl(ladder.groundHi, gc * 0.45, g1)} 0%, ${hsl((ladder.groundHi + groundL) / 2, gc * 0.25, g2)} 28%, ${neutral(ladder.ground)} 60%, ${neutral([groundL - 0.01, ladder.ground[1]])} 100%)`,
        ].join(', '),
  };
}

function block(selectors, values) {
  const body = Object.entries(values)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n');
  return `${selectors.join(',\n')} {\n${body}\n}`;
}

export function generateRegion() {
  const palettes = readPalettes();
  const parts = [
    START,
    '/* Generated by scripts/generate-themes.mjs from src/blocks/theme/palettes.json. Do not edit by hand. */',
  ];
  for (const contrast of CONTRASTS) {
    for (const [index, palette] of palettes.entries()) {
      for (const mode of MODES) {
        const values = tokens(palette, mode, contrast);
        let emitted = values;
        if (contrast === 'high') {
          // Only what the high-contrast ladder changes, on top of the base block.
          const base = tokens(palette, mode, 'standard');
          emitted = Object.fromEntries(
            Object.entries(values).filter(([name, value]) => base[name] !== value),
          );
        }
        parts.push(block(themeSelectors(palette.id, index === 0, mode, contrast), emitted));
      }
    }
  }
  parts.push(END);
  return parts.join('\n\n');
}

async function render(css) {
  const start = css.indexOf(START);
  const end = css.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`${stylesPath} has no "${START}" ... "${END}" region.`);
  }
  const next = css.slice(0, start) + generateRegion() + css.slice(end + END.length);
  const options = (await prettier.resolveConfig(stylesPath)) ?? {};
  return prettier.format(next, { ...options, filepath: stylesPath });
}

const css = readFileSync(stylesPath, 'utf8');
const next = await render(css);
if (process.argv.includes('--check')) {
  if (next !== css) {
    console.error(
      'generate-themes: src/styles.css is out of date. Run `node scripts/generate-themes.mjs`.',
    );
    process.exit(1);
  }
  console.log('generate-themes: generated themes are current');
} else {
  writeFileSync(stylesPath, next);
  console.log('generate-themes: wrote the generated themes into src/styles.css');
}
