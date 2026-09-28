import { CalendarIcon, GearIcon, UserIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

const onRun = fn();

function CommandItems({ separated = false }: { separated?: boolean }) {
  return (
    <>
      <CommandGroup heading="Suggestions">
        <CommandItem onSelect={() => onRun('calendar')}>
          <CalendarIcon />
          Calendar
        </CommandItem>
        <CommandItem onSelect={() => onRun('profile')}>
          <UserIcon />
          Profile
        </CommandItem>
        <CommandItem disabled onSelect={() => onRun('billing')}>
          Billing
        </CommandItem>
      </CommandGroup>
      {separated && <CommandSeparator />}
      <CommandGroup heading="Settings">
        <CommandItem onSelect={() => onRun('settings')}>
          <GearIcon />
          Settings
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

const meta = {
  title: 'Components/Command',
  component: Command,
  args: { label: 'Command menu' },
  beforeEach: () => {
    onRun.mockClear();
  },
  render: (args) => (
    <Command {...args} className="w-80 ring-1 ring-foreground/10">
      <CommandInput placeholder="Type a command or search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItems />
      </CommandList>
    </Command>
  ),
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

function selectedOption() {
  return screen
    .getAllByRole('option')
    .find((option) => option.getAttribute('aria-selected') === 'true');
}

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await expect(input).toHaveAccessibleName('Command menu');
    await expect(canvas.getAllByRole('option')).toHaveLength(4);
    await userEvent.click(canvas.getByRole('option', { name: 'Profile' }));
    await expect(onRun).toHaveBeenCalledWith('profile');
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await waitFor(() => expect(selectedOption()).toHaveTextContent('Calendar'));
    await userEvent.keyboard('{ArrowDown}');
    await expect(selectedOption()).toHaveTextContent('Profile');
    await userEvent.keyboard('{ArrowDown}');
    await expect(selectedOption()).toHaveTextContent('Settings');
    await userEvent.keyboard('{ArrowUp}');
    await expect(selectedOption()).toHaveTextContent('Profile');
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onRun).toHaveBeenCalledOnce();
    await expect(onRun).toHaveBeenCalledWith('profile');
  },
};

export const Filter: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'sett');
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1));
    await expect(canvas.getByRole('option', { name: /Settings/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{Enter}');
    await expect(onRun).toHaveBeenCalledWith('settings');
  },
};

export const Empty: Story = {
  parameters: { a11y: { test: 'todo' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'zzz');
    await expect(await canvas.findByText('No results found.')).toBeVisible();
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
    await userEvent.keyboard('{Enter}');
    await expect(onRun).not.toHaveBeenCalled();
  },
};

export const WithSeparator: Story = {
  parameters: { a11y: { test: 'todo' } },
  render: (args) => (
    <Command {...args} className="w-80 ring-1 ring-foreground/10">
      <CommandInput placeholder="Type a command or search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItems separated />
      </CommandList>
    </Command>
  ),
  play: async ({ canvas }) => {
    const profile = canvas.getByRole('option', { name: 'Profile' });
    const separator = canvas.getByRole('separator');
    await expect(separator).toBeVisible();
    await expect(separator.getBoundingClientRect().top).toBeGreaterThan(
      profile.getBoundingClientRect().bottom,
    );
  },
};

function CommandPalette() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command label="Command palette">
          <CommandInput placeholder="Type a command or search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export const Dialog: Story = {
  render: () => <CommandPalette />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open command palette' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Command Palette' });
    await waitFor(() => expect(dialog).toBeVisible());
    const input = within(dialog).getByRole('combobox');
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    const reopened = await screen.findByRole('dialog', { name: 'Command Palette' });
    await userEvent.type(within(reopened).getByRole('combobox'), 'cal');
    await userEvent.keyboard('{Enter}');
    await expect(onRun).toHaveBeenCalledWith('calendar');
  },
};
