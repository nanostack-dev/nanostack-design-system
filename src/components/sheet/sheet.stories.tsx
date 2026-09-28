import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from './sheet';

const sides: SheetSide[] = ['top', 'right', 'bottom', 'left'];
const onApply = fn();

const meta = {
  title: 'Components/Sheet',
  parameters: {
    docs: {
      description: {
        component:
          'A side panel over the page for a secondary task. Use it for filters, details and edit forms that keep the page in view.',
      },
    },
  },
  component: Sheet,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onApply.mockClear();
  },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>Filters</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list to the items that matter now.</SheetDescription>
        </SheetHeader>
        <fieldset className="flex flex-col gap-2 px-6 text-sm">
          <legend className="mb-2 font-medium">Status</legend>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked /> Active
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Archived
          </label>
        </fieldset>
        <SheetFooter>
          <SheetClose render={<Button onClick={onApply} />}>Apply filters</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await waitFor(() => expect(sheet).toBeVisible());
    await expect(sheet).toHaveAttribute('data-side', 'right');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Apply filters' }));
    await expect(onApply).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard(' ');
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await waitFor(() => expect(sheet).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const CloseButton: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onApply).not.toHaveBeenCalled();
  },
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Sheet key={side} {...args}>
          <SheetTrigger render={<Button variant="outline" />}>Open {side}</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Panel on the {side}</SheetTitle>
              <SheetDescription>The panel slides in from the {side} edge.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open left' }));
    const sheet = await screen.findByRole('dialog', { name: 'Panel on the left' });
    await waitFor(() => expect(sheet.getBoundingClientRect().left).toBe(0));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Open bottom' }));
    const bottom = await screen.findByRole('dialog', { name: 'Panel on the bottom' });
    await waitFor(() =>
      expect(Math.round(bottom.getBoundingClientRect().bottom)).toBe(window.innerHeight),
    );
  },
};
