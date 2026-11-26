/**
 * Reads the theme custom properties of src/styles.css.
 *
 * A rule counts when it sits at the top level (not inside @media or @supports)
 * and one of its comma-separated selectors matches exactly: `:root` is the
 * light theme and `.dark` the dark theme, which covers both the hand-written
 * blocks and the generated default palette (`:root,\n[data-ns-palette='tide']`).
 * The `.dark :is(...)` rules are not token definitions.
 */
import { readFileSync } from 'node:fs';

import { CONTRASTS, MODES, readPalettes, themeSelectors } from './theme-selectors.mjs';

export const stylesPath = 'src/styles.css';

/** Top-level rules as `{ selectors, body }`, comments removed. */
export function topLevelRules(path = stylesPath) {
  const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  let depth = 0;
  let start = 0;
  let selector = '';
  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    if (char === '{') {
      if (depth === 0) {
        selector = css.slice(start, index).trim();
        start = index + 1;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        if (!selector.startsWith('@')) {
          rules.push({
            selectors: selector.split(',').map((part) => part.trim()),
            body: css.slice(start, index),
          });
        }
        start = index + 1;
      }
    } else if (char === ';' && depth === 0) {
      start = index + 1;
    }
  }
  return rules;
}

function declarations(bodies) {
  const map = new Map();
  for (const body of bodies) {
    for (const match of body.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
      map.set(match[1], match[2].trim().replace(/\s+/g, ' '));
    }
  }
  return map;
}

function bodiesFor(rules, selector) {
  return rules.filter((rule) => rule.selectors.includes(selector)).map((rule) => rule.body);
}

/** Returns `{ light, dark }`, each a Map from token name to its raw value. */
export function readThemes(path = stylesPath) {
  const rules = topLevelRules(path);
  return {
    light: declarations(bodiesFor(rules, ':root')),
    dark: declarations(bodiesFor(rules, '.dark')),
  };
}

/**
 * Every palette, mode and contrast level as a complete token map: the
 * hand-written theme, then the palette's generated block, then its
 * high-contrast delta. `blocks` holds each generated block alone, so a check
 * can assert that every palette sets the same tokens.
 */
export function readPaletteThemes(path = stylesPath) {
  const rules = topLevelRules(path);
  const themes = readThemes(path);
  const palettes = readPalettes();
  const block = (palette, index, mode, contrast) => {
    const selector = themeSelectors(palette.id, index === 0, mode, contrast).join(',');
    const found = rules.filter((rule) => rule.selectors.join(',') === selector);
    return declarations(found.map((rule) => rule.body));
  };
  const result = [];
  for (const [index, palette] of palettes.entries()) {
    for (const mode of MODES) {
      const base = block(palette, index, mode, 'standard');
      for (const contrast of CONTRASTS) {
        const delta = contrast === 'high' ? block(palette, index, mode, 'high') : new Map();
        result.push({
          palette: palette.id,
          mode,
          contrast,
          block: contrast === 'high' ? delta : base,
          tokens: new Map([...themes[mode], ...base, ...delta]),
        });
      }
    }
  }
  return result;
}
