'use client';

import { useLayoutEffect } from 'react';
import { useThemeSettings } from '../theme.js';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';

/** Opt-in application integration: importing scoped CSS alone never resets a host. */
export function DocumentTheme(props: NoCustomStyle) {
  void props;
  const { brand, colorScheme, density } = useThemeSettings();
  useLayoutEffect(() => {
    const root = document.documentElement;
    const classes = ['ns-theme', 'ns-document', 'light', 'dark'];
    const previousClasses = classes.filter((name) => root.classList.contains(name));
    const attributes = {
      'data-ns-brand': brand,
      'data-ns-theme': colorScheme,
      'data-ns-density': density,
    };
    const previous = Object.keys(attributes).map(
      (name) => [name, root.getAttribute(name)] as const,
    );
    root.classList.remove('light', 'dark');
    root.classList.add('ns-theme', 'ns-document', colorScheme);
    for (const [name, value] of Object.entries(attributes)) root.setAttribute(name, value);
    return () => {
      root.classList.remove(...classes);
      root.classList.add(...previousClasses);
      for (const [name, value] of previous) {
        if (value === null) root.removeAttribute(name);
        else root.setAttribute(name, value);
      }
    };
  }, [brand, colorScheme, density]);
  return null;
}

export type ApplicationViewportProps = ElementProps<'div'>;
export function ApplicationViewport(props: ApplicationViewportProps) {
  return <div {...safeProps(props)} className="ns-application-viewport" />;
}
