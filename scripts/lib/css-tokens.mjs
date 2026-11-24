/**
 * Reads the theme custom properties of src/styles.css.
 * `:root` is the light theme, `.dark` the dark theme. Only blocks whose selector
 * starts a line count: the `@media (prefers-contrast)` override and the
 * `.dark :is(...)` rules are not token definitions.
 */
import { readFileSync } from 'node:fs';

export const stylesPath = 'src/styles.css';

function blocks(css, selector) {
  const start = new RegExp(`^${selector.replace('.', '\\.')} \\{`, 'gm');
  const found = [];
  for (let match = start.exec(css); match; match = start.exec(css)) {
    const from = match.index + match[0].length;
    let depth = 1;
    let index = from;
    while (depth > 0 && index < css.length) {
      const char = css[index++];
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
    }
    found.push(css.slice(from, index - 1));
  }
  return found;
}

function declarations(bodies) {
  const map = new Map();
  for (const body of bodies) {
    for (const match of body.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
      map.set(match[1], match[2].trim());
    }
  }
  return map;
}

/** Returns `{ light, dark }`, each a Map from token name to its raw value. */
export function readThemes(path = stylesPath) {
  const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return {
    light: declarations(blocks(css, ':root')),
    dark: declarations(blocks(css, '.dark')),
  };
}
