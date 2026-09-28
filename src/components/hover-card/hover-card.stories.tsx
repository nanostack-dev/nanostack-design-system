import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

const meta = {
  title: 'Components/Hover Card',
  component: HoverCard,
  args: { onOpenChange: fn() },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger
        href="#profile"
        delay={0}
        closeDelay={0}
        className="text-sm font-medium underline underline-offset-4"
      >
        Ada Lovelace
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-1">
          <p className="font-medium">Ada Lovelace</p>
          <p className="text-muted-foreground">Maintains the billing service. Joined in 2021.</p>
        </div>
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
  args: { defaultOpen: true },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger href="#team" className="text-sm font-medium underline">
        Platform team
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start">
        <p>Six people who own the deploy pipeline.</p>
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
