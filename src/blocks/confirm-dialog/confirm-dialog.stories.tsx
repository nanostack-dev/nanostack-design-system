import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import { ConfirmDialog } from './confirm-dialog';

const usage = `
A confirm step for an action, with a pending state while the action runs and an error message when it fails. Use it before delete, archive and other actions that are hard to undo. For a question with more than two answers, or a form, use \`Dialog\`.

The block is closed. It does not accept \`className\` or \`style\`. The look comes from \`tone\`.

## tone: what the action does

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. A safe action that still needs a pause: archive, publish, restore. The confirm button is \`solid brand\`, and the dialog has no icon. |
| \`critical\` | An action that deletes data or cannot be undone. The dialog shows a warning icon and the confirm button is \`solid critical\`. |

## Other props

- \`trigger\`: the element that opens the dialog. Leave it out, and pass \`open\` and \`onOpenChange\`, when a menu item or a row action opens the dialog.
- \`onConfirm\`: can return a promise. The confirm button shows a spinner until it settles. A rejected promise keeps the dialog open and shows the error message.
- \`confirmLabel\` and \`cancelLabel\`: say what happens, for example "Delete flow", not "OK".

## Do not

- Do not use \`critical\` for an action that the person can undo in one step.
- Do not close the dialog yourself in \`onConfirm\`. The block closes it when the promise resolves.
- Do not put a form or a second action in the dialog. Use \`Dialog\`.
`;

const meta = {
  title: 'Blocks/Confirm Dialog',
  parameters: {
    docs: { description: { component: usage } },
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
    await expect(dialog).toHaveAttribute('data-tone', 'neutral');
    await expect(dialog.querySelector('[data-slot="alert-dialog-media"]')).toBeNull();
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

export const Critical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`tone="critical"` adds the warning icon and makes the confirm button `solid critical`.',
      },
    },
  },
  args: {
    trigger: (
      <Button variant="soft" tone="critical">
        Delete project
      </Button>
    ),
    title: 'Delete this project?',
    description: 'This removes the project and its history. You cannot undo this action.',
    confirmLabel: 'Delete',
    tone: 'critical',
  },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    const dialog = await openDialog(trigger, userEvent, 'Delete this project?');
    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    await expect(confirm).toHaveClass('bg-destructive', 'text-destructive-foreground');
    await expect(dialog).toHaveAttribute('data-tone', 'critical');
    await expect(dialog.querySelector('[data-slot="alert-dialog-media"] svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
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
    await expect(confirm.querySelector('svg.animate-spin')).toBeInTheDocument();
    await expect(cancel).toBeDisabled();

    confirm.click();
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

export const WithoutTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A row menu opens the dialog: no `trigger`, and the page owns `open`. The dialog closes through `onOpenChange` after the action resolves.',
      },
    },
  },
  args: {
    trigger: undefined,
    tone: 'critical',
    title: 'Delete this flow?',
    confirmLabel: 'Delete flow',
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open from a menu
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Open from a menu' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this flow?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete flow' }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};

export const Dark: Story = {
  args: {
    tone: 'critical',
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
