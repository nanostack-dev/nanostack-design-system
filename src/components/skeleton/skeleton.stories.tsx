import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Skeleton } from './skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { className: 'h-4 w-48' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-hidden': true },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]');
    await expect(skeleton).not.toBeNull();
    await expect(getComputedStyle(skeleton as Element).animationName).not.toBe('none');
  },
};

export const Card: Story = {
  render: () => (
    <div role="status" aria-label="Loading profile" className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status', { name: 'Loading profile' });
    await expect(status.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3);
  },
};
