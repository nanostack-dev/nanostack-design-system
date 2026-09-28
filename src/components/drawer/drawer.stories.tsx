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
} from './drawer';

const onSubmit = fn();

const meta = {
  title: 'Components/Drawer',
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
          <DrawerClose render={<Button onClick={onSubmit} />}>Save goal</DrawerClose>
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
