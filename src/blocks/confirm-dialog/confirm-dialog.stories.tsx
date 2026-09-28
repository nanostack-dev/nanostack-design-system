import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import { ConfirmDialog } from './confirm-dialog';

const meta = {
  title: 'Blocks/Confirm Dialog',
  parameters: {
    docs: {
      description: {
        component:
          'A confirm step for an action, with a pending state while the action runs and an error message when it fails. Use it for delete, archive and other actions that you cannot undo.',
      },
    },
  },
  component: ConfirmDialog,
  args: {
    trigger: <Button variant="outline">Archive project</Button>,
    title: 'Archive this project?',
    description: 'Archived projects are read-only. You can restore them later.',
    confirmLabel: 'Archive',
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

async function openDialog(
  trigger: HTMLElement,
  userEvent: { click: (element: HTMLElement) => Promise<void> },
  name: string,
) {
  await userEvent.click(trigger);
  const dialog = await screen.findByRole('alertdialog', { name });
  await waitFor(() => expect(dialog).toBeVisible());
  return dialog;
}

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    const dialog = await openDialog(trigger, userEvent, 'Archive this project?');
    await expect(dialog).toHaveAccessibleDescription(
      'Archived projects are read-only. You can restore them later.',
    );
    await userEvent.click(within(dialog).getByRole('button', { name: 'Archive' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Cancel: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    const dialog = await openDialog(trigger, userEvent, 'Archive this project?');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(args.onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Escape: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('alertdialog', { name: 'Archive this project?' });
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(args.onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Destructive: Story = {
  args: {
    trigger: (
      <Button variant="soft" tone="critical">
        Delete project
      </Button>
    ),
    title: 'Delete this project?',
    description: 'This removes the project and its history. You cannot undo this action.',
    confirmLabel: 'Delete',
    tone: 'destructive',
  },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    const dialog = await openDialog(trigger, userEvent, 'Delete this project?');
    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    await expect(confirm).toHaveClass('text-destructive-on-tint');
    await userEvent.click(confirm);
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};

let resolvePending: () => void = () => {};

export const AsyncPending: Story = {
  args: {
    onConfirm: fn(
      () =>
        new Promise<void>((resolve) => {
          resolvePending = resolve;
        }),
    ),
  },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    const dialog = await openDialog(trigger, userEvent, 'Archive this project?');
    const confirm = within(dialog).getByRole('button', { name: 'Archive' });
    const cancel = within(dialog).getByRole('button', { name: 'Cancel' });
    await userEvent.click(confirm);

    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(confirm).toHaveAttribute('aria-busy', 'true'));
    await expect(confirm).toHaveAttribute('aria-disabled', 'true');
    await expect(confirm.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
    await expect(cancel).toBeDisabled();

    await userEvent.click(confirm);
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await userEvent.keyboard('{Escape}');
    await expect(screen.getByRole('alertdialog')).toBeVisible();

    resolvePending();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const AsyncError: Story = {
  args: {
    onConfirm: fn(() => Promise.reject(new Error('The archive service did not respond.'))),
  },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    const dialog = await openDialog(trigger, userEvent, 'Archive this project?');
    const confirm = within(dialog).getByRole('button', { name: 'Archive' });
    await userEvent.click(confirm);

    const alert = await within(dialog).findByRole('alert');
    await expect(alert).toHaveTextContent('The archive service did not respond.');
    await expect(screen.getByRole('alertdialog')).toBeVisible();
    await expect(confirm).toHaveAttribute('aria-busy', 'false');
    await expect(confirm).not.toHaveAttribute('aria-disabled', 'true');
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeEnabled();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await userEvent.click(trigger);
    const reopened = await screen.findByRole('alertdialog', { name: 'Archive this project?' });
    await expect(within(reopened).queryByRole('alert')).not.toBeInTheDocument();
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};

export const Dark: Story = {
  args: {
    tone: 'destructive',
    onConfirm: fn(() => Promise.reject(new Error('The archive service did not respond.'))),
  },
  globals: { theme: 'dark' },
  play: async ({ args, canvas, userEvent }) => {
    await expect(document.documentElement).toHaveClass('dark');
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    const dialog = await openDialog(trigger, userEvent, 'Archive this project?');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Archive' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'The archive service did not respond.',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
