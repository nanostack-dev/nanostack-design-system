import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

const colorGroups = [
  {
    name: 'Surfaces',
    tokens: ['background', 'foreground', 'card', 'popover', 'surface-subtle', 'surface-elevated'],
  },
  {
    name: 'Actions',
    tokens: ['primary', 'primary-foreground', 'secondary', 'muted', 'muted-foreground', 'accent'],
  },
  {
    name: 'Status',
    tokens: [
      'destructive',
      'destructive-on-tint',
      'success',
      'success-on-tint',
      'warning',
      'warning-on-tint',
      'info',
      'info-on-tint',
    ],
  },
  { name: 'Lines', tokens: ['border', 'border-strong', 'input', 'ring'] },
  { name: 'Charts', tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
  {
    name: 'Sidebar',
    tokens: ['sidebar', 'sidebar-primary', 'sidebar-accent', 'sidebar-border', 'sidebar-ring'],
  },
];

function ColorTokens() {
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      {colorGroups.map((group) => (
        <section key={group.name} className="flex flex-col gap-2">
          <h2 className="text-lg">{group.name}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {group.tokens.map((token) => (
              <li key={token} className="flex flex-col gap-1 text-sm">
                <span
                  data-token={token}
                  className="h-12 rounded-lg border border-border-strong"
                  style={{ background: `var(--${token})` }}
                />
                <code className="font-mono text-xs">--{token}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Typography() {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-4xl">Outfit heading, level one</h1>
      <h2 className="text-2xl">Outfit heading, level two</h2>
      <p className="font-sans">
        Plus Jakarta Sans carries body text, labels and controls. It stays legible at 13 px.
      </p>
      <p className="text-sm text-muted-foreground">Muted supporting text on the background.</p>
      <code className="font-mono text-sm">cus_9f2ka81m · GET /v1/customers?limit=20</code>
    </div>
  );
}

const radii = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;

function Radius() {
  return (
    <div className="flex flex-wrap gap-4">
      {radii.map((radius) => (
        <div key={radius} className="flex flex-col items-center gap-1 text-xs">
          <span
            className="size-16 border border-border-strong bg-muted"
            style={{ borderRadius: `var(--radius-${radius})` }}
          />
          <code className="font-mono">rounded-{radius}</code>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  globals: { theme: 'light' },
  render: () => <ColorTokens />,
  play: async ({ canvasElement }) => {
    const primary = canvasElement.querySelector('[data-token="primary"]');
    await expect(primary).not.toBeNull();
    await expect(getComputedStyle(primary as Element).backgroundColor).toBe('rgb(31, 91, 189)');
  },
};

export const ColorsDark: Story = {
  render: () => <ColorTokens />,
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    await expect(document.documentElement).toHaveClass('dark');
    const primary = canvasElement.querySelector('[data-token="primary"]');
    await expect(getComputedStyle(primary as Element).backgroundColor).toBe('rgb(160, 227, 59)');
  },
};

export const Fonts: Story = {
  render: () => <Typography />,
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 1 });
    await expect(getComputedStyle(heading).fontFamily).toContain('Outfit Variable');
    const code = canvas.getByText(/cus_9f2ka81m/);
    await expect(getComputedStyle(code).fontFamily).toContain('Geist Mono Variable');
  },
};

export const Radii: Story = {
  render: () => <Radius />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('rounded-4xl')).toBeVisible();
  },
};
