import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Badge } from '@/components/badge';
import {
  Bubble,
  BubbleButton,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  type BubbleTone,
  type BubbleVariant,
} from '@/components/bubble';
import { Stack } from '@/layout/stack';

const variants: BubbleVariant[] = ['solid', 'soft', 'outline', 'ghost'];
const tones: BubbleTone[] = ['neutral', 'brand', 'critical'];

const onRetry = fn();

const usage = `
A chat bubble for one message. Use it inside \`Message\`, in a \`MessageScroller\`. For a status on a page, use \`Alert\`. For a note between messages, such as a date, use \`Marker\`.

The props are the whole API. No part accepts \`className\` or \`style\`.

## variant: how much the bubble stands out

| Value | Use it for |
| --- | --- |
| \`solid\` | The messages of the person who reads the screen, with \`tone="brand"\`. |
| \`soft\` | The default. Messages from other people or from an assistant. |
| \`outline\` | Output that is not a message: a tool result, a quoted request, a system note with content. |
| \`ghost\` | Long assistant answers that read as a document, with no bubble around them. |

## tone: what the bubble means

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. Any message. |
| \`brand\` | Your own messages. Use it with \`solid\`, or with \`soft\` for a quieter look. |
| \`critical\` | A message that failed to send, or an error from an assistant. Use it with \`soft\`. |

## Other props and parts

- \`align\`: \`end\` puts the bubble on the right. Use it for your own messages, and set \`align="end"\` on \`Message\` too.
- \`BubbleButton\`: a bubble that is a button, for example "Message failed. Tap to retry." It takes the look of its \`Bubble\`.
- \`BubbleReactions\`: a pill over the edge of the bubble, for emoji reactions. \`side\` and \`align\` place it.
- \`BubbleGroup\`: stacks the bubbles of one author with a small gap.

## Do not

- Do not use \`solid brand\` for messages from other people. Readers use the colour to find their own messages.
- Do not use \`critical\` for a message that talks about an error. Use it only when the message itself failed.
- Do not put a \`Card\` in a bubble. Use \`outline\` for structured output.
`;

const meta = {
  title: 'Components/Bubble',
  parameters: { docs: { description: { component: usage } } },
  component: Bubble,
  args: { variant: 'soft', tone: 'neutral', align: 'start' },
  argTypes: {
    variant: { control: 'select', options: variants },
    tone: { control: 'select', options: tones },
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
    const content = canvas.getByText('Deploy finished in 42 seconds.');
    await expect(content).toBeVisible();
    await expect(content.closest('[data-slot="bubble"]')).toHaveAttribute('data-variant', 'soft');
  },
};

export const VariantsAndTones: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Every `variant` with every `tone`. Rows are tones, columns are variants.',
      },
    },
  },
  render: (args) => (
    <div className="w-2xl">
      <Stack space="md">
        {tones.map((tone) => (
          <div key={tone} className="grid grid-cols-4 gap-3">
            {variants.map((variant) => (
              <Bubble key={variant} {...args} variant={variant} tone={tone}>
                <BubbleContent>{`${variant} ${tone}`}</BubbleContent>
              </Bubble>
            ))}
          </div>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const background = (name: string) => getComputedStyle(canvas.getByText(name)).backgroundColor;
    for (const tone of tones) {
      for (const variant of variants) {
        await expect(canvas.getByText(`${variant} ${tone}`)).toBeVisible();
      }
    }
    await expect(background('solid brand')).not.toBe(background('soft neutral'));
    await expect(background('soft critical')).not.toBe(background('soft neutral'));
    await expect(background('ghost neutral')).toBe('rgba(0, 0, 0, 0)');
  },
};

export const Conversation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Your own messages use `solid brand` and `align="end"`. Other messages stay `soft`.',
      },
    },
  },
  render: () => (
    <div className="flex w-md flex-col gap-3">
      <Bubble>
        <BubbleContent>Can you check the staging deploy?</BubbleContent>
      </Bubble>
      <Bubble variant="solid" tone="brand" align="end">
        <BubbleContent>On it. The cache key changed.</BubbleContent>
      </Bubble>
    </div>
  ),
  play: async ({ canvas }) => {
    const incoming = canvas.getByText('Can you check the staging deploy?');
    const outgoing = canvas.getByText('On it. The cache key changed.');
    await expect(outgoing.getBoundingClientRect().right).toBeGreaterThan(
      incoming.getBoundingClientRect().right,
    );
  },
};

export const Group: Story = {
  args: { align: 'end', variant: 'solid', tone: 'brand' },
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
  render: (args) => (
    <div className="flex w-md flex-col pb-6">
      <Bubble {...args}>
        <BubbleContent>Shipped the fix to production.</BubbleContent>
        <BubbleReactions>
          <Badge aria-label="2 people reacted with thumbs up">👍 2</Badge>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('2 people reacted with thumbs up')).toBeVisible();
  },
};

export const FailedMessage: Story = {
  args: { variant: 'soft', tone: 'critical', align: 'end' },
  parameters: {
    docs: {
      description: {
        story:
          '`BubbleButton` makes the whole bubble a button. A message that failed to send uses `soft critical`, with text on `--destructive-on-tint` for AA contrast.',
      },
    },
  },
  beforeEach: () => onRetry.mockClear(),
  render: (args) => (
    <div className="flex w-md flex-col">
      <Bubble {...args}>
        <BubbleButton onClick={onRetry}>Message failed. Tap to retry.</BubbleButton>
      </Bubble>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Message failed. Tap to retry.' });
    await expect(button).toHaveClass('text-destructive-on-tint');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const LongContent: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col">
      <Bubble {...args}>
        <BubbleContent>
          https://ci.example.com/pipelines/1234567890/jobs/0987654321/artifacts/download/report.json
        </BubbleContent>
      </Bubble>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bubble = canvasElement.querySelector<HTMLElement>('[data-slot="bubble-content"]')!;
    await expect(bubble.scrollWidth).toBeLessThanOrEqual(bubble.clientWidth);
  },
};
