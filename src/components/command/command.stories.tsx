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
} from '@/components/command';

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

const usage = `
A searchable list of commands with keyboard navigation. Use it for a command palette (\`CommandDialog\`) and for a search list inside a \`Popover\`, such as "Pick a saved request".

To choose a value for a form field, use \`Combobox\`: it is a real form control, with a value, a clear button and chips. Do not build an autocomplete from \`Command\` and a positioned \`CommandList\`.

The parts do not accept \`className\` or \`style\`. \`Command\` fills the width of its container.

## Command variant

| Value | Use it for |
| --- | --- |
| \`outline\` | The default. A command list that sits on the page, with its own surface and edge. |
| \`ghost\` | A command list inside a surface that already has an edge: a \`Popover\`, a \`Card\` or a panel. \`CommandDialog\` sets it for you. |

## Other props

- \`label\` on \`Command\`: the accessible name of the search field. Always set it.
- \`shouldFilter={false}\` on \`Command\`: the server already filtered and ranked the results. Pass the query with \`value\` and \`onValueChange\` on \`CommandInput\`.
- \`CommandEmpty\`: the text shown when nothing matches. Put it before \`CommandList\`, not inside it: a list box must hold only options and groups.
- \`heading\` on \`CommandGroup\`: the name of a group of results.
- \`checked\` on \`CommandItem\`: shows a check mark on the current choice.
- \`CommandShortcut\`: the keyboard shortcut of a command. It replaces the check mark.
- \`CommandDialog\`: \`title\` and \`description\` name the dialog for screen readers. They are not shown. The defaults are "Command Palette" and "Search for a command to run...".

## CommandDialog size

| Value | Use it for |
| --- | --- |
| \`md\` | The default. A short list of commands, 448 px wide, a third of the way down the screen. |
| \`lg\` | A palette that searches records with a title and a detail line each (requests and their URL, flows and their description), 736 px wide and pinned near the top, so a growing list never moves the field. |

The palette opens and closes without animation, whatever its size: it is opened from the keyboard many times a day.

## Do not

- Do not use \`Command\` as a form autocomplete. Use \`Combobox\`.
- Do not use \`size="lg"\` for a few short commands. The extra width is empty space.
- Do not position \`CommandList\` yourself. Put \`Command\` in a \`Popover\` or a \`CommandDialog\`.
- Do not put text, a loading message or an error inside \`CommandList\`. Put it next to the list, before it.
- Do not replace \`CommandInput\` with your own \`InputGroup\`. \`CommandInput\` takes \`value\`, \`onValueChange\`, \`placeholder\` and \`autoFocus\`.
`;

const meta = {
  title: 'Components/Command',
  parameters: {
    docs: {
      description: {
        component: usage,
      },
    },
  },
  component: Command,
  args: { label: 'Command menu' },
  beforeEach: () => {
    onRun.mockClear();
  },
  render: (args) => (
    <div className="w-80">
      <Command {...args}>
        <CommandInput placeholder="Type a command or search" />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          <CommandItems />
        </CommandList>
      </Command>
    </div>
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
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'zzz');
    await expect(await canvas.findByText('No results found.')).toBeVisible();
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
    await userEvent.keyboard('{Enter}');
    await expect(onRun).not.toHaveBeenCalled();
  },
};

export const WithSeparator: Story = {
  render: (args) => (
    <div className="w-80">
      <Command {...args}>
        <CommandInput placeholder="Type a command or search" />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          <CommandItems separated />
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const profile = canvas.getByRole('option', { name: 'Profile' });
    await expect(canvas.queryByRole('separator')).toBeNull();
    const separator = canvasElement.querySelector<HTMLElement>('[data-slot=command-separator]');
    if (!separator) throw new Error('The separator is missing.');
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
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export const Dialog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`CommandDialog` opens the palette near the top of the screen and returns focus to the trigger on close. The `Command` inside it takes the `ghost` variant.',
      },
    },
  },
  render: () => <CommandPalette />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open command palette' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Command Palette' });
    await waitFor(() => expect(dialog).toBeVisible());
    const input = within(dialog).getByRole('combobox');
    await waitFor(() => expect(input).toHaveFocus());
    await expect(dialog.querySelector('[data-slot=command]')).toHaveAttribute(
      'data-variant',
      'ghost',
    );
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

const longCommands = [
  'Create a payment intent for a cross-border marketplace payout with idempotency',
  'PaymentIntentConfirmationWebhookSignatureVerificationEndpointWithoutSpaces',
  '決済フローの回帰テスト — 夜間スイート',
  '🚀 Release smoke (do not delete)',
];

function LargeCommandPalette({ items }: { items: string[] }) {
  return (
    <CommandDialog open size="lg" title="Search">
      <Command label="Search">
        <CommandInput placeholder="Search requests, flows and specs" />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          <CommandGroup heading="Results">
            {items.map((item) => (
              <CommandItem key={item} onSelect={() => onRun(item)}>
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export const DialogLarge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="lg"` is 736 px wide and pinned near the top. Like every palette it appears without a fade or a zoom.',
      },
    },
  },
  render: () => <LargeCommandPalette items={['Calendar', 'Profile', 'Settings']} />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Search' });
    await expect(dialog).toHaveAttribute('data-size', 'lg');
    await expect(dialog.getAnimations()).toHaveLength(0);
    const backdrop = document.querySelector<HTMLElement>('[data-slot=dialog-overlay]');
    await expect(backdrop?.getAnimations() ?? []).toHaveLength(0);
    const width = dialog.getBoundingClientRect().width;
    await expect(width).toBeLessThanOrEqual(736);
    await expect(width).toBeLessThanOrEqual(window.innerWidth - 32);
  },
};

export const DialogLargeWorstCase: Story = {
  render: () => <LargeCommandPalette items={longCommands} />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Search' });
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
  },
};

export const Ghost: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="ghost"` drops the surface and the edge, for a command list inside a popover or a panel. The frame here stands in for that surface.',
      },
    },
  },
  args: { variant: 'ghost', label: 'Saved requests' },
  render: (args) => (
    <div className="w-80 rounded-3xl bg-popover shadow-lg ring-1 ring-foreground/10">
      <Command {...args}>
        <CommandInput placeholder="Search saved requests" />
        <CommandEmpty>No saved requests match this search.</CommandEmpty>
        <CommandList>
          <CommandItems />
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('combobox')).toHaveAccessibleName('Saved requests');
    const command = canvasElement.querySelector('[data-slot=command]');
    await expect(command).toHaveAttribute('data-variant', 'ghost');
    await expect(command).toHaveClass('bg-transparent');
  },
};

const environments = ['development', 'staging', 'production'];

export const Checked: Story = {
  parameters: {
    docs: {
      description: {
        story: '`checked` shows a check mark on the current choice.',
      },
    },
  },
  args: { label: 'Environment' },
  render: (args) => (
    <div className="w-80">
      <Command {...args}>
        <CommandInput placeholder="Search environments" />
        <CommandEmpty>No environments found.</CommandEmpty>
        <CommandList>
          <CommandGroup heading="Environments">
            {environments.map((environment) => (
              <CommandItem
                key={environment}
                checked={environment === 'staging'}
                onSelect={() => onRun(environment)}
              >
                {environment}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const staging = canvas.getByRole('option', { name: 'staging' });
    await expect(staging).toHaveAttribute('data-checked', 'true');
    await expect(staging.querySelector('svg')).toBeVisible();
    await expect(canvas.getByRole('option', { name: 'production' })).not.toHaveAttribute(
      'data-checked',
      'true',
    );
    await userEvent.click(canvas.getByRole('option', { name: 'production' }));
    await expect(onRun).toHaveBeenCalledWith('production');
  },
};
