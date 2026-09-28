import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { expect, waitFor } from 'storybook/test';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './chart';

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

const meta = {
  title: 'Components/Chart',
  parameters: {
    docs: {
      description: {
        component:
          'A Recharts wrapper that takes its colors from the `--chart-1` to `--chart-5` tokens. Use it for trends and comparisons on a dashboard.',
      },
    },
  },
  component: ChartContainer,
  args: { config, className: 'h-64 w-md', children: <></> },
  render: (args) => (
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={false} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
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
