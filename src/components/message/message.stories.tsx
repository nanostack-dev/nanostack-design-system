import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Bubble, BubbleContent } from '@/components/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from '@/components/message';

const usage = `
One row of a conversation: an avatar, a name, the content and a time. Use it with \`Bubble\` for the content and \`MessageScroller\` for the list. For a note between messages, use \`Marker\`.

The props are the whole API. No part accepts \`className\` or \`style\`.

## align: who wrote the message

| Value | Use it for |
| --- | --- |
| \`start\` | The default. Messages from other people or from an assistant. |
| \`end\` | Messages from the person who reads the screen. Set \`align="end"\` on the \`Bubble\` too. |

## Parts

- \`MessageAvatar\`: holds an \`Avatar\`. It stays at the bottom of the row, next to the last bubble.
- \`MessageHeader\`: the author name, above the content.
- \`MessageFooter\`: the time or the delivery state, below the content.
- \`MessageGroup\`: several messages from one author in a row, with a small gap.

## Do not

- Do not repeat the avatar and the name on every message of a group. Show them once.
- Do not put actions in \`MessageHeader\`. Put them in the footer or in a menu.
`;

const meta = {
  title: 'Components/Message',
  parameters: { docs: { description: { component: usage } } },
  component: Message,
  args: { align: 'start' },
  argTypes: { align: { control: 'inline-radio', options: ['start', 'end'] } },
  render: (args) => (
    <div className="w-md">
      <Message {...args}>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Ada Lovelace</MessageHeader>
          <Bubble align={args.align}>
            <BubbleContent>The build finished on the second try.</BubbleContent>
          </Bubble>
          <MessageFooter>09:42</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ada Lovelace')).toBeVisible();
    await expect(canvas.getByText('The build finished on the second try.')).toBeVisible();
    await expect(canvas.getByText('09:42')).toBeVisible();
  },
};

export const Conversation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Other people use `align="start"` and a `soft` bubble. Your own messages use `align="end"` and a `solid brand` bubble.',
      },
    },
  },
  render: () => (
    <div className="flex w-md flex-col gap-6">
      <MessageGroup>
        <Message align="start">
          <MessageAvatar>
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Ada Lovelace</MessageHeader>
            <Bubble>
              <BubbleContent>Can you check the staging deploy?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="start">
          <MessageAvatar>
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>It failed twice this morning.</BubbleContent>
            </Bubble>
            <MessageFooter>09:40</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
      <Message align="end">
        <MessageContent>
          <Bubble variant="solid" tone="brand" align="end">
            <BubbleContent>On it. The cache key changed, so I cleared it.</BubbleContent>
          </Bubble>
          <MessageFooter>09:41</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
  play: async ({ canvas }) => {
    const incoming = canvas.getByText('Can you check the staging deploy?');
    const outgoing = canvas.getByText('On it. The cache key changed, so I cleared it.');
    await expect(incoming).toBeVisible();
    await expect(outgoing).toBeVisible();
    await expect(outgoing.getBoundingClientRect().right).toBeGreaterThan(
      incoming.getBoundingClientRect().right,
    );
    await expect(outgoing.closest('[data-slot="message"]')).toHaveAttribute('data-align', 'end');
  },
};

export const GhostAnswer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With a `ghost` bubble, the header and the footer drop their inset, so the text lines up.',
      },
    },
  },
  render: () => (
    <div className="w-md">
      <Message>
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="ghost">
            <BubbleContent>
              The deploy failed because the cache key used the old build hash. Clear the cache and
              run the pipeline again.
            </BubbleContent>
          </Bubble>
          <MessageFooter>09:43</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
  play: async ({ canvas }) => {
    const header = canvas.getByText('Assistant').getBoundingClientRect();
    const text = canvas.getByText(/The deploy failed/).getBoundingClientRect();
    await expect(Math.abs(header.left - text.left)).toBeLessThan(1);
  },
};

export const LongContent: Story = {
  render: (args) => (
    <div className="w-80">
      <Message {...args}>
        <MessageContent>
          <MessageHeader>Build bot</MessageHeader>
          <Bubble>
            <BubbleContent>
              https://ci.example.com/pipelines/1234567890/jobs/0987654321/artifacts/download/report-with-a-very-long-name.json
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const message = canvasElement.querySelector<HTMLElement>('[data-slot="message"]')!;
    await expect(message.scrollWidth).toBeLessThanOrEqual(message.clientWidth);
  },
};
