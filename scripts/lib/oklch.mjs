/**
 * OKLCH to sRGB, gamut mapping and CSS formatting for the theme generator.
 * OKLab after Björn Ottosson; the sRGB transfer and relative luminance follow
 * WCAG 2.x, so ratios here match scripts/check-contrast.mjs.
 */

function oklchToLinear(l, c, h) {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const [L, M, S] = [l_ ** 3, m_ ** 3, s_ ** 3];
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

const encode = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const inGamut = (linear) => linear.every((v) => v >= -0.0005 && v <= 1.0005);

/**
 * Returns sRGB channels 0..1 for an OKLCH colour. Out-of-gamut colours keep
 * their lightness and hue and lose chroma until they fit, so the generated
 * value is the colour the ladder meant, not a browser's clipped guess.
 */
export function oklchToSrgb(l, c, h) {
  let chroma = c;
  let linear = oklchToLinear(l, chroma, h);
  while (!inGamut(linear) && chroma > 0) {
    chroma = Math.max(0, chroma - 0.002);
    linear = oklchToLinear(l, chroma, h);
  }
  return linear.map((v) => encode(Math.min(1, Math.max(0, v))));
}

function srgbToHsl([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  if (max === min) return [0, 0, light];
  const d = max - min;
  const sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue;
  if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  return [hue * 60, sat, light];
}

const round = (value, digits) => Number(value.toFixed(digits));

/** `hsl(H S% L%)` or `hsl(H S% L% / a)`, the format the token checks read. */
export function hsl(l, c, h, alpha = 1) {
  const [hue, sat, light] = srgbToHsl(oklchToSrgb(l, c, h));
  const body = `${round(hue, 1)} ${round(sat * 100, 1)}% ${round(light * 100, 1)}%`;
  return alpha >= 1 ? `hsl(${body})` : `hsl(${body} / ${round(alpha, 3)})`;
}
