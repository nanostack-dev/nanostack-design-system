import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/combobox';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

const timezones = [
  { value: 'Americas', items: ['New York', 'Los Angeles', 'Sao Paulo'] },
  { value: 'Europe', items: ['London', 'Paris', 'Berlin'] },
];

const body = within(document.body);

const usage = `
A text field with a filtered list of options. Use it to choose a value in a form when the list is long and the user knows what to type: an environment, a member, a tag.

Use \`Autocomplete\` when any typed text is a valid value and the list only suggests. Use \`Select\` for a short list the user reads. Use \`Command\` for a list of commands. Do not build an autocomplete from \`Command\`.

The parts do not accept \`className\` or \`style\`. \`ComboboxInput\` and \`ComboboxChips\` fill the width of their container, like \`Input\`. Put them in a \`Field\` or a layout block to set the width.

## Parts

| Part | Use it for |
| --- | --- |
| \`ComboboxInput\` | One value. It shows a button that opens the list, and a clear button with \`showClear\`. |
| \`ComboboxChips\` with \`ComboboxChip\` and \`ComboboxChipsInput\` | Several values (\`multiple\`). Pass the chips element to \`ComboboxContent anchor\` with \`useComboboxAnchor\`. |
| \`ComboboxGroup\`, \`ComboboxLabel\`, \`ComboboxCollection\` | Options in named groups, such as time zones by region. |
| \`ComboboxEmpty\` | The text shown when no option matches. Always add it. |

## Other props

- \`showTrigger\` (default \`true\`) and \`showClear\` on \`ComboboxInput\`. The clear button replaces the trigger while there is a value.
- \`triggerLabel\`, \`clearLabel\` and \`removeLabel\`: the accessible names of the icon buttons. Translate them with the rest of the product. \`removeLabel\` defaults to "Remove" and the chip text.
- \`side\` and \`align\` on \`ComboboxContent\`: where the list opens. The default is below the field, aligned to its start. The list is at least as wide as the text field.

## Do not

- Do not use \`Command\` with a positioned \`CommandList\` as a form autocomplete. Use \`Combobox\`.
- Do not set the width of \`ComboboxInput\` with \`className\`. Its container sets it.
- Do not leave \`ComboboxInput\` without a name. Give it \`aria-label\` or put it in a \`Field\` with a \`FieldLabel\`.
`;

const meta = {
  title: 'Components/Combobox',
  parameters: {
    docs: {
      description: {
        component: usage,
      },
    },
  },
  component: Combobox,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: { items: frameworks, onValueChange: fn() },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput aria-label="Framework" placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await userEvent.click(input);
    const listbox = await body.findByRole('listbox');
    await expect(within(listbox).getAllByRole('option')).toHaveLength(frameworks.length);
    await userEvent.click(within(listbox).getByRole('option', { name: 'Remix' }));
    await expect(input).toHaveValue('Remix');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Remix', expect.anything());
    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const TypeToFilter: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await userEvent.click(input);
    await userEvent.type(input, 'nu');
    const listbox = await body.findByRole('listbox');
    await waitFor(() => expect(within(listbox).getAllByRole('option')).toHaveLength(1));
    await expect(within(listbox).getByRole('option', { name: 'Nuxt.js' })).toBeVisible();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Nuxt.js');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Nuxt.js', expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Show options' })).not.toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const listbox = await body.findByRole('listbox', { name: 'Frameworks' });
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const highlighted = () => listbox.querySelector('[data-highlighted]')?.textContent;
    await waitFor(() => expect(highlighted()).toBe('Next.js'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(highlighted()).toBe('SvelteKit'));
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('SvelteKit');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('SvelteKit', expect.anything());
    await userEvent.keyboard('{ArrowDown}');
    await expect(await body.findByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('SvelteKit');
  },
};

export const Empty: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await userEvent.type(input, 'zzz');
    await waitFor(() => expect(body.getByText('No items found.')).toBeVisible());
    await expect(body.queryAllByRole('option')).toHaveLength(0);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput aria-label="Framework" placeholder="Select a framework" disabled />
      <ComboboxContent>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await expect(input).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Show options' })).toBeDisabled();
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const DisabledItems: Story = {
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput aria-label="Framework" placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item} disabled={item === 'SvelteKit'}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await userEvent.click(input);
    const option = await body.findByRole('option', { name: 'SvelteKit' });
    await expect(option).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(option).pointerEvents).toBe('none');
    const listbox = body.getByRole('listbox', { name: 'Frameworks' });
    const highlighted = () => listbox.querySelector('[data-highlighted]')?.textContent;
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(highlighted()).toBe('Next.js'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(highlighted()).toBe('SvelteKit'));
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('');
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const WithClear: Story = {
  args: { defaultValue: 'Astro' },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput aria-label="Framework" placeholder="Select a framework" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    await expect(input).toHaveValue('Astro');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(input).toHaveValue('');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
  },
};

export const Groups: Story = {
  args: { items: timezones },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput aria-label="Timezone" placeholder="Select a timezone" />
      <ComboboxContent>
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList aria-label="Timezones">
          {(group: (typeof timezones)[number], index: number) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              {index < timezones.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Timezone' });
    await userEvent.click(input);
    const europe = await body.findByRole('group', { name: 'Europe' });
    await expect(within(europe).getAllByRole('option')).toHaveLength(3);
    await userEvent.type(input, 'par');
    await waitFor(() => expect(body.queryByRole('group', { name: 'Americas' })).toBeNull());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Paris');
  },
};

type MultipleComboboxProps = { onValueChange: NonNullable<Story['args']>['onValueChange'] };

function MultipleCombobox({ onValueChange }: MultipleComboboxProps) {
  const anchor = useComboboxAnchor();
  return (
    <Combobox
      multiple
      items={frameworks}
      defaultValue={['Next.js']}
      onValueChange={(value, eventDetails) => onValueChange?.(value, eventDetails)}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="Frameworks" />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export const Multiple: Story = {
  render: (args) => <MultipleCombobox onValueChange={args.onValueChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Frameworks' });
    await userEvent.click(input);
    await userEvent.type(input, 'astro');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['Next.js', 'Astro'],
      expect.anything(),
    );
    await expect(canvas.getByText('Astro')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Remove Astro' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Next.js' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['Astro'], expect.anything());
    await expect(canvas.queryByText('Next.js')).not.toBeInTheDocument();
  },
};

export const Trigger: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show options' });
    await userEvent.click(trigger);
    const listbox = await body.findByRole('listbox', { name: 'Frameworks' });
    await waitFor(() => expect(listbox).toBeVisible());
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(await body.findByRole('option', { name: 'Astro' }));
    await expect(canvas.getByRole('combobox', { name: 'Framework' })).toHaveValue('Astro');
  },
};

export const FillsContainer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`ComboboxInput` fills its container, like `Input`. Here the container is 288 px wide. The list opens at least as wide as the text field.',
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Framework' });
    const field = input.closest<HTMLElement>('[data-slot=input-group]');
    if (!field) throw new Error('The input group is missing.');
    await expect(field.getBoundingClientRect().width).toBe(288);
    await userEvent.click(input);
    const listbox = await body.findByRole('listbox');
    await waitFor(() =>
      expect(listbox.getBoundingClientRect().width).toBeGreaterThanOrEqual(
        input.getBoundingClientRect().width,
      ),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
  },
};
