import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';
import { Inline } from '@/layout/inline';

import { Toaster, toast, type ToastType } from '@/components/toast';

const onUndo = fn();

const types: ToastType[] = ['success', 'error', 'warning', 'info', 'loading'];

const usage = `
A short message at the edge of the screen that closes by itself. Use it to confirm an action or to report a background error. For a message that must stay on the page, use \`Alert\`. For a choice that blocks the flow, use \`AlertDialog\`.

Mount \`Toaster\` once, at the root of the app. It can wrap the app, or sit next to it with no children. Then call \`toast.add()\` from anywhere, even outside React.

\`\`\`tsx
const id = toast.add({ type: 'success', title: 'Flow launched' });
toast.close(id);
\`\`\`

The options are the whole API. There is no \`className\` or \`style\` on a toast or on its action.

## type: what the toast reports

| Value | Use it for |
| --- | --- |
| no type | A neutral note with no icon. |
| \`success\` | An action finished: saved, created, launched. |
| \`error\` | An action failed. Say what failed and what to do next in \`description\`. |
| \`warning\` | An action finished, but with a problem the person should know about. |
| \`info\` | A tip or a state change that the person did not start. |
| \`loading\` | Work in progress. Update the same toast with \`toast.update(id, …)\` or use \`toast.promise()\`. |

The type sets the icon and its tone: \`error\` is critical, \`success\`, \`warning\` and \`info\` use their own tone, and \`loading\` is neutral.

## actionProps: one action

\`actionProps\` takes \`children\`, \`onClick\` and \`disabled\`. The action is an outline, small button. Use it for Undo or View run. Close the toast in \`onClick\` when the action navigates.

## Do not

- Do not put a form or a long text in a toast.
- Do not use a toast for an error the person must fix in a field. Show it next to the field.
- Do not mount a second \`Toaster\`. Every \`toast.add()\` goes to the same list.
- Do not use \`error\` for a cancelled action. Nothing failed.
`;

const meta = {
  title: 'Components/Toast',
  parameters: { docs: { description: { component: usage } } },
  component: Toaster,
  beforeEach: () => {
    onUndo.mockClear();
    return () => toast.close();
  },
  render: (args) => (
    <Toaster {...args}>
      <Button
        variant="solid"
        tone="brand"
        onClick={() =>
          toast.add({
            type: 'success',
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
  args: { timeout: 0 },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    const notification = await screen.findByRole('dialog', { name: 'Changes saved' });
    await waitFor(() => expect(notification).toBeVisible());
    await waitFor(() =>
      expect(within(notification).getByText('Your profile is up to date.')).toBeVisible(),
    );
    await userEvent.hover(notification);
    const close = await within(notification).findByRole('button', { name: 'Close toast' });
    await userEvent.click(close);
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Changes saved' })).not.toBeInTheDocument(),
    );
  },
};

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Each `type` sets its icon and tone. The toasts stack, and a hover spreads them.',
      },
    },
  },
  render: (args) => (
    <Toaster {...args}>
      <Inline space="sm">
        {types.map((type) => (
          <Button
            key={type}
            onClick={() =>
              toast.add({ type, title: `A ${type} toast`, description: `type="${type}"` })
            }
          >
            {type}
          </Button>
        ))}
      </Inline>
    </Toaster>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const type of types) {
      await userEvent.click(canvas.getByRole('button', { name: type }));
    }
    const failed = await screen.findByRole('dialog', { name: 'A error toast' });
    await waitFor(() =>
      expect(failed.querySelector('[data-slot="toast-icon"]')).toHaveAttribute(
        'data-tone',
        'critical',
      ),
    );
    const success = screen.getByRole('dialog', { name: 'A success toast' });
    await expect(success.querySelector('[data-slot="toast-icon"]')).toHaveAttribute(
      'data-tone',
      'success',
    );
    await userEvent.hover(screen.getByRole('dialog', { name: 'A loading toast' }));
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
  parameters: {
    docs: {
      description: {
        story:
          'The action closes the toast with `toast.close(id)`, as Echopoint does for Undo and View run.',
      },
    },
  },
  render: (args) => (
    <Toaster {...args}>
      <Button
        onClick={() => {
          const id = toast.add({
            title: 'Project archived',
            description: 'You can restore it for 30 days.',
            type: 'success',
            actionProps: {
              children: 'Undo',
              onClick: () => {
                onUndo();
                toast.close(id);
              },
            },
          });
        }}
      >
        Archive project
      </Button>
    </Toaster>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Archive project' }));
    const notification = await screen.findByRole('dialog', { name: 'Project archived' });
    await waitFor(() => expect(notification).toBeVisible());
    const undo = within(notification).getByRole('button', { name: 'Undo' });
    await expect(undo).toHaveAttribute('data-slot', 'toast-action');
    await userEvent.click(undo);
    await expect(onUndo).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Project archived' })).not.toBeInTheDocument(),
    );
  },
};

export const WithoutChildren: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`Toaster` can sit next to the app with no children. `toast.add()` still reaches it.',
      },
    },
  },
  render: (args) => (
    <>
      <Button onClick={() => toast.add({ type: 'info', title: 'Run queued' })}>Queue run</Button>
      <Toaster {...args} />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Queue run' }));
    await expect(await screen.findByRole('dialog', { name: 'Run queued' })).toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: '`toast.promise()` shows a loading toast, then turns it into success or error.',
      },
    },
  },
  render: (args) => (
    <Toaster {...args}>
      <Button
        onClick={() =>
          void toast.promise(new Promise((resolve) => setTimeout(resolve, 300)), {
            loading: { type: 'loading', title: 'Publishing flow' },
            success: { type: 'success', title: 'Flow published' },
            error: { type: 'error', title: 'Could not publish the flow' },
          })
        }
      >
        Publish
      </Button>
    </Toaster>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Publish' }));
    await expect(
      await screen.findByRole('dialog', { name: 'Publishing flow' }),
    ).toBeInTheDocument();
    await expect(await screen.findByRole('dialog', { name: 'Flow published' })).toBeInTheDocument();
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
