import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import { Toaster, toast } from './toast';

const onUndo = fn();

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  beforeEach: () => {
    onUndo.mockClear();
    return () => toast.close();
  },
  render: (args) => (
    <Toaster {...args}>
      <Button
        onClick={() =>
          toast.add({
            title: 'Changes saved',
            description: 'Your profile is up to date.',
          })
        }
      >
        Save changes
      </Button>
    </Toaster>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    const notification = await screen.findByRole('dialog', { name: 'Changes saved' });
    await waitFor(() => expect(notification).toBeVisible());
    await expect(within(notification).getByText('Your profile is up to date.')).toBeVisible();
    await userEvent.hover(notification);
    const close = await within(notification).findByRole('button', { name: 'Close toast' });
    await userEvent.click(close);
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Changes saved' })).not.toBeInTheDocument(),
    );
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Save changes' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const notification = await screen.findByRole('dialog', { name: 'Changes saved' });
    await userEvent.tab();
    await waitFor(() => expect(notification).toHaveFocus());
    await userEvent.tab();
    await waitFor(() =>
      expect(within(notification).getByRole('button', { name: 'Close toast' })).toHaveFocus(),
    );
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Changes saved' })).not.toBeInTheDocument(),
    );
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Toaster {...args}>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Project archived',
            description: 'You can restore it for 30 days.',
            type: 'success',
            actionProps: { children: 'Undo', onClick: onUndo },
          })
        }
      >
        Archive project
      </Button>
    </Toaster>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Archive project' }));
    const notification = await screen.findByRole('dialog', { name: 'Project archived' });
    await waitFor(() => expect(notification).toBeVisible());
    await userEvent.click(within(notification).getByRole('button', { name: 'Undo' }));
    await expect(onUndo).toHaveBeenCalledOnce();
  },
};

export const Stacked: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Save changes' });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getAllByRole('dialog', { name: 'Changes saved' })).toHaveLength(3),
    );
    const viewport = screen.getByRole('region');
    await expect(viewport.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
  },
};
