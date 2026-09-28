import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

import { DirectionProvider, useDirection } from './direction';

function DirectionLabel() {
  return <p className="text-sm text-muted-foreground">Direction: {useDirection()}</p>;
}

const meta = {
  title: 'Components/Direction',
  parameters: {
    docs: {
      description: {
        component:
          'A provider that sets left-to-right or right-to-left layout for the components inside it. Use it for right-to-left languages.',
      },
    },
  },
  component: DirectionProvider,
  args: { direction: 'rtl' },
  render: (args) => (
    <DirectionProvider {...args}>
      <div dir={args.direction} className="flex flex-col items-start gap-3">
        <DirectionLabel />
        <ToggleGroup aria-label="Alignment" defaultValue={['start']}>
          <ToggleGroupItem value="start">Start</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="end">End</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </DirectionProvider>
  ),
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightToLeft: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Direction: rtl')).toBeVisible();
    const start = canvas.getByRole('button', { name: 'Start' });
    const center = canvas.getByRole('button', { name: 'Center' });
    await expect(start.getBoundingClientRect().left).toBeGreaterThan(
      center.getBoundingClientRect().left,
    );
    await userEvent.tab();
    await expect(start).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(center).toHaveFocus();
  },
};

export const LeftToRight: Story = {
  args: { direction: 'ltr' },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Direction: ltr')).toBeVisible();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Center' })).toHaveFocus();
  },
};
