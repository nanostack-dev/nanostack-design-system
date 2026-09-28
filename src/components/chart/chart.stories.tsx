import type { Meta, StoryObj } from '@storybook/react-vite';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { expect, waitFor } from 'storybook/test';

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
  type ChartSize,
} from '@/components/chart';

const data = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const sizes: ChartSize[] = ['sm', 'md', 'lg'];

const usage = `
A Recharts wrapper for trends and comparisons on a dashboard. For one number with a trend, use the \`StatCard\` block. For exact values, use a \`Table\`.

\`ChartContainer\` takes a \`config\` and the Recharts chart as children. The config names each series, and gives it a label and a colour token. The series colour is then \`var(--color-<key>)\` in the Recharts parts.

\`\`\`tsx
const config = {
  runs: { label: 'Runs', color: 'var(--chart-1)' },
} satisfies ChartConfig;

<ChartContainer config={config}>
  <BarChart accessibilityLayer data={data}>
    <XAxis dataKey="day" />
    <ChartTooltip />
    <Bar dataKey="runs" fill="var(--color-runs)" />
  </BarChart>
</ChartContainer>
\`\`\`

The props are the whole API. \`ChartContainer\`, \`ChartTooltip\` and \`ChartLegend\` do not take \`className\`, \`style\` or a custom \`content\`. A \`color\` is one of \`var(--chart-1)\` to \`var(--chart-5)\`: the tokens already change for dark mode, so there is no \`theme\` map.

## size: the height of the chart

The chart always fills the width of its container.

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 160 px | A small chart in a card next to other cards. |
| \`md\` | 256 px | The default. The main chart of a card. |
| \`lg\` | 384 px | The main chart of a page. |

## ChartTooltip indicator: how each series is marked

| Value | Use it for |
| --- | --- |
| \`dot\` | The default. Bars and several series. |
| \`line\` | Lines and areas. |
| \`dashed\` | A target or a forecast series. |

\`hideLabel\` and \`hideIndicator\` remove the title and the colour marks. \`formatter\` and \`labelFormatter\` format the values.

## ChartLegend position

| Value | Use it for |
| --- | --- |
| \`bottom\` | The default. |
| \`top\` | A chart where the bottom is busy, for example with a brush. |

## Do not

- Do not use a colour that is not a chart token. Ask for a token if five series are not enough.
- Do not use colour alone to tell series apart in a small chart. Keep the legend.
- Do not turn off \`accessibilityLayer\` on the Recharts chart. It gives keyboard access to the tooltip.
`;

const meta = {
  title: 'Components/Chart',
  parameters: { docs: { description: { component: usage } } },
  component: ChartContainer,
  args: { config, size: 'md', children: <></> },
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => (
    <div className="w-md">
      <ChartContainer {...args}>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <ChartTooltip />
          <ChartLegend />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={false} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bars: Story = {
  play: async ({ canvas, canvasElement }) => {
    const container = canvasElement.querySelector('[data-slot="chart"]')!;
    await waitFor(() => expect(container.querySelector('svg.recharts-surface')).not.toBeNull());
    await expect(await canvas.findByText('Desktop')).toBeVisible();
    await expect(canvas.getByText('Mobile')).toBeVisible();
    await expect(canvas.getByText('Jan')).toBeInTheDocument();
    const bars = await waitFor(() => {
      const rectangles = container.querySelectorAll('.recharts-bar-rectangle path');
      expect(rectangles).toHaveLength(data.length * 2);
      return rectangles;
    });
    await expect(getComputedStyle(bars[0]!).fill).not.toBe(
      getComputedStyle(bars[bars.length - 1]!).fill,
    );
  },
};

export const KeyboardTooltip: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const container = canvasElement.querySelector('[data-slot="chart"]')!;
    const surface = await waitFor(() => {
      const element = container.querySelector('svg.recharts-surface');
      expect(element).not.toBeNull();
      return element!;
    });
    await userEvent.tab();
    await expect(surface).toHaveFocus();
    const tooltipShows = (month: string, desktop: string, mobile: string) =>
      waitFor(() => {
        const tooltip = container.querySelector('.recharts-tooltip-wrapper');
        expect(tooltip).toHaveTextContent(month);
        expect(tooltip).toHaveTextContent(`Desktop${desktop}`);
        expect(tooltip).toHaveTextContent(`Mobile${mobile}`);
      });
    await tooltipShows('January', '186', '80');
    await userEvent.keyboard('{ArrowRight}');
    await tooltipShows('February', '305', '200');
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The chart fills the width. `size` sets the height: 160, 256, 384 px.',
      },
    },
  },
  render: (args) => (
    <div className="flex w-md flex-col gap-4">
      {sizes.map((size) => (
        <ChartContainer key={size} {...args} size={size}>
          <BarChart data={data}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heights = Array.from(canvasElement.querySelectorAll('[data-slot="chart"]')).map(
      (chart) => chart.getBoundingClientRect().height,
    );
    await expect(heights).toEqual([160, 256, 384]);
  },
};

export const AreaWithLineIndicator: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An area chart uses `indicator="line"` in the tooltip and the legend on top.',
      },
    },
  },
  render: (args) => (
    <div className="w-md">
      <ChartContainer {...args}>
        <AreaChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <ChartTooltip indicator="line" defaultIndex={2} />
          <ChartLegend position="top" />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            isAnimationActive={false}
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('[data-slot="chart"]')!;
    await waitFor(() => {
      const legend = container.querySelector('[data-slot="chart-legend"]');
      const surface = container.querySelector('svg.recharts-surface');
      expect(legend).not.toBeNull();
      expect(legend!.getBoundingClientRect().top).toBeLessThan(
        surface!.getBoundingClientRect().top + 20,
      );
    });
    await waitFor(() =>
      expect(container.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('March'),
    );
  },
};
