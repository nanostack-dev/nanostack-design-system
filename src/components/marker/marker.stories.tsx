import { SignInIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Marker, MarkerContent, type MarkerDivider } from '@/components/marker';
import { Stack } from '@/layout/stack';

const dividers: MarkerDivider[] = ['none', 'sides', 'below'];

const usage = `
A small line of muted text between messages. Use it for an event in a conversation, such as "Sarah joined", or for a date. For a line with no text, use \`Separator\`. For a status that needs attention, use \`Alert\`.

The props are the whole API. No part accepts \`className\` or \`style\`.

## divider: how the marker separates the messages

| Value | Use it for |
| --- | --- |
| \`none\` | The default. An event in the flow of messages: a join, a rename, a moved thread. |
| \`sides\` | A date or a time gap. The text sits in the centre, with a line on each side. |
| \`below\` | The start of a new section, such as "New messages". |

## Other props

- \`icon\`: a Phosphor icon before the text, hidden from screen readers.
- A date goes in a \`<time dateTime>\` inside \`MarkerContent\`.
- A link in \`MarkerContent\` is underlined.

## Do not

- Do not use a marker for a message from a person. Use \`Message\` and \`Bubble\`.
- Do not put a button in a marker. Use a link, or put the action in the message.
`;

const meta = {
  title: 'Components/Marker',
  parameters: { docs: { description: { component: usage } } },
  component: Marker,
  args: { divider: 'none' },
  argTypes: { divider: { control: 'select', options: dividers } },
  render: (args) => (
    <div className="w-md">
      <Marker {...args} icon={SignInIcon}>
        <MarkerContent>Sarah joined the conversation</MarkerContent>
      </Marker>
    </div>
  ),
} satisfies Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Sarah joined the conversation')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="marker-icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  },
};

export const Dividers: Story = {
  render: (args) => (
    <div className="w-md">
      <Stack space="xl">
        {dividers.map((divider) => (
          <Marker key={divider} {...args} divider={divider}>
            <MarkerContent>{divider}</MarkerContent>
          </Marker>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const sides = canvas.getByText('sides');
    const row = sides.closest('[data-slot="marker"]')!;
    const rowBox = row.getBoundingClientRect();
    const labelBox = sides.getBoundingClientRect();
    const leftGap = labelBox.left - rowBox.left;
    const rightGap = rowBox.right - labelBox.right;
    await expect(Math.abs(leftGap - rightGap)).toBeLessThan(2);
    const below = canvas.getByText('below').closest('[data-slot="marker"]')!;
    await expect(getComputedStyle(below).borderBottomWidth).toBe('1px');
  },
};

export const DateDivider: Story = {
  args: { divider: 'sides' },
  parameters: {
    docs: {
      description: { story: 'A date divider puts a `<time>` inside `MarkerContent`.' },
    },
  },
  render: (args) => (
    <div className="w-md">
      <Marker {...args}>
        <MarkerContent>
          <time dateTime="2026-09-27">Today</time>
        </MarkerContent>
      </Marker>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Today').closest('time')).toHaveAttribute(
      'datetime',
      '2026-09-27',
    );
  },
};

export const WithLink: Story = {
  render: (args) => (
    <div className="w-md">
      <Marker {...args}>
        <MarkerContent>
          The thread moved to <a href="#incident-42">incident 42</a>
        </MarkerContent>
      </Marker>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const link = canvas.getByRole('link', { name: 'incident 42' });
    await expect(link).toHaveFocus();
    await expect(getComputedStyle(link).textDecorationLine).toBe('underline');
  },
};
