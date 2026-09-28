import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/hover-card';
import { Text } from '@/components/text';
import { TextLink } from '@/components/text-link';
import { Stack } from '@/layout/stack';

const usage = `
A card that opens when the pointer rests on a link or a token. Use it for a preview: a person, a page, the value of a variable. For a short label, use \`Tooltip\`. For content the user must act on, use \`Popover\`.

The parts are closed. \`HoverCardContent\` does not accept \`className\` or \`style\`. It is 288 px wide.

## side: where the card opens

| Value | Use it for |
| --- | --- |
| \`bottom\` | The default. A link in running text. |
| \`top\` | A link near the bottom of the screen. |
| \`right\` or \`left\` | A link in a list or a table column, so the card does not cover the next rows. |

## align: which edge lines up with the trigger

| Value | Use it for |
| --- | --- |
| \`center\` | The default. |
| \`start\` or \`end\` | A trigger near the edge of its container. |

## Other props

- \`HoverCardTrigger\` renders a link. Pass \`render\` to use another element, such as \`TextLink\` or a highlighted token.
- \`delay\` and \`closeDelay\` on \`HoverCardTrigger\`: how long the pointer must stay before the card opens and after it leaves.

## Do not

- Do not put the only copy of important content in a hover card. Touch screens and many keyboard users do not see it.
- Do not put buttons or form fields in it. Use \`Popover\`.
- Do not set a width, a border or a radius on the content.
`;

const meta = {
  title: 'Components/Hover Card',
  parameters: { docs: { description: { component: usage } } },
  component: HoverCard,
  args: { onOpenChange: fn() },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger
        delay={0}
        closeDelay={0}
        render={<TextLink href="#profile">Ada Lovelace</TextLink>}
      />
      <HoverCardContent>
        <Stack space="xs">
          <Text weight="medium">Ada Lovelace</Text>
          <Text tone="muted">Maintains the billing service. Joined in 2021.</Text>
        </Stack>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const summary = 'Maintains the billing service. Joined in 2021.';

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('link', { name: 'Ada Lovelace' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByText(summary)).toBeVisible());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.unhover(trigger);
    await userEvent.hover(document.body);
    await waitFor(() => expect(screen.queryByText(summary)).not.toBeInTheDocument());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('link', { name: 'Ada Lovelace' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(screen.getByText(summary)).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText(summary)).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Placement: Story = {
  parameters: {
    docs: {
      description: {
        story: '`side="right"` and `align="start"`: the card opens beside a link in a list.',
      },
    },
  },
  args: { defaultOpen: true },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger render={<TextLink href="#team">Platform team</TextLink>} />
      <HoverCardContent side="right" align="start">
        <Text>Six people who own the deploy pipeline.</Text>
      </HoverCardContent>
    </HoverCard>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('link', { name: 'Platform team' });
    const card = await screen.findByText('Six people who own the deploy pipeline.');
    await waitFor(() =>
      expect(card.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().right,
      ),
    );
  },
};
