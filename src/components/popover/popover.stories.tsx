import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

const onCopy = fn();

const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onCopy.mockClear();
  },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>Share</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Share this page</PopoverTitle>
          <PopoverDescription>Anyone with the link can view the page.</PopoverDescription>
        </PopoverHeader>
        <Button onClick={onCopy}>Copy link</Button>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Share' });
    await userEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'Share this page' });
    await waitFor(() => expect(popover).toBeVisible());
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(within(popover).getByRole('button', { name: 'Copy link' }));
    await expect(onCopy).toHaveBeenCalledOnce();
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Share' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const popover = await screen.findByRole('dialog', { name: 'Share this page' });
    await waitFor(() =>
      expect(within(popover).getByRole('button', { name: 'Copy link' })).toHaveFocus(),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Placement: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>Details</PopoverTrigger>
      <PopoverContent side="right" align="start">
        <PopoverHeader>
          <PopoverTitle>Details</PopoverTitle>
          <PopoverDescription>The panel opens to the right of the trigger.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Details' });
    await userEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'Details' });
    await waitFor(() =>
      expect(popover.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().right,
      ),
    );
  },
};
