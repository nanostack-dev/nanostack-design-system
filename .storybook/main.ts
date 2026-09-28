import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  staticDirs: [
    './public',
    {
      from: '../node_modules/@fontsource-variable/plus-jakarta-sans/files',
      to: '/fonts/plus-jakarta-sans',
    },
    { from: '../node_modules/@fontsource-variable/geist-mono/files', to: '/fonts/geist-mono' },
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
};

export default config;
