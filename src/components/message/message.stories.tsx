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
} from './message';

const meta = {
  title: 'Components/Message',
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
          <Bubble variant="secondary" align={args.align}>
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
            <Bubble variant="secondary">
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
            <Bubble variant="secondary">
              <BubbleContent>It failed twice this morning.</BubbleContent>
            </Bubble>
            <MessageFooter>09:40</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
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

export const LongContent: Story = {
  render: (args) => (
    <div className="w-80">
      <Message {...args}>
        <MessageContent>
          <MessageHeader>Build bot</MessageHeader>
          <Bubble variant="muted">
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
