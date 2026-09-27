'use client';

import { createContext, use } from 'react';
import { safeProps, type ElementProps } from './internal/props.js';

export type ColorScheme = 'light' | 'dark';
export type Brand = 'nanostack' | 'echopoint' | 'anchor';
export type Density = 'comfortable' | 'compact';
export type ThemeSettings = { colorScheme: ColorScheme; brand: Brand; density: Density };
const defaultTheme: ThemeSettings = {
  colorScheme: 'light',
  brand: 'nanostack',
  density: 'comfortable',
};
const ThemeContext = createContext<ThemeSettings>(defaultTheme);
export type ThemeProps = ElementProps<'div'> & Partial<ThemeSettings>;

export function Theme({
  colorScheme = 'light',
  brand = 'nanostack',
  density = 'comfortable',
  children,
  ...props
}: ThemeProps) {
  return (
    <ThemeContext value={{ colorScheme, brand, density }}>
      <div
        {...safeProps(props)}
        className="ns-theme"
        data-ns-theme={colorScheme}
        data-ns-brand={brand}
        data-ns-density={density}
      >
        {children}
      </div>
    </ThemeContext>
  );
}

/** Internal overlays inherit the nearest scope even when portalled to body. */
export function useThemeSettings() {
  return use(ThemeContext);
}
