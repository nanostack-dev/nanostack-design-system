import { create } from 'storybook/theming/create';

const fontBase = "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif";
const fontCode = "'Geist Mono Variable', ui-monospace, 'SF Mono', Menlo, monospace";

function brandTitle(mark: string) {
  return [
    '<span style="display:inline-flex;align-items:center;gap:10px;line-height:1.15">',
    `<img src="./${mark}" width="30" height="30" alt="" style="display:block;flex:none" />`,
    '<span style="display:flex;flex-direction:column">',
    '<span style="font-weight:700;font-size:15px;letter-spacing:-0.01em">Nanostack</span>',
    '<span style="font-weight:500;font-size:12px;opacity:.72">Design system</span>',
    '</span></span>',
  ].join('');
}

export const nanostackLight = create({
  base: 'light',
  brandTitle: brandTitle('nanostack-mark-light.svg'),
  brandUrl: './',
  brandTarget: '_self',
  fontBase,
  fontCode,
  colorPrimary: '#2456d3',
  colorSecondary: '#2456d3',
  appBg: '#f7fafe',
  appContentBg: '#ffffff',
  appPreviewBg: '#f7fafe',
  appHoverBg: '#e9f2fe',
  appBorderColor: '#d5e1f1',
  appBorderRadius: 10,
  textColor: '#0c1827',
  textInverseColor: '#ffffff',
  textMutedColor: '#4f5c6d',
  barBg: '#ffffff',
  barTextColor: '#4f5c6d',
  barHoverColor: '#2456d3',
  barSelectedColor: '#2456d3',
  buttonBg: '#ffffff',
  buttonBorder: '#d5e1f1',
  booleanBg: '#eeeff2',
  booleanSelectedBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#d5e1f1',
  inputTextColor: '#0c1827',
  inputBorderRadius: 8,
});

export const nanostackDark = create({
  base: 'dark',
  brandTitle: brandTitle('nanostack-mark-dark.svg'),
  brandUrl: './',
  brandTarget: '_self',
  fontBase,
  fontCode,
  colorPrimary: '#a9e043',
  colorSecondary: '#81c41c',
  appBg: '#08111d',
  appContentBg: '#08111d',
  appPreviewBg: '#08111d',
  appHoverBg: '#1a2431',
  appBorderColor: '#27303c',
  appBorderRadius: 10,
  textColor: '#f0f4f9',
  textInverseColor: '#08111d',
  textMutedColor: '#a5adb8',
  barBg: '#131c29',
  barTextColor: '#a5adb8',
  barHoverColor: '#a9e043',
  barSelectedColor: '#a9e043',
  buttonBg: '#1a2431',
  buttonBorder: '#27303c',
  booleanBg: '#1a2431',
  booleanSelectedBg: '#2b3650',
  inputBg: '#131c29',
  inputBorder: '#27303c',
  inputTextColor: '#f0f4f9',
  inputBorderRadius: 8,
});

export type NanostackThemeName = 'light' | 'dark';

export const nanostackThemes = { light: nanostackLight, dark: nanostackDark } as const;

export function isNanostackThemeName(value: unknown): value is NanostackThemeName {
  return value === 'light' || value === 'dark';
}
