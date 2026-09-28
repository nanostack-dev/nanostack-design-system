import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/drawer';
import { Text } from '@/components/text';

const onSubmit = fn();

const usage = `
A panel that slides in from the edge of the screen and closes with a swipe. Use it on a phone: for a mobile menu, a side panel that the desktop shows inline, or a short task. On a wide screen, prefer \`Sheet\` or \`Dialog\`.

The parts are closed. \`DrawerContent\` does not accept \`className\` or \`style\`. The drawer sizes itself to its content, up to the screen height less 96 px.

## swipeDirection: where the drawer comes from

| Value | Use it for |
| --- | --- |
| \`down\` | The default. A bottom drawer on a phone, for a menu or a short task. |
| \`right\` or \`left\` | A side panel on a tablet. The drawer is 75% wide, and 384 px from the \`sm\` breakpoint. |
| \`up\` | A top drawer. Rare. |

## Other props

- \`showSwipeHandle\` on \`Drawer\`: shows the grab bar. Use it on a bottom drawer that the user can swipe closed.
- \`snapPoints\` on \`Drawer\`: stops the drawer at set heights, for a panel that opens half way first.
- \`DrawerTrigger\` and \`DrawerClose\` take \`render\`: \`<DrawerTrigger render={<Button>Menu</Button>} />\`.
- \`DrawerHeader visuallyHidden\`: hides the title and description on screen and keeps them for screen readers.

## Do not

- Do not set a height on the content. Use \`snapPoints\` when the drawer must stop part way.
- Do not remove \`DrawerTitle\`. Every drawer needs a name. Use \`DrawerHeader visuallyHidden\` to hide it.
- Do not use a drawer for a desktop dialog.
`;

const meta = {
  title: 'Components/Drawer',
  parameters: { docs: { description: { component: usage } } },
  component: Drawer,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onSubmit.mockClear();
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>Set daily goal</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Daily goal</DrawerTitle>
          <DrawerDescription>Choose how many tasks you want to close each day.</DrawerDescription>
        </DrawerHeader>
        <p className="p-4 text-center text-4xl font-semibold tabular-nums">12</p>
        <DrawerFooter>
          <DrawerClose render={<Button variant="solid" tone="brand" onClick={onSubmit} />}>
            Save goal
          </DrawerClose>
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Set daily goal' });
    await userEvent.click(trigger);
    const drawer = await screen.findByRole('dialog', { name: 'Daily goal' });
    await waitFor(() => expect(drawer).toBeVisible());
    await expect(drawer).toHaveAccessibleDescription(
      'Choose how many tasks you want to close each day.',
    );
    await userEvent.click(within(drawer).getByRole('button', { name: 'Save goal' }));
    await expect(onSubmit).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Set daily goal' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const drawer = await screen.findByRole('dialog', { name: 'Daily goal' });
    await waitFor(() => expect(drawer).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onSubmit).not.toHaveBeenCalled();
  },
};

export const BottomEdge: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Set daily goal' }));
    const drawer = await screen.findByRole('dialog', { name: 'Daily goal' });
    await waitFor(() => {
      const bounds = drawer.getBoundingClientRect();
      expect(bounds.bottom).toBeLessThanOrEqual(window.innerHeight);
      expect(bounds.bottom).toBeGreaterThan(window.innerHeight - 24);
    });
  },
};

export const RightSide: Story = {
  args: { swipeDirection: 'right' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Set daily goal' }));
    const drawer = await screen.findByRole('dialog', { name: 'Daily goal' });
    await waitFor(() => {
      const bounds = drawer.getBoundingClientRect();
      expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
      expect(bounds.left).toBeGreaterThan(window.innerWidth / 2 - 200);
    });
  },
};

export const SwipeHandleAndHiddenHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A side panel shown as a bottom drawer on a phone. `showSwipeHandle` adds the grab bar. `DrawerHeader visuallyHidden` names the drawer, because the panel shows its own heading.',
      },
    },
  },
  args: { showSwipeHandle: true, defaultOpen: true },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>Open panel</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader visuallyHidden>
          <DrawerTitle>Step settings</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4">
          <Text weight="medium">Step settings</Text>
          <Text tone="muted">Retries: 3. Timeout: 30 s.</Text>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async () => {
    const drawer = await screen.findByRole('dialog', { name: 'Step settings' });
    await expect(drawer.querySelector('[data-slot="drawer-swipe-handle"]')).toBeInTheDocument();
    const header = drawer.querySelector<HTMLElement>('[data-slot="drawer-header"]')!;
    await expect(header.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  },
};
