import { TrashIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogActionProps,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';

const onConfirm = fn();

function DeleteProjectDialog({
  media = true,
  action = { tone: 'critical' },
}: {
  media?: boolean;
  action?: Pick<AlertDialogActionProps, 'tone' | 'loading'>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="soft" tone="critical" />}>
        Delete project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {media ? (
            <AlertDialogMedia>
              <TrashIcon aria-hidden />
            </AlertDialogMedia>
          ) : null}
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the project and its history. You cannot undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            {...action}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const usage = `
A modal that asks the user to confirm an action before it runs. Use it for an action that deletes or that you cannot undo. For the full confirm flow, with a pending state and an error message, use the \`ConfirmDialog\` block. For a form, use \`Dialog\`.

\`AlertDialogAction\` and \`AlertDialogCancel\` are buttons. They take the \`Button\` props, not \`className\`.

## AlertDialogAction tone: what the action does

| Value | Use it for |
| --- | --- |
| \`brand\` | The default. An action that is safe to repeat or to undo: publish, restore a version, leave. |
| \`critical\` | An action that deletes or cannot be undone. It gives a solid red button, the one place a \`solid critical\` button belongs. |

\`AlertDialogAction\` also takes \`variant\`, \`size\`, \`icon\` and \`loading\` from \`Button\`. The default is \`variant="solid"\`. Set \`loading\` while the action runs: the button keeps focus and ignores clicks.

## AlertDialogCancel

The way out of every alert dialog. It is an \`outline\` button by default, and takes \`variant\` and \`size\` from \`Button\`. It has no \`tone\`.

## Other parts

- \`AlertDialogTrigger\` takes \`render\`: \`<AlertDialogTrigger render={<Button tone="critical">Delete</Button>} />\`.
- \`AlertDialogMedia\`: an icon above the title, for the most serious actions. On a wide screen it sits to the left of the text.

## Do not

- Do not change the radius, padding or title size of the content. Every alert dialog has one look.
- Do not style the action from outside. Choose \`tone\` and \`variant\`.
- Do not add a close icon in the corner. \`AlertDialogCancel\` is the way out.
- Do not put a form in an alert dialog. Use \`Dialog\`.
- Do not use an alert dialog for a message with one button. Use \`Alert\` or a toast.
`;

const meta = {
  title: 'Components/Alert Dialog',
  parameters: { docs: { description: { component: usage } } },
  component: AlertDialog,
  beforeEach: () => {
    onConfirm.mockClear();
  },
  render: () => <DeleteProjectDialog />,
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this project?' });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).toHaveAccessibleDescription(
      'This removes the project and its history. You cannot undo this action.',
    );
    const action = within(dialog).getByRole('button', { name: 'Delete' });
    await expect(action).toHaveClass('bg-destructive', 'text-destructive-foreground');
    await userEvent.click(action);
    await expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Cancel: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this project?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this project?' });
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onConfirm).not.toHaveBeenCalled();
  },
};

export const BrandAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Without a `tone`, the action is `solid brand`. Use it when the action is safe, such as publish or restore. Leave out `AlertDialogMedia` for an everyday question.',
      },
    },
  },
  render: () => <DeleteProjectDialog media={false} action={{}} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this project?' });
    await expect(within(dialog).getByRole('button', { name: 'Delete' })).toHaveClass('bg-primary');
    await expect(dialog.querySelector('[data-slot="alert-dialog-media"]')).toBeNull();
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`loading` on the action shows a spinner, keeps focus on the button and blocks a second click.',
      },
    },
  },
  render: () => <DeleteProjectDialog action={{ tone: 'critical', loading: true }} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this project?' });
    const action = within(dialog).getByRole('button', { name: 'Delete' });
    await expect(action).toHaveAttribute('aria-busy', 'true');
    await expect(action).toHaveAttribute('aria-disabled', 'true');
    action.click();
    await expect(onConfirm).not.toHaveBeenCalled();
  },
};
