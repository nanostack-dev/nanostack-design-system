import { PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/button';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

const meta = {
  title: 'Components/Tooltip',
  parameters: {
    docs: {
      description: {
        component:
          'A short label that shows when the pointer or the focus is on a control. Use it to name an icon button. Do not put actions in it.',
      },
    },
  },
  component: Tooltip,
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Add project" />}>
        <PlusIcon />
      </TooltipTrigger>
      <TooltipContent>Add project</TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Add project' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByText('Add project')).toBeVisible());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByText('Add project')).not.toBeInTheDocument());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Add project' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(screen.getByText('Add project')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Add project')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} {...args} defaultOpen={side === 'bottom'}>
          <TooltipTrigger render={<Button variant="outline" />}>{side}</TooltipTrigger>
          <TooltipContent side={side}>Opens on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const tooltip = await screen.findByText('Opens on the bottom');
    const trigger = canvas.getByRole('button', { name: 'bottom' });
    await waitFor(() =>
      expect(tooltip.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().bottom,
      ),
    );
  },
};
