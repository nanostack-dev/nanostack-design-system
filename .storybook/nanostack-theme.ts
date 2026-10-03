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
  colorPrimary: '#1f5bbd',
  colorSecondary: '#1f5bbd',
  appBg: '#fafafb',
  appContentBg: '#ffffff',
  appPreviewBg: '#fafafb',
  appHoverBg: '#f4f7fb',
  appBorderColor: '#dcdfe5',
  appBorderRadius: 10,
  textColor: '#0f1729',
  textInverseColor: '#ffffff',
  textMutedColor: '#575e6b',
  barBg: '#ffffff',
  barTextColor: '#575e6b',
  barHoverColor: '#1f5bbd',
  barSelectedColor: '#1f5bbd',
  buttonBg: '#ffffff',
  buttonBorder: '#dcdfe5',
  booleanBg: '#eeeff2',
  booleanSelectedBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#dcdfe5',
  inputTextColor: '#0f1729',
  inputBorderRadius: 8,
});

export const nanostackDark = create({
  base: 'dark',
  brandTitle: brandTitle('nanostack-mark-dark.svg'),
  brandUrl: './',
  brandTarget: '_self',
  fontBase,
  fontCode,
  colorPrimary: '#a0e33b',
  colorSecondary: '#81c41c',
  appBg: '#090e1a',
  appContentBg: '#090e1a',
  appPreviewBg: '#090e1a',
  appHoverBg: '#191f2e',
  appBorderColor: '#20283c',
  appBorderRadius: 10,
  textColor: '#f1f5f9',
  textInverseColor: '#090e1a',
  textMutedColor: '#94a3b8',
  barBg: '#0f1524',
  barTextColor: '#94a3b8',
  barHoverColor: '#a0e33b',
  barSelectedColor: '#a0e33b',
  buttonBg: '#191f2e',
  buttonBorder: '#20283c',
  booleanBg: '#191f2e',
  booleanSelectedBg: '#2b3650',
  inputBg: '#0f1524',
  inputBorder: '#20283c',
  inputTextColor: '#f1f5f9',
  inputBorderRadius: 8,
});

export type NanostackThemeName = 'light' | 'dark';

export const nanostackThemes = { light: nanostackLight, dark: nanostackDark } as const;

export function isNanostackThemeName(value: unknown): value is NanostackThemeName {
  return value === 'light' || value === 'dark';
}
