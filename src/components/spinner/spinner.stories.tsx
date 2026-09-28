import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';

import { Spinner } from './spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const spinner = canvas.getByRole('status', { name: 'Loading' });
    await expect(getComputedStyle(spinner).animationName).not.toBe('none');
  },
};

export const CustomLabel: Story = {
  args: { 'aria-label': 'Loading results', className: 'size-6' },
  play: async ({ canvas }) => {
    const spinner = canvas.getByRole('status', { name: 'Loading results' });
    await expect(spinner.getBoundingClientRect().width).toBe(24);
  },
};

export const InButton: Story = {
  render: (args) => (
    <Button disabled>
      <Spinner {...args} data-icon="inline-start" />
      Saving
    </Button>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /Saving/ });
    await expect(button).toBeDisabled();
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  },
};
