import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import { IconButton } from '@/components/button';

import {
  type Contrast,
  defaultPalette as fallbackPalette,
  isContrast,
  isPalette,
  type Palette,
} from './palettes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  /** The colour theme, written to `<html data-ns-palette>`. */
  palette: Palette;
  setPalette: (palette: Palette) => void;
  /** `high` darkens ink and strengthens rules and edges, written to `<html data-ns-contrast>`. */
  contrast: Contrast;
  setContrast: (contrast: Contrast) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultPalette?: Palette;
  defaultContrast?: Contrast;
  /** Light, dark or system is stored under this key; the palette under
   * `<key>-palette` and the contrast under `<key>-contrast`. */
  storageKey?: string;
}

export interface ThemeToggleLabels {
  light: string;
  dark: string;
  system: string;
  trigger: string;
}

export interface ThemeToggleProps {
  labels?: Partial<ThemeToggleLabels>;
}

const darkSchemeQuery = '(prefers-color-scheme: dark)';

const defaultToggleLabels: ThemeToggleLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  trigger: 'Change theme',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readStored<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  try {
    const value = window.localStorage.getItem(key);
    return isValid(value) ? value : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

/** Reads a stored choice once, on the client; the default on the server. */
function useStoredState<T extends string>(
  key: string,
  isValid: (value: unknown) => value is T,
  fallback: T,
) {
  const [value, setValue] = useState<T>(() =>
    typeof window === 'undefined' ? fallback : (readStored(key, isValid) ?? fallback),
  );
  const store = useCallback(
    (next: T) => {
      setValue(next);
      writeStored(key, next);
    },
    [key],
  );
  return [value, store] as const;
}

function subscribeToSystemTheme(onChange: () => void) {
  const query = window.matchMedia(darkSchemeQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(darkSchemeQuery).matches ? 'dark' : 'light';
}

function getServerSystemTheme(): ResolvedTheme {
  return 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultPalette = fallbackPalette,
  defaultContrast = 'standard',
  storageKey = 'nanostack-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useStoredState(storageKey, isTheme, defaultTheme);
  const [palette, setPalette] = useStoredState(`${storageKey}-palette`, isPalette, defaultPalette);
  const [contrast, setContrast] = useStoredState(
    `${storageKey}-contrast`,
    isContrast,
    defaultContrast,
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.nsPalette = palette;
    root.dataset.nsContrast = contrast;
  }, [palette, contrast]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, palette, setPalette, contrast, setContrast }),
    [theme, resolvedTheme, setTheme, palette, setPalette, contrast, setContrast],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return context;
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const text = { ...defaultToggleLabels, ...labels };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <IconButton
            icon={resolvedTheme === 'dark' ? MoonIcon : SunIcon}
            label={text.trigger}
            tooltip={false}
          />
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) setTheme(value);
          }}
        >
          <DropdownMenuRadioItem value="light" closeOnClick>
            <SunIcon aria-hidden />
            {text.light}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" closeOnClick>
            <MoonIcon aria-hidden />
            {text.dark}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" closeOnClick>
            <DesktopIcon aria-hidden />
            {text.system}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
