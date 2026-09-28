import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor, within } from 'storybook/test';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Text } from '@/components/text';
import { Spread } from '@/layout/spread';
import { Stack } from '@/layout/stack';

import { ThemeProvider, type ThemeProviderProps, ThemeToggle, useTheme } from './theme';

const usage = `
\`ThemeProvider\` stores the light, dark or system choice and sets the \`dark\` class on \`<html>\`. \`ThemeToggle\` is the menu that changes it. \`useTheme()\` reads and sets the choice from any component. Put the provider at the root of the application.

The block has no look props. \`ThemeToggle\` is a ghost icon button that opens a menu with three choices.

## Props

- \`defaultTheme\`: \`system\` by default. The choice before the person picks one.
- \`storageKey\`: the \`localStorage\` key. Give each product its own key.
- \`ThemeToggle labels\`: the menu and button text, for a translated product.

## Do not

- Do not set the \`dark\` class on \`<html>\` yourself. Call \`setTheme\` from \`useTheme()\`.
- Do not put two \`ThemeProvider\` in one application.
- Do not show a theme toggle on a screen that does not change with the theme.
`;

const storageKey = 'nanostack-theme-story';

function clearStoredTheme() {
  try {
    window.localStorage.removeItem(storageKey);
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
    clearStoredTheme();
    return () => {
      root().classList.toggle('dark', hadDarkClass);
      root().style.colorScheme = colorScheme;
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
