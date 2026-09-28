import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';

import { Progress, ProgressLabel, ProgressValue } from './progress';

const meta = {
  title: 'Components/Progress',
  parameters: {
    docs: {
      description: {
        component:
          'A bar that shows how much of a task is done. Use it when you know the total. Use `Spinner` when you do not.',
      },
    },
  },
  component: Progress,
  args: { value: 40 },
  render: (args) => (
    <Progress {...args} className="w-72">
      <ProgressLabel>Upload</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

function indicatorWidthRatio(canvasElement: HTMLElement) {
  const track = canvasElement.querySelector('[data-slot="progress-track"]')!;
  const indicator = canvasElement.querySelector('[data-slot="progress-indicator"]')!;
  return indicator.getBoundingClientRect().width / track.getBoundingClientRect().width;
}

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const progress = canvas.getByRole('progressbar', { name: 'Upload' });
    await expect(progress).toHaveAttribute('aria-valuenow', '40');
    await expect(canvas.getByText('40%')).toBeVisible();
    await expect(indicatorWidthRatio(canvasElement)).toBeCloseTo(0.4, 2);
  },
};

export const Complete: Story = {
  args: { value: 100 },
  play: async ({ canvas, canvasElement }) => {
    const progress = canvas.getByRole('progressbar', { name: 'Upload' });
    await expect(progress).toHaveAttribute('data-complete');
    await expect(indicatorWidthRatio(canvasElement)).toBeCloseTo(1, 2);
  },
};

export const Indeterminate: Story = {
  args: { value: null },
  play: async ({ canvas }) => {
    const progress = canvas.getByRole('progressbar', { name: 'Upload' });
    await expect(progress).not.toHaveAttribute('aria-valuenow');
    await expect(progress).toHaveAttribute('data-indeterminate');
  },
};

export const WithoutLabel: Story = {
  args: { value: 64, 'aria-label': 'Storage used' },
  render: (args) => <Progress {...args} className="w-72" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Storage used' })).toHaveAttribute(
      'aria-valuenow',
      '64',
    );
  },
};

function UpdatingProgress() {
  const [value, setValue] = useState(20);
  return (
    <div className="flex w-72 flex-col items-start gap-3">
      <Progress value={value} className="w-full">
        <ProgressLabel>Import</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Button variant="outline" onClick={() => setValue((current) => Math.min(current + 30, 100))}>
        Advance
      </Button>
    </div>
  );
}

export const Updating: Story = {
  render: () => <UpdatingProgress />,
  play: async ({ canvas, userEvent }) => {
    const progress = canvas.getByRole('progressbar', { name: 'Import' });
    await userEvent.click(canvas.getByRole('button', { name: 'Advance' }));
    await expect(progress).toHaveAttribute('aria-valuenow', '50');
    await expect(canvas.getByText('50%')).toBeVisible();
  },
};
