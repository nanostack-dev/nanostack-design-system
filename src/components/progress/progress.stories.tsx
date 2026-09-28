import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/progress';
import { Stack } from '@/layout/stack';

const usage = `
A bar that shows how much of a task is done. Use it when you know the total, such as an upload or a quota. When you do not know it, use \`Spinner\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. \`Progress\` fills the width of its container.

## Parts

- \`Progress\` draws the track and the bar. \`value\` goes from 0 to 100, or \`null\` when the total is not known yet.
- \`ProgressLabel\` names the bar. Without a label, give \`Progress\` an \`aria-label\`.
- \`ProgressValue\` shows the value as a percentage, at the end of the label row.

## Do not

- Do not draw a second track or bar next to \`Progress\`. It already has one.
- Do not colour the bar to show a status. Put a \`Badge\` or an \`Alert\` next to it.
- Do not use a progress bar for a wait that you cannot measure.
`;

const meta = {
  title: 'Components/Progress',
  parameters: {
    docs: { description: { component: usage } },
  },
  component: Progress,
  args: { value: 40 },
  render: (args) => (
    <div className="w-72">
      <Progress {...args}>
        <ProgressLabel>Upload</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
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
  render: (args) => (
    <div className="w-72">
      <Progress {...args} />
    </div>
  ),
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
    <div className="w-72">
      <Stack space="md" align="start">
        <Progress value={value}>
          <ProgressLabel>Import</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Button onClick={() => setValue((current) => Math.min(current + 30, 100))}>Advance</Button>
      </Stack>
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
