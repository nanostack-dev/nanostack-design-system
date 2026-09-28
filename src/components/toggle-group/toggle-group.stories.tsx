import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const meta = {
  title: 'Components/Toggle Group',
  parameters: {
    docs: {
      description: {
        component:
          'A set of toggle buttons for one or many choices. Use it for two to seven options, such as a view mode.',
      },
    },
  },
  component: ToggleGroup,
  args: { 'aria-label': 'Frequency', defaultValue: ['daily'], onValueChange: fn() },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
      <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const daily = canvas.getByRole('button', { name: 'Daily' });
    const weekly = canvas.getByRole('button', { name: 'Weekly' });
    await expect(canvas.getByRole('group', { name: 'Frequency' })).toBeVisible();
    await expect(daily).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(weekly);
    await expect(weekly).toHaveAttribute('aria-pressed', 'true');
    await expect(daily).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['weekly'], expect.anything());
  },
};

export const Multiple: Story = {
  args: { 'aria-label': 'Text alignment', multiple: true, defaultValue: [] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <TextAlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <TextAlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <TextAlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Align left' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Align right' }));
    await expect(canvas.getByRole('button', { name: 'Align left' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Align right' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['left', 'right'], expect.anything());
  },
};

export const Outline: Story = {
  args: { variant: 'outline', spacing: 0 },
  play: async ({ canvas }) => {
    const items = ['Daily', 'Weekly', 'Monthly'].map((name) =>
      canvas.getByRole('button', { name }),
    );
    for (const [index, item] of items.entries()) {
      if (index === 0) continue;
      const previous = items[index - 1].getBoundingClientRect();
      await expect(item.getBoundingClientRect().left).toBeCloseTo(previous.right, 0);
    }
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', variant: 'outline' },
  play: async ({ canvas }) => {
    const daily = canvas.getByRole('button', { name: 'Daily' });
    const weekly = canvas.getByRole('button', { name: 'Weekly' });
    await expect(canvas.getByRole('group', { name: 'Frequency' })).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    await expect(weekly.getBoundingClientRect().top).toBeGreaterThan(
      daily.getBoundingClientRect().bottom - 1,
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const weekly = canvas.getByRole('button', { name: 'Weekly' });
    await expect(weekly).toBeDisabled();
    weekly.click();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const DisabledItem: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
      <ToggleGroupItem value="weekly" disabled>
        Weekly
      </ToggleGroupItem>
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Daily' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Monthly' })).toHaveFocus();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const daily = canvas.getByRole('button', { name: 'Daily' });
    const weekly = canvas.getByRole('button', { name: 'Weekly' });
    const monthly = canvas.getByRole('button', { name: 'Monthly' });
    await userEvent.tab();
    await expect(daily).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(weekly).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(monthly).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(monthly).toHaveAttribute('aria-pressed', 'true');
    await expect(daily).toHaveAttribute('aria-pressed', 'false');
    await userEvent.keyboard('{Home}');
    await expect(daily).toHaveFocus();
  },
};
