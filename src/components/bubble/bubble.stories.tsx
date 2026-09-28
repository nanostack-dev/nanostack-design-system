import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Badge } from '@/components/badge';

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions, type BubbleVariant } from './bubble';

const variants: BubbleVariant[] = [
  'default',
  'secondary',
  'muted',
  'tinted',
  'outline',
  'ghost',
  'destructive',
];

const meta = {
  title: 'Components/Bubble',
  component: Bubble,
  args: { variant: 'default', align: 'start' },
  argTypes: {
    variant: { control: 'select', options: variants },
    align: { control: 'inline-radio', options: ['start', 'end'] },
  },
  render: (args) => (
    <div className="flex w-md flex-col">
      <Bubble {...args}>
        <BubbleContent>Deploy finished in 42 seconds.</BubbleContent>
      </Bubble>
    </div>
  ),
} satisfies Meta<typeof Bubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Deploy finished in 42 seconds.')).toBeVisible();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-md flex-col gap-3">
      {variants.map((variant) => (
        <Bubble key={variant} {...args} variant={variant}>
          <BubbleContent>{variant}</BubbleContent>
        </Bubble>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const background = (name: string) => getComputedStyle(canvas.getByText(name)).backgroundColor;
    for (const variant of variants) {
      await expect(canvas.getByText(variant)).toBeVisible();
    }
    await expect(background('default')).not.toBe(background('muted'));
    await expect(background('destructive')).not.toBe(background('default'));
  },
};

export const Group: Story = {
  args: { align: 'end' },
  render: (args) => (
    <div className="flex w-md flex-col">
      <BubbleGroup>
        <Bubble {...args}>
          <BubbleContent>First line of a stacked reply.</BubbleContent>
        </Bubble>
        <Bubble {...args}>
          <BubbleContent>Second line.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const first = canvas.getByText('First line of a stacked reply.').getBoundingClientRect();
    const second = canvas.getByText('Second line.').getBoundingClientRect();
    await expect(second.top).toBeGreaterThan(first.bottom - 1);
    await expect(Math.round(second.right)).toBe(Math.round(first.right));
  },
};

export const WithReactions: Story = {
  args: { variant: 'secondary' },
  render: (args) => (
    <div className="flex w-md flex-col pb-6">
      <Bubble {...args}>
        <BubbleContent>Shipped the fix to production.</BubbleContent>
        <BubbleReactions>
          <Badge variant="secondary" aria-label="2 people reacted with thumbs up">
            👍 2
          </Badge>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('2 people reacted with thumbs up')).toBeVisible();
  },
};

export const AsButton: Story = {
  args: { variant: 'outline' },
  render: (args) => {
    const onRetry = fn();
    return (
      <div className="flex w-md flex-col">
        <Bubble {...args}>
          <BubbleContent render={<button type="button" onClick={onRetry} />}>
            Message failed. Tap to retry.
          </BubbleContent>
        </Bubble>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Message failed. Tap to retry.' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
};
