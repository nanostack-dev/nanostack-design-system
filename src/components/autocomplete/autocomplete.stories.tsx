import { MagnifyingGlassIcon, StackSimpleIcon, TagIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/components/autocomplete';
import { Button } from '@/components/button';
import { Field, FieldDescription, FieldLabel } from '@/components/field';
import { Stack } from '@/layout/stack';

const environments = ['production', 'staging', 'development', 'preview', 'qa'];

const tagGroups = [
  { value: 'Recent', items: ['billing', 'checkout', 'onboarding'] },
  { value: 'All tags', items: ['auth', 'email', 'invoices', 'payments', 'refunds', 'search'] },
];

const body = within(document.body);

const usage = `
A text field that suggests values while the user types. The typed text is the value: any text is valid, and a suggestion only fills the field faster. Use it for a name that can be new, such as an environment key or a tag.

Choose between the three fields by what counts as a valid value:

| Component | Use it for |
| --- | --- |
| \`Autocomplete\` | Free text with suggestions. A value that is not in the list is kept. |
| \`Combobox\` | One value from a long list that the user filters by typing. A value that is not in the list is rejected. |
| \`Select\` | One value from a short list that the user reads. There is no typing. |

The parts do not accept \`className\` or \`style\`. Autocomplete and Combobox share the field, list and item look.

## Parts

| Part | Use it for |
| --- | --- |
| \`Autocomplete\` | The root. It holds the text (\`value\`, \`defaultValue\`, \`onValueChange\`) and the suggestions (\`items\`). |
| \`AutocompleteInput\` | The text field. Give it a name with \`aria-label\` or a \`FieldLabel\`. |
| \`AutocompleteContent\` and \`AutocompleteList\` | The popup and the list of suggestions. |
| \`AutocompleteItem\` | One suggestion. Its \`value\` fills the field when the user picks it. |
| \`AutocompleteGroup\`, \`AutocompleteGroupLabel\`, \`AutocompleteCollection\` | Suggestions in named groups, such as recent tags and all tags. |
| \`AutocompleteEmpty\` | The text shown when no suggestion matches. |

## size

| Value | Use it for |
| --- | --- |
| \`sm\` | A dense place: a toolbar, a filter row, a table header. |
| \`md\` | The default. Forms and dialogs. |

## font

| Value | Use it for |
| --- | --- |
| \`sans\` | The default. Names and words. |
| \`mono\` | Keys, identifiers and values that the user compares character by character, such as an environment key. |

## width

| Value | Use it for |
| --- | --- |
| \`fill\` | The default. The field fills its container, like \`Input\`. Put it in a \`Field\` or a layout block to set the width. |
| \`auto\` | A field that keeps its own width in a row, such as a filter next to other controls. |

## Other props

- \`icon\` on \`AutocompleteInput\`: a Phosphor icon before the text. Use it when the icon tells what the field holds, such as a tag or a search.
- \`items\` on \`Autocomplete\` filters the suggestions as the user types. Pass \`filteredItems\` when you filter yourself, and \`limit\` to cap a long list.
- \`mode\`: \`list\` (the default) filters the list. \`both\` also completes the text in the field with the highlighted suggestion. \`none\` keeps a static list.
- \`openOnInputClick\` opens the list when the user clicks the field, before any typing.
- \`side\` and \`align\` on \`AutocompleteContent\`: where the list opens. The default is below the field, aligned to its start.

## Keyboard

- Typing changes the text and opens the list.
- Arrow Down and Arrow Up move through the suggestions.
- Enter puts the highlighted suggestion in the field.
- Escape closes the list and keeps the text.

## Do not

- Do not use \`Combobox\` and copy the typed text into the selected value to accept free text. Use \`Autocomplete\`.
- Do not build an autocomplete from \`Command\` with a positioned \`CommandList\`. Use \`Autocomplete\`.
- Do not use \`Autocomplete\` when only a value from the list is valid. Use \`Combobox\` or \`Select\`.
`;

const meta = {
  title: 'Components/Autocomplete',
  parameters: { docs: { description: { component: usage } } },
  component: Autocomplete,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: { items: environments, onValueChange: fn() },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteInput aria-label="Environment" placeholder="Default environment" />
      <AutocompleteContent>
        <AutocompleteEmpty>No environment matches. The typed name is kept.</AutocompleteEmpty>
        <AutocompleteList aria-label="Environments">
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              <StackSimpleIcon aria-hidden />
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
} satisfies Meta<typeof Autocomplete<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Environment' });
    await userEvent.type(input, 'sta');
    const listbox = await body.findByRole('listbox', { name: 'Environments' });
    await waitFor(() => expect(within(listbox).getAllByRole('option')).toHaveLength(1));
    await userEvent.click(within(listbox).getByRole('option', { name: 'staging' }));
    await expect(input).toHaveValue('staging');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('staging', expect.anything());
    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const FreeText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A name that is not in the list is a valid value. The field keeps it after the list closes and the field loses focus.',
      },
    },
  },
  render: (args) => (
    <Stack space="md">
      <Field>
        <FieldLabel htmlFor="free-text-environment">Environment</FieldLabel>
        <Autocomplete {...args}>
          <AutocompleteInput
            id="free-text-environment"
            font="mono"
            placeholder="Default environment"
          />
          <AutocompleteContent>
            <AutocompleteEmpty>No environment matches. The typed name is kept.</AutocompleteEmpty>
            <AutocompleteList aria-label="Environments">
              {(item: string) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
        <FieldDescription>A new name creates the environment on the first run.</FieldDescription>
      </Field>
      <Button variant="solid" tone="brand">
        Save schedule
      </Button>
    </Stack>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Environment' });
    await userEvent.type(input, 'staging-eu');
    await waitFor(() => expect(body.getByText(/No environment matches/)).toBeVisible());
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Save schedule' })).toHaveFocus();
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await expect(input).toHaveValue('staging-eu');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('staging-eu', expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Environment' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const listbox = await body.findByRole('listbox', { name: 'Environments' });
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const highlighted = () => listbox.querySelector('[data-highlighted]')?.textContent;
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(highlighted()).toBe('production'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(highlighted()).toBe('staging'));
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('staging');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('staging', expect.anything());
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await userEvent.keyboard('-eu');
    await expect(await body.findByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('staging-eu');
  },
};

export const WithGroups: Story = {
  args: { items: tagGroups, openOnInputClick: true },
  parameters: {
    docs: {
      description: {
        story:
          'Suggestions in named groups, with a leading icon that says what the field holds. `openOnInputClick` shows the list before any typing.',
      },
    },
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteInput aria-label="Tag" placeholder="Add or search a tag" icon={TagIcon} />
      <AutocompleteContent>
        <AutocompleteEmpty>No tag matches. Press Enter to add it.</AutocompleteEmpty>
        <AutocompleteList aria-label="Tags">
          {(group: (typeof tagGroups)[number]) => (
            <AutocompleteGroup key={group.value} items={group.items}>
              <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
              <AutocompleteCollection>
                {(item: string) => (
                  <AutocompleteItem key={item} value={item}>
                    {item}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Tag' });
    await userEvent.click(input);
    const all = await body.findByRole('group', { name: 'All tags' });
    const listbox = body.getByRole('listbox', { name: 'Tags' });
    await waitFor(() =>
      expect(listbox.getBoundingClientRect().left).toBeLessThan(input.getBoundingClientRect().left),
    );
    await expect(within(all).getAllByRole('option')).toHaveLength(6);
    await userEvent.type(input, 'pay');
    await waitFor(() => expect(body.queryByRole('group', { name: 'Recent' })).toBeNull());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('payments');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('payments', expect.anything());
  },
};

export const Mono: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`font="mono"` for keys and identifiers. The suggestions keep the sans font of the list.',
      },
    },
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteInput aria-label="Environment key" font="mono" />
      <AutocompleteContent>
        <AutocompleteList aria-label="Environments">
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Environment key' });
    await expect(getComputedStyle(input).fontFamily).toMatch(/mono/i);
    await userEvent.type(input, 'pre');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('preview');
  },
};

export const SizesAndWidths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="sm"` is 32 px high and `size="md"` is 36 px, like `Button`. `width="auto"` keeps the field at its own width; `width="fill"` stretches it.',
      },
    },
  },
  render: (args) => (
    <Stack space="md">
      <Autocomplete {...args}>
        <AutocompleteInput
          aria-label="Small search"
          placeholder="Search"
          size="sm"
          icon={MagnifyingGlassIcon}
        />
      </Autocomplete>
      <Autocomplete {...args}>
        <AutocompleteInput
          aria-label="Medium search"
          placeholder="Search"
          icon={MagnifyingGlassIcon}
        />
      </Autocomplete>
      <Autocomplete {...args}>
        <AutocompleteInput aria-label="Auto width search" placeholder="Search" width="auto" />
      </Autocomplete>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const group = (name: string) =>
      canvas.getByRole('combobox', { name }).closest<HTMLElement>('[data-slot=input-group]');
    await expect(group('Small search')?.getBoundingClientRect().height).toBe(32);
    await expect(group('Medium search')?.getBoundingClientRect().height).toBe(36);
    await expect(group('Medium search')?.getBoundingClientRect().width).toBe(288);
    await expect(group('Auto width search')?.getBoundingClientRect().width).toBeLessThan(288);
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'production' },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteInput aria-label="Environment" icon={StackSimpleIcon} disabled />
      <AutocompleteContent>
        <AutocompleteList aria-label="Environments">
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Environment' });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('production');
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
