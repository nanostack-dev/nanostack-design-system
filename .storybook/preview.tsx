import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';

import { TooltipProvider } from '../src/components/tooltip';
import './preview.css';

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
    options: { storySort: { order: ['Foundations', 'Components', 'Blocks'] } },
  },
  initialGlobals: { theme: import.meta.env.VITE_STORYBOOK_THEME ?? 'light' },
  tags: ['autodocs'],
};

export default preview;
