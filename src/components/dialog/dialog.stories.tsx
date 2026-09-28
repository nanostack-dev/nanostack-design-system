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
  type DialogSize,
} from '@/components/dialog';
import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';

const onSave = fn();
const sizes: { size: DialogSize; width: string }[] = [
  { size: 'md', width: 'sm:max-w-md' },
  { size: 'lg', width: 'sm:max-w-2xl' },
  { size: 'xl', width: 'sm:max-w-4xl' },
];

const usage = `
A modal window for a task that needs the full attention of the user: a short form, a create flow, or details. For a confirm step, use \`AlertDialog\` or the \`ConfirmDialog\` block. For a task that keeps the page in view, use \`Sheet\`.

The parts are closed. \`DialogContent\` does not accept \`className\` or \`style\`: the width comes from \`size\`, and the height is capped for you.

## size: how wide the dialog is

| Value | Width | Use it for |
| --- | --- | --- |
| \`md\` | 448 px | The default. A short form or a question with details: rename, new folder, delete with options. |
| \`lg\` | 672 px | A form with many fields or two columns: a schedule, a webhook. |
| \`xl\` | 896 px | A wide or multi-step flow: an API key with scopes, an import wizard. |

On a phone, every size fills the screen width less 16 px on each side.

## Height and scroll

The dialog never grows past the viewport. When the content is taller, the body scrolls, and the close button stays in the corner. You do not set a max height.

## Other props

- \`DialogTrigger\` and \`DialogClose\` take \`render\`, so the trigger is a real \`Button\`: \`<DialogTrigger render={<Button>Rename</Button>} />\`.
- \`DialogContent showCloseButton={false}\`: removes the close button in the corner. Keep it unless the content has its own way out, such as a command palette that closes on Escape.
- \`DialogFooter showCloseButton\`: adds an outline Close button to the footer, for a dialog that only shows information.
- \`DialogHeader visuallyHidden\`: hides the title and description on screen and keeps them for screen readers. Use it when the content already shows what the dialog is, such as a search field.

## Do not

- Do not set a width or a max height on the content. Choose a \`size\`. The height cap and scroll are built in.
- Do not remove \`DialogTitle\` to hide it. Every dialog needs a name. Use \`DialogHeader visuallyHidden\`.
- Do not make the title larger. The title size is fixed for every dialog.
- Do not confirm a delete with a \`Dialog\`. Use \`AlertDialog\` or \`ConfirmDialog\`.
`;

const meta = {
  title: 'Components/Dialog',
  parameters: { docs: { description: { component: usage } } },
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
    await expect(dialog).toHaveAttribute('data-size', 'md');
    await expect(dialog.querySelector('[data-slot="dialog-body"]')).not.toHaveAttribute('tabindex');
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One trigger per `size`. `md` fits a short form, `lg` a long form, `xl` a wide or multi-step flow.',
      },
    },
  },
  render: (args) => (
    <Inline space="sm">
      {sizes.map(({ size }) => (
        <Dialog key={size} {...args}>
          <DialogTrigger render={<Button variant="outline" />}>Open {size}</DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Dialog size {size}</DialogTitle>
              <DialogDescription>The width comes from the size prop.</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      ))}
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const { size, width } of sizes) {
      await userEvent.click(canvas.getByRole('button', { name: `Open ${size}` }));
      const dialog = await screen.findByRole('dialog', { name: `Dialog size ${size}` });
      await expect(dialog).toHaveAttribute('data-size', size);
      await expect(dialog).toHaveClass(width);
      await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
        window.innerWidth - 32,
      );
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    }
  },
};

export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The content is taller than the screen. The dialog stops at the viewport, the body scrolls, and the close button stays in the corner.',
      },
    },
  },
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Read terms</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Read the terms before you continue.</DialogDescription>
        </DialogHeader>
        {Array.from({ length: 16 }, (_, index) => (
          <Text key={index} tone="muted">
            Section {index + 1}. The service stores workspace data in the region that the owner
            selects. An owner can export or delete the data at any time from the settings page.
          </Text>
        ))}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ userEvent }) => {
    const dialog = await screen.findByRole('dialog', { name: 'Terms of service' });
    await Promise.all(
      dialog.getAnimations({ subtree: true }).map((animation) => animation.finished),
    );
    await waitFor(() =>
      expect(dialog.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight),
    );
    const body = dialog.querySelector<HTMLElement>('[data-slot="dialog-body"]')!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    const close = dialog.querySelector<HTMLElement>('[data-slot="dialog-close"]')!;
    await expect(close).toHaveAccessibleName('Close');
    const closeTop = close.getBoundingClientRect().top;
    body.scrollTop = body.scrollHeight;
    await waitFor(() => expect(body.scrollTop).toBeGreaterThan(0));
    await expect(close.getBoundingClientRect().top).toBeCloseTo(closeTop, 0);
    await userEvent.click(close);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const HiddenHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`DialogHeader visuallyHidden` keeps the name for screen readers when the content already says what the dialog is. Here a search field fills the dialog, and Escape closes it.',
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Search</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader visuallyHidden>
          <DialogTitle>Global search</DialogTitle>
          <DialogDescription>Search collections, requests and flows.</DialogDescription>
        </DialogHeader>
        <input
          aria-label="Search"
          placeholder="Search"
          className="h-9 rounded-2xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    const dialog = await screen.findByRole('dialog', { name: 'Global search' });
    await expect(dialog).toHaveAccessibleDescription('Search collections, requests and flows.');
    const title = within(dialog).getByText('Global search');
    await expect(title.parentElement!.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(within(dialog).queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
