import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const rawShadcnImport = {
  group: ['@/components/ui', '@/components/ui/*', '**/components/ui/*', '../ui/*', './ui/*'],
  message:
    'src/components/ui/ is gone: each component is owned in src/components/<name>/<name>.tsx. Import that component instead.',
};

const upstreamImport = {
  group: ['**/upstream/**', 'upstream/*'],
  message:
    'upstream/ is the merge base for pnpm shadcn:update. Import the owned component instead.',
};

const deepComponentImport = {
  group: ['@/components/*/*'],
  message:
    'Blocks, layout and stories use the public barrel (@/components/<name>), the same API a product gets.',
};

const paletteColor =
  '(^|[\\s:!"\'`])-?(bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|accent|caret|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-\\d{2,3})?\\b';
const arbitraryColor = '-\\[(#|rgb|hsl|oklch|color-mix)';
const tokenOnlyMessage =
  'Use a design token utility (bg-primary, text-muted-foreground, border-border-strong) instead of a raw color.';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'site',
      'storybook-static',
      'coverage',
      'src/hooks/use-mobile.ts',
      'upstream/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  ...storybook.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [rawShadcnImport, upstreamImport] }],
      'no-restricted-syntax': [
        'error',
        { selector: `Literal[value=/${paletteColor}/]`, message: tokenOnlyMessage },
        { selector: `TemplateElement[value.raw=/${paletteColor}/]`, message: tokenOnlyMessage },
        { selector: `Literal[value=/${arbitraryColor}/]`, message: tokenOnlyMessage },
        { selector: `TemplateElement[value.raw=/${arbitraryColor}/]`, message: tokenOnlyMessage },
      ],
    },
  },
  {
    files: ['src/components/*/*.tsx'],
    ignores: ['src/components/**/*.stories.tsx'],
    rules: { 'no-restricted-imports': ['error', { patterns: [upstreamImport] }] },
  },
  {
    files: [
      'src/blocks/**/*.{ts,tsx}',
      'src/layout/**/*.{ts,tsx}',
      'src/stories/**/*.{ts,tsx}',
      'src/**/*.stories.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [rawShadcnImport, upstreamImport, deepComponentImport] },
      ],
    },
  },
);
