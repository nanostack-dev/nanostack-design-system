import { CheckCircleIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Badge, type BadgeVariant } from './badge';

const variants: BadgeVariant[] = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'link',
  'destructive',
  'success',
  'warning',
  'info',
];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Active' },
  argTypes: { variant: { control: 'select', options: variants } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Active')).toHaveAttribute('data-slot', 'badge');
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const variant of variants) {
      await expect(canvas.getByText(variant)).toBeVisible();
    }
    const success = getComputedStyle(canvas.getByText('success')).color;
    const secondary = getComputedStyle(canvas.getByText('secondary')).color;
    await expect(success).not.toBe(secondary);
  },
};

export const WithIcon: Story = {
  args: { variant: 'success' },
  render: (args) => (
    <Badge {...args}>
      <CheckCircleIcon data-icon="inline-start" />
      Passed
    </Badge>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Passed')).toBeVisible();
  },
};

export const AsLink: Story = {
  args: { variant: 'outline', render: <a href="#releases" />, children: 'Release notes' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Release notes' })).toHaveAttribute(
      'href',
      '#releases',
    );
  },
};
