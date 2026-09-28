import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import { isNanostackThemeName, type NanostackThemeName, nanostackThemes } from './nanostack-theme';

type GlobalsEvent = { globals?: Record<string, unknown> };
type ContextWithStore = { store?: { userGlobals?: { globals?: Record<string, unknown> } } };

function initialTheme(context: DocsContainerProps['context']): NanostackThemeName {
  const theme = (context as ContextWithStore).store?.userGlobals?.globals?.theme;
  if (isNanostackThemeName(theme)) return theme;
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState(() => initialTheme(context));

  useEffect(() => {
    const onGlobalsUpdated = ({ globals }: GlobalsEvent) => {
      if (isNanostackThemeName(globals?.theme)) setTheme(globals.theme);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <DocsContainer context={context} theme={nanostackThemes[theme]}>
      {children}
    </DocsContainer>
  );
}
