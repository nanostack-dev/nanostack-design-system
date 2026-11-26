import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import { useLayoutEffect } from 'react';

import { palettes } from '../src/blocks/theme';
import { DesignSystemProvider, type Material } from '../src/provider';
import { ThemedDocsContainer } from './docs-container';
import './preview.css';

function defaultTheme() {
  if (import.meta.env.VITE_STORYBOOK_THEME) return import.meta.env.VITE_STORYBOOK_THEME;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// The glass material needs its backdrop behind every story, not only the app
// shell, or the translucent surfaces have nothing to show.
function StoryMaterial({ material }: { material: Material }) {
  useLayoutEffect(() => {
    document.body.dataset.storyMaterial = material;
    return () => {
      delete document.body.dataset.storyMaterial;
    };
  }, [material]);
  return null;
}

// The palette and contrast attributes that ThemeProvider writes, so every
// story can be reviewed in every theme without mounting the provider.
function StoryTheme({ palette, contrast }: { palette: string; contrast: string }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.nsPalette = palette;
    root.dataset.nsContrast = contrast;
  }, [palette, contrast]);
  return null;
}

const preview: Preview = {
  globalTypes: {
    palette: {
      description: 'Colour theme (data-ns-palette)',
      toolbar: {
        title: 'Palette',
        icon: 'paintbrush',
        items: palettes.map((palette) => ({ value: palette.id, title: palette.label })),
        dynamicTitle: true,
      },
    },
    contrast: {
      description: 'Contrast level (data-ns-contrast)',
      toolbar: {
        title: 'Contrast',
        icon: 'contrast',
        items: [
          { value: 'standard', title: 'Standard contrast' },
          { value: 'high', title: 'High contrast' },
        ],
        dynamicTitle: true,
      },
    },
    material: {
      description: 'DesignSystemProvider material',
      toolbar: {
        title: 'Material',
        icon: 'mirror',
        items: [
          { value: 'solid', title: 'Solid' },
          { value: 'glass', title: 'Glass' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <DesignSystemProvider material={context.globals.material as Material}>
        <StoryMaterial material={context.globals.material as Material} />
        <StoryTheme
          palette={String(context.globals.palette ?? 'tide')}
          contrast={String(context.globals.contrast ?? 'standard')}
        />
        <Story />
      </DesignSystemProvider>
    ),
    withThemeByClassName({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { container: ThemedDocsContainer, toc: { headingSelector: 'h2, h3' } },
    options: {
      storySort: {
        order: ['Welcome', 'Foundations', 'Guides', 'Layout', 'Components', 'Blocks', 'Showcase'],
      },
    },
  },
  initialGlobals: {
    theme: defaultTheme(),
    material: 'solid',
    palette: import.meta.env.VITE_STORYBOOK_PALETTE ?? 'tide',
    contrast: 'standard',
  },
  tags: ['autodocs'],
};

export default preview;
