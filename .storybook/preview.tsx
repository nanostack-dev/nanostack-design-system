import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import { TooltipProvider } from '../src/components/tooltip';
import { ThemedDocsContainer } from './docs-container';
import './preview.css';

function defaultTheme() {
  if (import.meta.env.VITE_STORYBOOK_THEME) return import.meta.env.VITE_STORYBOOK_THEME;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
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
        order: ['Welcome', 'Foundations', 'Components', 'Blocks', 'Showcase'],
      },
    },
  },
  initialGlobals: { theme: defaultTheme() },
  tags: ['autodocs'],
};

export default preview;
