import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor, within } from 'storybook/test';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';
import { Text } from '@/components/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';
import { Spread } from '@/layout/spread';
import { Stack } from '@/layout/stack';

import { palettes } from './palettes';
import { ThemeProvider, type ThemeProviderProps, ThemeToggle, useTheme } from './theme';
import { ThemePicker, ThemeSettings } from './theme-picker';

const usage = `
\`ThemeProvider\` stores the light, dark or system choice and sets the \`dark\` class on \`<html>\`. \`ThemeToggle\` is the menu that changes it. \`useTheme()\` reads and sets the choice from any component. Put the provider at the root of the application.

The block has no look props. \`ThemeToggle\` is a ghost icon button that opens a menu with three choices.

It also stores the colour theme (\`palette\`: Tide, Lagoon, Aurora or Ember) and the contrast level (\`standard\` or \`high\`), and writes them to \`<html data-ns-palette data-ns-contrast>\`. Every token follows them (docs/technical/theming.md). \`ThemePicker\` is the icon button that opens all three choices; \`ThemeSettings\` renders the same controls inline, for a settings page.

## Props

- \`defaultTheme\`: \`system\` by default. The choice before the person picks one.
- \`defaultPalette\`: \`tide\` by default. \`defaultContrast\`: \`standard\` by default.
- \`storageKey\`: the \`localStorage\` key. Give each product its own key. The palette is stored under \`<key>-palette\` and the contrast under \`<key>-contrast\`.
- \`ThemeToggle labels\`, \`ThemePicker labels\`, \`ThemeSettings labels\`: the text, for a translated product.

A product that paints before React mounts (a theme script in \`index.html\`) reads the same three keys and sets the same class and attributes, so the first paint is already in the person's theme.

## Do not

- Do not set the \`dark\` class on \`<html>\` yourself. Call \`setTheme\` from \`useTheme()\`.
- Do not set \`data-ns-palette\` or \`data-ns-contrast\` on \`<html>\` yourself. Call \`setPalette\` and \`setContrast\`. On a nested element, \`data-ns-palette\` re-themes its subtree: use it for previews only.
- Do not show \`ThemePicker\` and \`ThemeToggle\` side by side. The picker includes the light and dark choice.
- Do not put two \`ThemeProvider\` in one application.
- Do not show a theme toggle on a screen that does not change with the theme.
`;

const storageKey = 'nanostack-theme-story';

function clearStoredTheme() {
  try {
    for (const key of [storageKey, `${storageKey}-palette`, `${storageKey}-contrast`]) {
      window.localStorage.removeItem(key);
    }
  } catch {
    return;
  }
}

function ThemeStatus() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <Stack space="xs">
      <Text tone="muted">
        Choice <span data-testid="theme-choice">{theme}</span>
      </Text>
      <Text tone="muted">
        Applied <span data-testid="theme-resolved">{resolvedTheme}</span>
      </Text>
    </Stack>
  );
}

function ThemeDemo(props: Omit<ThemeProviderProps, 'children'>) {
  return (
    <ThemeProvider storageKey={storageKey} {...props}>
      <div className="w-72">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Pick a light, dark or system theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <Spread space="lg" alignY="start">
              <ThemeStatus />
              <ThemeToggle />
            </Spread>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

const root = () => document.documentElement;

async function openThemeMenu(
  trigger: HTMLElement,
  userEvent: { click: (element: Element) => Promise<void> },
) {
  await userEvent.click(trigger);
  const menu = await screen.findByRole('menu');
  await waitFor(() => expect(menu).toBeVisible());
  return menu;
}

const meta = {
  title: 'Blocks/Theme',
  parameters: {
    docs: { description: { component: usage } },
  },
  component: ThemeProvider,
  args: { defaultTheme: 'light', storageKey, children: null },
  beforeEach: () => {
    const hadDarkClass = root().classList.contains('dark');
    const colorScheme = root().style.colorScheme;
    const { nsPalette, nsContrast } = root().dataset;
    clearStoredTheme();
    return () => {
      root().classList.toggle('dark', hadDarkClass);
      root().style.colorScheme = colorScheme;
      root().dataset.nsPalette = nsPalette ?? 'tide';
      root().dataset.nsContrast = nsContrast ?? 'standard';
      clearStoredTheme();
    };
  },
  render: ({ defaultTheme }) => <ThemeDemo defaultTheme={defaultTheme} />,
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: { theme: 'light' },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Change theme' });
    await waitFor(() => expect(root()).not.toHaveClass('dark'));
    await expect(canvas.getByTestId('theme-resolved')).toHaveTextContent('light');

    const menu = await openThemeMenu(trigger, userEvent);
    await expect(within(menu).getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.click(within(menu).getByRole('menuitemradio', { name: 'Dark' }));
    await waitFor(() => expect(root()).toHaveClass('dark'));
    await expect(root().style.colorScheme).toBe('dark');
    await expect(canvas.getByTestId('theme-choice')).toHaveTextContent('dark');
    await expect(window.localStorage.getItem(storageKey)).toBe('dark');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  args: { defaultTheme: 'dark' },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Change theme' });
    await waitFor(() => expect(root()).toHaveClass('dark'));

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    const light = within(menu).getByRole('menuitemradio', { name: 'Light' });
    await waitFor(() => expect(light).toHaveFocus());
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(root()).not.toHaveClass('dark'));
    await expect(root().style.colorScheme).toBe('light');
    await expect(canvas.getByTestId('theme-choice')).toHaveTextContent('light');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const System: Story = {
  globals: { theme: 'light' },
  args: { defaultTheme: 'system' },
  play: async ({ canvas, userEvent }) => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    await expect(canvas.getByTestId('theme-choice')).toHaveTextContent('system');
    await expect(canvas.getByTestId('theme-resolved')).toHaveTextContent(systemTheme);
    await waitFor(() => expect(root().classList.contains('dark')).toBe(systemTheme === 'dark'));

    const menu = await openThemeMenu(
      canvas.getByRole('button', { name: 'Change theme' }),
      userEvent,
    );
    await expect(within(menu).getByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const StoredChoice: Story = {
  globals: { theme: 'light' },
  args: { defaultTheme: 'dark' },
  beforeEach: () => {
    window.localStorage.setItem(storageKey, 'light');
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByTestId('theme-choice')).toHaveTextContent('light');
    await waitFor(() => expect(root()).not.toHaveClass('dark'));
    const menu = await openThemeMenu(
      canvas.getByRole('button', { name: 'Change theme' }),
      userEvent,
    );
    await expect(within(menu).getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const CustomLabels: Story = {
  globals: { theme: 'light' },
  render: () => (
    <ThemeProvider storageKey={storageKey} defaultTheme="light">
      <ThemeToggle
        labels={{ light: 'Clair', dark: 'Sombre', system: 'Système', trigger: 'Thème' }}
      />
    </ThemeProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    const menu = await openThemeMenu(canvas.getByRole('button', { name: 'Thème' }), userEvent);
    const itemNames = within(menu)
      .getAllByRole('menuitemradio')
      .map((item) => item.textContent);
    await expect(itemNames).toEqual(['Clair', 'Sombre', 'Système']);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const Dark: Story = {
  args: { defaultTheme: 'dark' },
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await waitFor(() => expect(root()).toHaveClass('dark'));
    await expect(canvas.getByTestId('theme-resolved')).toHaveTextContent('dark');
    const menu = await openThemeMenu(
      canvas.getByRole('button', { name: 'Change theme' }),
      userEvent,
    );
    await expect(within(menu).getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

async function openPicker(
  trigger: HTMLElement,
  userEvent: { click: (element: Element) => Promise<void> },
) {
  await userEvent.click(trigger);
  const dialog = await screen.findByRole('dialog', { name: 'Appearance' });
  await waitFor(() => expect(dialog).toBeVisible());
  return dialog;
}

export const Picker: Story = {
  globals: { theme: 'light' },
  render: () => (
    <ThemeProvider storageKey={storageKey} defaultTheme="light">
      <ThemePicker />
    </ThemeProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Appearance' });
    await waitFor(() => expect(root().dataset.nsPalette).toBe('tide'));
    const dialog = await openPicker(trigger, userEvent);
    const picker = within(dialog);

    await expect(picker.getByRole('radio', { name: /^Tide/ })).toBeChecked();
    await userEvent.click(picker.getByText('Aurora'));
    await waitFor(() => expect(root().dataset.nsPalette).toBe('aurora'));
    await expect(window.localStorage.getItem(`${storageKey}-palette`)).toBe('aurora');

    await userEvent.click(picker.getByRole('switch', { name: 'Increase contrast' }));
    await waitFor(() => expect(root().dataset.nsContrast).toBe('high'));
    await expect(window.localStorage.getItem(`${storageKey}-contrast`)).toBe('high');

    await userEvent.click(picker.getByRole('button', { name: 'Dark' }));
    await waitFor(() => expect(root()).toHaveClass('dark'));
    await expect(window.localStorage.getItem(storageKey)).toBe('dark');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const PickerKeyboard: Story = {
  name: 'Picker, keyboard',
  globals: { theme: 'light' },
  render: () => (
    <ThemeProvider storageKey={storageKey} defaultTheme="light">
      <ThemePicker />
    </ThemeProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Appearance' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Appearance' });
    within(dialog).getByRole('radio', { name: /^Tide/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(root().dataset.nsPalette).toBe('lagoon'));
    await expect(within(dialog).getByRole('radio', { name: /^Lagoon/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const StoredPalette: Story = {
  name: 'Settings, stored palette',
  globals: { theme: 'light' },
  beforeEach: () => {
    window.localStorage.setItem(`${storageKey}-palette`, 'ember');
    window.localStorage.setItem(`${storageKey}-contrast`, 'not-a-level');
  },
  render: () => (
    <ThemeProvider storageKey={storageKey} defaultTheme="light">
      <div className="w-80">
        <ThemeSettings />
      </div>
    </ThemeProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: /^Ember/ })).toBeChecked();
    await waitFor(() => expect(root().dataset.nsPalette).toBe('ember'));
    // An unknown stored value falls back to the default.
    await waitFor(() => expect(root().dataset.nsContrast).toBe('standard'));
    await expect(canvas.getByRole('switch', { name: 'Increase contrast' })).not.toBeChecked();
  },
};

export const WorstCase: Story = {
  name: 'Settings, worst case',
  // Follows the test project's mode, so axe checks the controls in light and dark.
  render: (_, { globals }) => (
    <ThemeProvider
      storageKey={storageKey}
      defaultTheme={globals.theme === 'dark' ? 'dark' : 'light'}
    >
      <div className="w-64">
        <ThemeSettings
          labels={{
            mode: 'Mode d’affichage de l’interface',
            light: 'Clair',
            dark: 'Sombre',
            system: 'Système',
            palette: 'Thème de couleur pour toute l’application',
            contrast: 'Augmenter le contraste du texte et des bordures',
            contrastDescription:
              'Le texte devient plus foncé et les bordures des champs plus visibles, dans chaque thème.',
          }}
        />
      </div>
    </ThemeProvider>
  ),
};

/** Each palette's tokens on the same components: set `data-ns-palette` on a tile. */
export const Palettes: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="grid gap-4 p-6 md:grid-cols-2">
      {palettes.map((palette) => (
        <section
          key={palette.id}
          data-ns-palette={palette.id}
          aria-label={palette.label}
          className="grid gap-4 rounded-3xl bg-ground bg-(image:--glass-backdrop) p-5 text-foreground"
        >
          <Stack space="xxs">
            <Text weight="semibold">{palette.label}</Text>
            <Text tone="muted" size="sm">
              {palette.description}
            </Text>
          </Stack>
          <Spread space="sm">
            <Tabs defaultValue="tests">
              <TabsList>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="functions">Functions</TabsTrigger>
              </TabsList>
            </Tabs>
            <ToggleGroup variant="outline" size="sm" aria-label="View" defaultValue={['table']}>
              <ToggleGroupItem value="folders">Folders</ToggleGroupItem>
              <ToggleGroupItem value="table">Table</ToggleGroupItem>
            </ToggleGroup>
          </Spread>
          <Card>
            <CardContent>
              <Stack space="sm">
                <Input aria-label={`Search, ${palette.label}`} placeholder="Search tests…" />
                <Spread space="sm">
                  <Badge variant="soft" tone="neutral">
                    gate
                  </Badge>
                  <Badge variant="soft" tone="success">
                    Passed
                  </Badge>
                  <Badge variant="soft" tone="critical">
                    Failed
                  </Badge>
                </Spread>
                <Spread space="sm">
                  <Button variant="outline">New folder</Button>
                  <Button>Create test</Button>
                </Spread>
              </Stack>
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  ),
};
