import stylesSource from '../styles.css?raw';

export type ThemeName = 'light' | 'dark';
export type Rgb = readonly [number, number, number];
export type TokenValues = Record<string, string>;

function declarationsOf(selector: string): TokenValues {
  const start = stylesSource.indexOf(`\n${selector} {`);
  if (start < 0) throw new Error(`styles.css has no ${selector} block.`);
  const body = stylesSource.slice(start, stylesSource.indexOf('}', start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(hsl\([^)]*\))/g)].map(([, name, value]) => [name, value]),
  );
}

const lightValues = declarationsOf(':root');

export const tokenValues: Record<ThemeName, TokenValues> = {
  light: lightValues,
  dark: { ...lightValues, ...declarationsOf('.dark') },
};

export const colorTokenNames = Object.keys(lightValues);

/**
 * Converts a CSS `hsl(H S% L%)` value to sRGB channels from 0 to 255 (CSS Color 4 formula).
 * Example: `hsl(217 72% 43%)`
 *   chroma = 0.72 × min(0.43, 0.57) = 0.3096
 *   red: position = (0 + 217 / 30) % 12 = 7.23, level = 0.43 − 0.3096 × min(4.23, 1.77, 1) = 0.1204 → 31
 *   green 91, blue 189 → [31, 91, 189], which is #1f5bbd.
 */
export function hslToRgb(value: string): Rgb {
  const match = value.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/);
  if (!match) throw new Error(`Not an hsl() color: ${value}`);
  const hue = Number(match[1]);
  const saturation = Number(match[2]) / 100;
  const lightness = Number(match[3]) / 100;
  const chroma = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset: number) => {
    const position = (offset + hue / 30) % 12;
    const level = lightness - chroma * Math.max(-1, Math.min(position - 3, 9 - position, 1));
    return Math.round(level * 255);
  };
  return [channel(0), channel(8), channel(4)];
}

export function rgbToHex(rgb: Rgb) {
  return `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

export function rgbToCss(rgb: Rgb) {
  return `rgb(${rgb.map((channel) => Math.round(channel)).join(', ')})`;
}

export function tint(color: Rgb, surface: Rgb, opacity: number): Rgb {
  const mix = (index: 0 | 1 | 2) =>
    Math.round(color[index] * opacity + surface[index] * (1 - opacity));
  return [mix(0), mix(1), mix(2)];
}

function relativeLuminance(rgb: Rgb) {
  const [red, green, blue] = rgb.map((channel) => {
    const unit = channel / 255;
    return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(first: Rgb, second: Rgb) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

export type TextPair = { text: string; surface: string; tintOpacity?: number; use: string };

export const textPairs: TextPair[] = [
  { text: 'foreground', surface: 'background', use: 'Body text' },
  { text: 'card-foreground', surface: 'card', use: 'Text in a card' },
  { text: 'popover-foreground', surface: 'popover', use: 'Text in a menu or popover' },
  { text: 'primary-foreground', surface: 'primary', use: 'Default button' },
  { text: 'secondary-foreground', surface: 'secondary', use: 'Secondary button' },
  { text: 'muted-foreground', surface: 'background', use: 'Supporting text' },
  { text: 'muted-foreground', surface: 'muted', use: 'Supporting text on a muted fill' },
  { text: 'accent-foreground', surface: 'accent', use: 'Highlighted menu item' },
  { text: 'destructive', surface: 'background', use: 'Error message' },
  { text: 'destructive-on-tint', surface: 'destructive', tintOpacity: 0.1, use: 'Error badge' },
  { text: 'success-foreground', surface: 'success', use: 'Solid success fill' },
  { text: 'success-on-tint', surface: 'success', tintOpacity: 0.1, use: 'Success badge, alert' },
  { text: 'warning-foreground', surface: 'warning', use: 'Solid warning fill' },
  { text: 'warning-on-tint', surface: 'warning', tintOpacity: 0.1, use: 'Warning badge, alert' },
  { text: 'info-foreground', surface: 'info', use: 'Solid info fill' },
  { text: 'info-on-tint', surface: 'info', tintOpacity: 0.1, use: 'Info badge, alert' },
  { text: 'sidebar-foreground', surface: 'sidebar', use: 'Sidebar text' },
  { text: 'sidebar-primary-foreground', surface: 'sidebar-primary', use: 'Sidebar primary item' },
  { text: 'sidebar-accent-foreground', surface: 'sidebar-accent', use: 'Active sidebar item' },
  { text: 'chart-1-on-tint', surface: 'chart-1', tintOpacity: 0.1, use: 'Chart 1 label' },
  { text: 'chart-2-on-tint', surface: 'chart-2', tintOpacity: 0.1, use: 'Chart 2 label' },
  { text: 'chart-3-on-tint', surface: 'chart-3', tintOpacity: 0.1, use: 'Chart 3 label' },
  { text: 'chart-4-on-tint', surface: 'chart-4', tintOpacity: 0.1, use: 'Chart 4 label' },
  { text: 'chart-5-on-tint', surface: 'chart-5', tintOpacity: 0.1, use: 'Chart 5 label' },
];

export function tokenRgb(theme: ThemeName, token: string) {
  const value = tokenValues[theme][token];
  if (!value) throw new Error(`No --${token} token in the ${theme} theme.`);
  return hslToRgb(value);
}

export function pairColors(theme: ThemeName, pair: TextPair) {
  const text = tokenRgb(theme, pair.text);
  const surfaceColor = tokenRgb(theme, pair.surface);
  const surface = pair.tintOpacity
    ? tint(surfaceColor, tokenRgb(theme, 'background'), pair.tintOpacity)
    : surfaceColor;
  return { text, surface, ratio: contrastRatio(text, surface) };
}
