import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import {
  StatCard,
  StatCardDescription,
  StatCardLabel,
  StatCardTrend,
  StatCardValue,
  type StatCardTrendDirection,
  type StatCardTrendTone,
} from './stat-card';

type Stat = {
  label: string;
  value: string;
  trend: string;
  direction: StatCardTrendDirection;
  tone?: StatCardTrendTone;
  description: string;
};

const stats: Stat[] = [
  {
    label: 'Total revenue',
    value: '$45,231.89',
    trend: '+20.1%',
    direction: 'up',
    description: 'Compared with last month',
  },
  {
    label: 'Active users',
    value: '2,350',
    trend: '-4.3%',
    direction: 'down',
    description: 'Compared with last month',
  },
  {
    label: 'Average session',
    value: '4m 12s',
    trend: '0%',
    direction: 'flat',
    description: 'No change since last week',
  },
  {
    label: 'Error rate',
    value: '1.8%',
    trend: '+0.6%',
    direction: 'up',
    tone: 'negative',
    description: 'Higher is worse',
  },
];

function StatGrid() {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} aria-label={stat.label} role="group">
          <StatCardLabel>{stat.label}</StatCardLabel>
          <StatCardValue>{stat.value}</StatCardValue>
          <StatCardTrend direction={stat.direction} tone={stat.tone}>
            {stat.trend}
          </StatCardTrend>
          <StatCardDescription>{stat.description}</StatCardDescription>
        </StatCard>
      ))}
    </div>
  );
}

function trendOf(card: HTMLElement) {
  const trend = card.querySelector<HTMLElement>('[data-tone]');
  if (!trend) throw new Error('The card has no trend badge.');
  return trend;
}

const meta = {
  title: 'Blocks/Stat Card',
  component: StatCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A card with one key number, its label and a trend badge. Use it in a row at the top of a dashboard.',
      },
    },
  },
  render: () => <StatGrid />,
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  play: async ({ canvas }) => {
    const cards = canvas.getAllByRole('group');
    await expect(cards).toHaveLength(4);
    const revenue = canvas.getByRole('group', { name: 'Total revenue' });
    await expect(within(revenue).getByText('$45,231.89')).toBeVisible();
    await expect(within(revenue).getByText('Compared with last month')).toBeVisible();
    await expect(trendOf(revenue)).toHaveTextContent('Increase +20.1%');
  },
};

export const TrendTones: Story = {
  play: async ({ canvas }) => {
    const revenue = trendOf(canvas.getByRole('group', { name: 'Total revenue' }));
    await expect(revenue).toHaveAttribute('data-tone', 'positive');
    await expect(revenue).toHaveAttribute('data-direction', 'up');

    const users = trendOf(canvas.getByRole('group', { name: 'Active users' }));
    await expect(users).toHaveAttribute('data-tone', 'negative');
    await expect(users).toHaveTextContent('Decrease -4.3%');

    const session = trendOf(canvas.getByRole('group', { name: 'Average session' }));
    await expect(session).toHaveAttribute('data-tone', 'neutral');
    await expect(session).toHaveTextContent('No change 0%');

    const errors = trendOf(canvas.getByRole('group', { name: 'Error rate' }));
    await expect(errors).toHaveAttribute('data-direction', 'up');
    await expect(errors).toHaveAttribute('data-tone', 'negative');

    const hiddenLabel = within(revenue).getByText('Increase');
    await expect(hiddenLabel).toHaveClass('sr-only');
    await expect(revenue.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const CustomDirectionLabel: Story = {
  render: () => (
    <div className="w-72">
      <StatCard>
        <StatCardLabel>Visitors</StatCardLabel>
        <StatCardValue>12,480</StatCardValue>
        <StatCardTrend direction="up" directionLabel="Hausse">
          +8%
        </StatCardTrend>
      </StatCard>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Hausse')).toHaveClass('sr-only');
    await expect(canvas.queryByText('Increase')).not.toBeInTheDocument();
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="w-64">
      <StatCard role="group" aria-label="Long content">
        <StatCardLabel>
          Monthly recurring revenue across every region and every subscription plan
        </StatCardLabel>
        <StatCardValue>$1,234,567,890,123.45</StatCardValue>
        <StatCardTrend direction="up">+123.45%</StatCardTrend>
        <StatCardDescription>
          Includes annual plans converted to a monthly amount and excludes refunds.
        </StatCardDescription>
      </StatCard>
    </div>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('group', { name: 'Long content' });
    await expect(canvas.getByText('$1,234,567,890,123.45')).toBeVisible();
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    await expect(trendOf(card)).toBeVisible();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas }) => {
    await expect(document.documentElement).toHaveClass('dark');
    await expect(canvas.getAllByRole('group')).toHaveLength(4);
    await expect(trendOf(canvas.getByRole('group', { name: 'Active users' }))).toHaveTextContent(
      'Decrease -4.3%',
    );
  },
};
