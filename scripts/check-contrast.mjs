/**
 * Checks WCAG 2.x contrast of named token pairs in both themes.
 *
 *   node scripts/check-contrast.mjs
 *
 * Pairs live in contrast-pairs.json. Each pair has `fg`, `bg` (token names without
 * `--`), `min` (4.5 for text, 3 for large text and non-text), and `reason`.
 * Optional: `bgAlpha` and `over` composite the `bg` token at that alpha over the
 * `over` token (a tint). A foreground with alpha is composited over the final
 * background. Only hsl() and hex values are read; the script fails on any other
 * value so a pair cannot pass by being skipped. Exit 1 on any failure.
 */
import { readFileSync } from 'node:fs';
import { readThemes } from './lib/css-tokens.mjs';

function parseColor(value, name) {
  const text = value.trim().toLowerCase();
  const hex = text.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3 || digits.length === 4) {
      digits = [...digits].map((digit) => digit + digit).join('');
    }
    if (digits.length !== 6 && digits.length !== 8) throw new Error(`${name}: bad hex ${value}`);
    const channel = (index) => parseInt(digits.slice(index, index + 2), 16) / 255;
    return {
      r: channel(0),
      g: channel(2),
      b: channel(4),
      a: digits.length === 8 ? channel(6) : 1,
    };
  }
  const hsl = text.match(
    /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:\s*[/,]\s*([\d.]+)(%?))?\s*\)$/,
  );
  if (!hsl) throw new Error(`${name}: cannot read "${value}" (only hsl() and hex)`);
  const hue = Number(hsl[1]);
  const sat = Number(hsl[2]) / 100;
  const light = Number(hsl[3]) / 100;
  let alpha = hsl[4] === undefined ? 1 : Number(hsl[4]);
  if (hsl[5] === '%') alpha /= 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const channel = (offset) => {
    const k = (offset + hue / 30) % 12;
    return light - (chroma / 2) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: channel(0), g: channel(8), b: channel(4), a: alpha };
}

function over(top, bottom, alpha = top.a) {
  const mix = (a, b) => a * alpha + b * (1 - alpha);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

function luminance({ r, g, b }) {
  const linear = (value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const pairs = JSON.parse(readFileSync('contrast-pairs.json', 'utf8')).pairs;
const themes = readThemes();
const rows = [];
let failures = 0;

for (const [theme, tokens] of [
  ['light', themes.light],
  ['dark', themes.dark],
]) {
  const color = (token) => {
    const raw = tokens.get(`--${token}`);
    if (raw === undefined) throw new Error(`${theme}: --${token} is not defined`);
    return parseColor(raw, `${theme} --${token}`);
  };
  for (const pair of pairs) {
    const label = `${pair.fg} on ${pair.bg}${pair.bgAlpha ? ` @${pair.bgAlpha}/${pair.over}` : ''}`;
    let result;
    try {
      let background = color(pair.bg);
      if (pair.over) background = over(background, color(pair.over), pair.bgAlpha ?? background.a);
      const foreground = over(color(pair.fg), background);
      result = ratio(foreground, background);
    } catch (error) {
      console.error(`check-contrast: ${error.message}`);
      failures += 1;
      continue;
    }
    const pass = result >= pair.min;
    if (!pass) failures += 1;
    rows.push([theme, label, pair.min.toFixed(1), result.toFixed(2), pass ? 'ok' : 'FAIL']);
  }
}

const header = ['theme', 'pair', 'min', 'ratio', ''];
const widths = header.map((_, i) => Math.max(...[header, ...rows].map((row) => row[i].length)));
for (const row of [header, ...rows]) {
  console.log(
    row
      .map((cell, i) => cell.padEnd(widths[i]))
      .join('  ')
      .trimEnd(),
  );
}
if (failures) {
  console.error(`check-contrast: ${failures} failing pair(s)`);
  process.exit(1);
}
console.log(`check-contrast: ${rows.length} checks passed`);
