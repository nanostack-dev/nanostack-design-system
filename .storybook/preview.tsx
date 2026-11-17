import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import { useLayoutEffect } from 'react';

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

const preview: Preview = {
  globalTypes: {
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
  initialGlobals: { theme: defaultTheme(), material: 'solid' },
  tags: ['autodocs'],
};

export default preview;
