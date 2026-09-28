import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';

import { Bubble, BubbleContent } from '@/components/bubble';
import { Button } from '@/components/button';
import { Marker, MarkerContent } from '@/components/marker';
import { Message, MessageContent } from '@/components/message';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from './message-scroller';

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

const transcript: ChatMessage[] = Array.from({ length: 12 }, (_, index) => ({
  id: `message-${index + 1}`,
  role: index % 2 === 0 ? 'user' : 'assistant',
  text:
    index % 2 === 0
      ? `Question ${index / 2 + 1}: what changed in the last deploy?`
      : `Answer ${(index + 1) / 2}: the cache key moved to the new build hash, so the first request after the deploy rebuilt the cache.`,
}));

function Transcript({ messages }: { messages: ChatMessage[] }) {
  return (
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent className="p-4">
          <MessageScrollerItem>
            <Marker variant="separator">
              <MarkerContent>Today</MarkerContent>
            </Marker>
          </MessageScrollerItem>
          {messages.map((message) => (
            <MessageScrollerItem
              key={message.id}
              messageId={message.id}
              scrollAnchor={message.role === 'user'}
            >
              <Message align={message.role === 'user' ? 'end' : 'start'}>
                <MessageContent>
                  <Bubble
                    variant={message.role === 'user' ? 'default' : 'secondary'}
                    align={message.role === 'user' ? 'end' : 'start'}
                  >
                    <BubbleContent>{message.text}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  );
}

const meta = {
  title: 'Components/Message Scroller',
  parameters: {
    docs: {
      description: {
        component:
          'The scroll container of a conversation. It follows new messages and shows a button to go back to the latest one. Use it for chat and for streaming output.',
      },
    },
  },
  component: MessageScrollerProvider,
  args: { children: null },
  render: (args) => (
    <div className="h-96 w-md rounded-xl border">
      <MessageScrollerProvider {...args}>
        <Transcript messages={transcript} />
      </MessageScrollerProvider>
    </div>
  ),
} satisfies Meta<typeof MessageScrollerProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Conversation: Story = {
  play: async ({ canvas }) => {
    const log = canvas.getByRole('log');
    await expect(canvas.getByRole('region', { name: 'Messages' })).toContainElement(log);
    await expect(canvas.getByText('Today')).toBeInTheDocument();
    await expect(canvas.getByText(/Question 1:/)).toBeVisible();
  },
};

function isAtEnd(viewport: HTMLElement) {
  return viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2;
}

export const JumpToLatest: Story = {
  args: { defaultScrollPosition: 'end' },
  play: async ({ canvas, userEvent }) => {
    const viewport = canvas.getByRole('region', { name: 'Messages' });
    await waitFor(() => expect(isAtEnd(viewport)).toBe(true));
    const jump = canvas.getByRole('button', { name: 'Scroll to end', hidden: true });
    await expect(jump).toHaveAttribute('data-active', 'false');
    viewport.dispatchEvent(new WheelEvent('wheel', { deltaY: -2000, bubbles: true }));
    viewport.scrollTop = 0;
    await waitFor(() => expect(jump).toHaveAttribute('data-active', 'true'));
    await expect(jump).not.toHaveAttribute('inert');
    await userEvent.click(jump);
    await waitFor(() => expect(isAtEnd(viewport)).toBe(true));
    await waitFor(() => expect(jump).toHaveAttribute('data-active', 'false'));
  },
};

export const OpensAtEnd: Story = {
  args: { defaultScrollPosition: 'end' },
  play: async ({ canvas }) => {
    const viewport = canvas.getByRole('region', { name: 'Messages' });
    await waitFor(() => expect(isAtEnd(viewport)).toBe(true));
    await expect(canvas.getByText(/Answer 6:/)).toBeVisible();
  },
};

function LiveConversation() {
  const [messages, setMessages] = useState(transcript.slice(0, 4));
  return (
    <div className="flex h-96 w-md flex-col gap-2">
      <div className="min-h-0 flex-1 rounded-xl border">
        <MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <Transcript messages={messages} />
        </MessageScrollerProvider>
      </div>
      <Button
        variant="solid"
        tone="brand"
        onClick={() =>
          setMessages((current) => [
            ...current,
            ...transcript.slice(current.length, current.length + 2),
          ])
        }
      >
        Receive reply
      </Button>
    </div>
  );
}

export const FollowsNewMessages: Story = {
  render: () => <LiveConversation />,
  play: async ({ canvas, userEvent }) => {
    const viewport = canvas.getByRole('region', { name: 'Messages' });
    const receive = canvas.getByRole('button', { name: 'Receive reply' });
    for (let turn = 0; turn < 4; turn += 1) {
      await userEvent.click(receive);
    }
    await expect(await canvas.findByText(/Answer 6:/)).toBeInTheDocument();
    await waitFor(() => expect(isAtEnd(viewport)).toBe(true));
  },
};
