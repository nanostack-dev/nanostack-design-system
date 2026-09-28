import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';

import { isNanostackThemeName, nanostackThemes } from './nanostack-theme';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: nanostackThemes[prefersDark ? 'dark' : 'light'],
  sidebar: { showRoots: true },
});

addons.register('nanostack/theme-sync', (api) => {
  const applyGlobalTheme = ({ globals }: { globals?: Record<string, unknown> }) => {
    const theme = globals?.theme;
    if (isNanostackThemeName(theme)) api.setOptions({ theme: nanostackThemes[theme] });
  };
  api.on(SET_GLOBALS, applyGlobalTheme);
  api.on(GLOBALS_UPDATED, applyGlobalTheme);
});
