import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Badge } from '@/components/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';

import { nanostackThemes } from '../../.storybook/nanostack-theme';
import {
  colorTokenNames,
  pairColors,
  rgbToCss,
  rgbToHex,
  textPairs,
  type ThemeName,
  tokenRgb,
  tokenValues,
} from './token-values';

const themeNames: ThemeName[] = ['light', 'dark'];

const colorGroups = [
  {
    name: 'Surfaces',
    tokens: [
      'background',
      'foreground',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'surface-subtle',
      'surface-elevated',
    ],
  },
  {
    name: 'Actions',
    tokens: [
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
      'muted',
      'muted-foreground',
      'accent',
      'accent-foreground',
    ],
  },
  {
    name: 'Status',
    tokens: [
      'destructive',
      'destructive-on-tint',
      'success',
      'success-foreground',
      'success-on-tint',
      'warning',
      'warning-foreground',
      'warning-on-tint',
      'info',
      'info-foreground',
      'info-on-tint',
    ],
  },
  { name: 'Lines', tokens: ['border', 'border-strong', 'input', 'ring'] },
  {
    name: 'Charts',
    tokens: [
      'chart-1',
      'chart-2',
      'chart-3',
      'chart-4',
      'chart-5',
      'chart-1-on-tint',
      'chart-2-on-tint',
      'chart-3-on-tint',
      'chart-4-on-tint',
      'chart-5-on-tint',
    ],
  },
  {
    name: 'Sidebar',
    tokens: [
      'sidebar',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
    ],
  },
];

const minimumTextContrast = 4.5;
const enhancedTextContrast = 7;

function TokenValue({ theme, token }: { theme: ThemeName; token: string }) {
  const rgb = tokenRgb(theme, token);
  return (
    <div className="flex items-center gap-3">
      <span
        data-token={token}
        data-theme={theme}
        className="size-8 shrink-0 rounded-md border border-border-strong"
        style={{ background: rgbToCss(rgb) }}
      />
      <span className="flex min-w-0 flex-col">
        <code className="font-mono text-xs">{tokenValues[theme][token]}</code>
        <code className="font-mono text-xs text-muted-foreground">{rgbToHex(rgb)}</code>
      </span>
    </div>
  );
}

function ColorTokens() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-10">
      {colorGroups.map((group) => (
        <section key={group.name} aria-labelledby={`tokens-${group.name}`}>
          <Table>
            <TableCaption id={`tokens-${group.name}`} className="mt-0 mb-3 text-left caption-top">
              <span className="font-heading text-lg font-semibold text-foreground">
                {group.name}
              </span>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Token</TableHead>
                <TableHead>Light</TableHead>
                <TableHead>Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.tokens.map((token) => (
                <TableRow key={token}>
                  <TableCell>
                    <code className="font-mono text-sm">--{token}</code>
                  </TableCell>
                  {themeNames.map((theme) => (
                    <TableCell key={theme}>
                      <TokenValue theme={theme} token={token} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      ))}
    </div>
  );
}

function ContrastResult({ ratio }: { ratio: number }) {
  if (ratio >= enhancedTextContrast) return <Badge variant="success">AAA</Badge>;
  if (ratio >= minimumTextContrast) return <Badge variant="success">AA</Badge>;
  return <Badge variant="destructive">Fails</Badge>;
}

function ContrastSample({ theme, pairIndex }: { theme: ThemeName; pairIndex: number }) {
  const pair = textPairs[pairIndex];
  const { text, surface, ratio } = pairColors(theme, pair);
  return (
    <div className="flex items-center gap-3" data-pair={pairIndex} data-theme={theme}>
      <span
        aria-hidden
        className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md border border-border-strong text-sm font-semibold"
        style={{ color: rgbToCss(text), background: rgbToCss(surface) }}
      >
        Aa
      </span>
      <span className="font-mono text-sm tabular-nums" data-ratio={ratio.toFixed(2)}>
        {ratio.toFixed(2)}:1
      </span>
      <ContrastResult ratio={ratio} />
    </div>
  );
}

function TextContrastTable() {
  return (
    <div className="w-full max-w-4xl">
      <Table>
        <TableCaption className="mt-0 mb-3 text-left caption-top">
          WCAG 2 contrast of each text token on the surface it sits on. AA needs 4.5:1 for body
          text, AAA needs 7:1. A tinted surface is the status color at 10% over{' '}
          <code className="font-mono">--background</code>, as in a badge.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Text on surface</TableHead>
            <TableHead>Light</TableHead>
            <TableHead>Dark</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {textPairs.map((pair, index) => (
            <TableRow key={`${pair.text}-${pair.surface}`}>
              <TableCell>
                <span className="flex flex-col gap-0.5">
                  <code className="font-mono text-sm">
                    --{pair.text} on --{pair.surface}
                    {pair.tintOpacity ? ` / ${pair.tintOpacity * 100}%` : ''}
                  </code>
                  <span className="text-xs text-muted-foreground">{pair.use}</span>
                </span>
              </TableCell>
              {themeNames.map((theme) => (
                <TableCell key={theme}>
                  <ContrastSample theme={theme} pairIndex={index} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

function currentTheme(): ThemeName {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The design tokens in `src/styles.css`. Each color has a light value on `:root` and a dark value on `.dark`. Use them through the Tailwind utilities (`bg-primary`, `text-muted-foreground`), never as raw colors. A token change needs the contrast table below to stay at AA and screenshots in both themes.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => <ColorTokens />,
  play: async ({ canvasElement }) => {
    const listed = colorGroups.flatMap((group) => group.tokens);
    await expect([...listed].sort()).toEqual([...colorTokenNames].sort());

    const theme = currentTheme();
    const probe = document.createElement('span');
    canvasElement.append(probe);
    for (const token of colorTokenNames) {
      probe.style.color = `var(--${token})`;
      await expect(getComputedStyle(probe).color).toBe(rgbToCss(tokenRgb(theme, token)));
    }
    probe.remove();

    const lightPrimary = canvasElement.querySelector('[data-token="primary"][data-theme="light"]');
    await expect(getComputedStyle(lightPrimary as Element).backgroundColor).toBe(
      'rgb(31, 91, 189)',
    );
    const darkPrimary = canvasElement.querySelector('[data-token="primary"][data-theme="dark"]');
    await expect(getComputedStyle(darkPrimary as Element).backgroundColor).toBe(
      'rgb(160, 227, 59)',
    );
  },
};

export const TextContrast: Story = {
  render: () => <TextContrastTable />,
  play: async ({ canvas }) => {
    const failing = themeNames.flatMap((theme) =>
      textPairs
        .filter((pair) => pairColors(theme, pair).ratio < minimumTextContrast)
        .map((pair) => `${theme}: --${pair.text} on --${pair.surface}`),
    );
    await expect(failing).toEqual([]);
    await expect(canvas.queryByText('Fails')).toBeNull();
    await expect(canvas.getAllByText(/^AAA?$/)).toHaveLength(textPairs.length * 2);
  },
};

export const StorybookTheme: Story = {
  name: 'Storybook theme',
  parameters: {
    docs: {
      description: {
        story:
          'The Storybook manager cannot read CSS variables, so its theme holds hex copies of the tokens. This test fails when a token changes and the copy does not.',
      },
    },
  },
  render: () => (
    <p className="text-sm text-muted-foreground">
      The site chrome uses <code className="font-mono">--primary</code>,{' '}
      <code className="font-mono">--background</code> and{' '}
      <code className="font-mono">--foreground</code> from each theme.
    </p>
  ),
  play: async () => {
    for (const theme of themeNames) {
      const managerTheme = nanostackThemes[theme];
      await expect(managerTheme.colorPrimary).toBe(rgbToHex(tokenRgb(theme, 'primary')));
      await expect(managerTheme.appBg).toBe(rgbToHex(tokenRgb(theme, 'background')));
      await expect(managerTheme.textColor).toBe(rgbToHex(tokenRgb(theme, 'foreground')));
      await expect(managerTheme.textMutedColor).toBe(rgbToHex(tokenRgb(theme, 'muted-foreground')));
      await expect(managerTheme.appBorderColor).toBe(rgbToHex(tokenRgb(theme, 'border')));
    }
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
