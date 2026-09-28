import { SignInIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Marker, MarkerContent, MarkerIcon, type MarkerVariant } from './marker';

const variants: MarkerVariant[] = ['default', 'separator', 'border'];

const meta = {
  title: 'Components/Marker',
  component: Marker,
  args: { variant: 'default' },
  argTypes: { variant: { control: 'select', options: variants } },
  render: (args) => (
    <div className="w-md">
      <Marker {...args}>
        <MarkerIcon>
          <SignInIcon />
        </MarkerIcon>
        <MarkerContent>Sarah joined the conversation</MarkerContent>
      </Marker>
    </div>
  ),
} satisfies Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Sarah joined the conversation')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="marker-icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-md flex-col gap-6">
      {variants.map((variant) => (
        <Marker key={variant} {...args} variant={variant}>
          <MarkerContent>{variant}</MarkerContent>
        </Marker>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByText('separator');
    const row = separator.closest('[data-slot="marker"]')!;
    const rowBox = row.getBoundingClientRect();
    const labelBox = separator.getBoundingClientRect();
    const leftGap = labelBox.left - rowBox.left;
    const rightGap = rowBox.right - labelBox.right;
    await expect(Math.abs(leftGap - rightGap)).toBeLessThan(2);
    const border = canvas.getByText('border').closest('[data-slot="marker"]')!;
    await expect(getComputedStyle(border).borderBottomWidth).toBe('1px');
  },
};

export const DateDivider: Story = {
  args: { variant: 'separator' },
  render: (args) => (
    <div className="w-md">
      <Marker {...args} render={<time dateTime="2026-09-27" />}>
        <MarkerContent>Today</MarkerContent>
      </Marker>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Today').closest('time')).toHaveAttribute(
      'datetime',
      '2026-09-27',
    );
  },
};

export const WithLink: Story = {
  render: (args) => (
    <div className="w-md">
      <Marker {...args}>
        <MarkerContent>
          The thread moved to <a href="#incident-42">incident 42</a>
        </MarkerContent>
      </Marker>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'incident 42' })).toHaveFocus();
  },
};
