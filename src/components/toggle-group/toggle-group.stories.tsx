import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupSize,
  type ToggleGroupVariant,
} from '@/components/toggle-group';
import { Stack } from '@/layout/stack';

const variants: ToggleGroupVariant[] = ['ghost', 'outline'];
const sizes: ToggleGroupSize[] = ['sm', 'md', 'lg'];

const usage = `
A set of toggle buttons for one or many choices. Use it for two to seven short options that people switch often, such as a view mode, a time range, or text alignment. For a choice in a form, use \`RadioGroup\`. For one option that is on or off, use \`Toggle\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. The group sets \`variant\` and \`size\` for every item, so the items always match. The names are the ones of \`Button\` and \`Toggle\`.

## variant

| Value | Use it for |
| --- | --- |
| \`ghost\` | The default. Separate items with a gap, in a toolbar next to \`ghost\` buttons. |
| \`outline\` | A segmented control: the items touch and share one border. Use it for a view mode or a time range above a list or a chart. |

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense toolbar or a panel header. It lines up with a \`sm\` button. |
| \`md\` | 36 px | The default. It lines up with a \`md\` button. |
| \`lg\` | 40 px | Next to \`lg\` buttons. |

## Other props

- \`value\`, \`defaultValue\` and \`onValueChange\` use an array of item values. Set \`multiple\` to let people press more than one item.
- \`orientation="vertical"\` stacks the items. The arrow keys follow the orientation.
- Name the group with \`aria-label\`. An icon-only item needs an \`aria-label\` too.

## Do not

- Do not use a toggle group for more than seven options. Use \`Select\`.
- Do not use a toggle group to start actions. Use \`Button\` in a \`ButtonGroup\`.
- Do not mix sizes or variants in one group. The group sets them.
`;

const meta = {
  title: 'Components/Toggle Group',
  parameters: { docs: { description: { component: usage } } },
  component: ToggleGroup,
  args: { 'aria-label': 'Frequency', defaultValue: ['daily'], onValueChange: fn() },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
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
  parameters: {
    docs: {
      description: {
        story: '`outline` makes a segmented control: the items touch and share one border.',
      },
    },
  },
  args: { variant: 'outline' },
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

export const Sizes: Story = {
  render: (args) => (
    <Stack space="sm" align="start">
      {sizes.map((size) => (
        <ToggleGroup key={size} {...args} aria-label={`Frequency ${size}`} size={size}>
          <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
          <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) =>
        canvas
          .getByRole('group', { name: `Frequency ${size}` })
          .querySelector('button')
          ?.getBoundingClientRect().height,
    );
    await expect(heights).toEqual([32, 36, 40]);
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
