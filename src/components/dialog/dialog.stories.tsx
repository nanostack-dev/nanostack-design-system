import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const onSave = fn();

const meta = {
  title: 'Components/Dialog',
  parameters: {
    docs: {
      description: {
        component:
          'A modal window for a task that needs the full attention of the user. Use it for short forms and details. For a confirm step, use `AlertDialog` or the `ConfirmDialog` block.',
      },
    },
  },
  component: Dialog,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onSave.mockClear();
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Rename project</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>The new name shows in the sidebar and in links.</DialogDescription>
        </DialogHeader>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Project name
          <input
            defaultValue="Billing API"
            className="h-9 rounded-2xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="solid" tone="brand" onClick={onSave} />}>
            Save
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Rename project' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Rename project' });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).toHaveAccessibleDescription(
      'The new name shows in the sidebar and in links.',
    );
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));
    await expect(onSave).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Rename project' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Rename project' });
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onSave).not.toHaveBeenCalled();
  },
};

export const CloseButton: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Rename project' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Rename project' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const LongContent: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Read terms</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Read the terms before you continue.</DialogDescription>
        </DialogHeader>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            Section {index + 1}. The service stores workspace data in the region that the owner
            selects. An owner can export or delete the data at any time from the settings page.
          </p>
        ))}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Terms of service' });
    await waitFor(() =>
      expect(dialog.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight),
    );
    await expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight);
  },
};
