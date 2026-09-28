import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig, type TestProjectInlineConfiguration } from 'vitest/config';

import viteConfig from './vite.config.ts';

const configDir = fileURLToPath(new URL('./.storybook', import.meta.url));

function storybookProject(theme: 'light' | 'dark'): TestProjectInlineConfiguration {
  return {
    extends: true,
    plugins: [storybookTest({ configDir })],
    define: { 'import.meta.env.VITE_STORYBOOK_THEME': JSON.stringify(theme) },
    test: {
      name: theme === 'light' ? 'storybook' : 'storybook-dark',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: 'chromium' }],
      },
    },
  };
}

// Every story runs twice: once with the light tokens, once under the .dark class,
// so the a11y contrast check covers both themes.
export default mergeConfig(
  viteConfig,
  defineConfig({ test: { projects: [storybookProject('light'), storybookProject('dark')] } }),
);
