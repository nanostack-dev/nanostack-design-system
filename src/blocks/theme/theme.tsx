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
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
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

function readStoredTheme(storageKey: string): Theme | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(storageKey: string, theme: Theme) {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    return;
  }
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
  storageKey = 'nanostack-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === 'undefined' ? defaultTheme : (readStoredTheme(storageKey) ?? defaultTheme),
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

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      writeStoredTheme(storageKey, nextTheme);
    },
    [storageKey],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
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
