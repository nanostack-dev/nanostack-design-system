import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectTriggerSize,
  type SelectTriggerVariant,
} from '@/components/select';
import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';

const regions = [
  { label: 'Choose a region', value: null },
  { label: 'US East', value: 'us-east-1' },
  { label: 'EU West', value: 'eu-west-1' },
  { label: 'Asia Pacific South', value: 'ap-south-1' },
];

const sizes: SelectTriggerSize[] = ['sm', 'md'];
const variants: SelectTriggerVariant[] = ['soft', 'ghost'];

function RegionItems() {
  return (
    <SelectGroup>
      {regions.map((region) => (
        <SelectItem key={region.label} value={region.value}>
          {region.label}
        </SelectItem>
      ))}
    </SelectGroup>
  );
}

const usage = `
A button that opens a list of options for one value. Use it for more than seven options, or for a choice in a dense place such as a toolbar or a table header. For two to seven options that people must see together, use \`RadioGroup\`. To search a long list, use \`Combobox\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. \`SelectContent\` is at least as wide as its trigger (144 px at least) and grows to show a long option in full, up to the available width.

## Parts

- \`Select\`: the state. \`value\`, \`defaultValue\`, \`onValueChange\`, \`items\`, \`disabled\`.
- \`SelectTrigger\` with a \`SelectValue\`: the button. Give it the \`id\` of its \`FieldLabel\`, or an \`aria-label\`.
- \`SelectContent\` with \`SelectItem\`, \`SelectGroup\`, \`SelectLabel\` and \`SelectSeparator\`: the list.

## SelectTrigger variant

| Value | Use it for |
| --- | --- |
| \`soft\` | The default. Every select in a form, a dialog, or a filter bar. |
| \`ghost\` | A select in a toolbar or a header, next to \`ghost\` buttons, such as an environment picker. The fill shows on hover, on focus, and while the list is open. |

## SelectTrigger size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense place: a toolbar, a table footer, a node editor. It lines up with a \`sm\` button and a \`sm\` input. |
| \`md\` | 36 px | The default. Forms and dialogs. It lines up with a \`md\` button and a \`md\` input. |

## SelectTrigger width

| Value | Use it for |
| --- | --- |
| \`auto\` | The default. The trigger is as wide as its value. Use it in a toolbar. |
| \`fill\` | The trigger fills its container. Use it in a form, and to give the trigger a fixed width: set the width on the container. |

## SelectContent

- \`side\` and \`align\` place the list. The default is below the trigger.
- \`alignItemWithTrigger\` (default \`true\`) puts the selected option over the trigger. Set it to \`false\` to open the list below the trigger.

## Do not

- Do not set the height, the radius or the text size of the trigger. Use \`size\`.
- Do not set a width on the trigger. Put it in a container with that width and use \`width="fill"\`.
- Do not use \`ghost\` in a form. People cannot see that it is a field.
- Do not put more than one line of text in an option. Use \`Combobox\` or a dialog for rich options.
`;

const meta = {
  title: 'Components/Select',
  parameters: { docs: { description: { component: usage } } },
  component: Select,
  args: { items: regions, onValueChange: fn() },
  render: (args) => (
    <div className="w-64">
      <Field>
        <FieldLabel htmlFor="region">Region</FieldLabel>
        <Select {...args}>
          <SelectTrigger id="region" width="fill">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <RegionItems />
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toHaveTextContent('Choose a region');
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'EU West' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('EU West');
    await expect(args.onValueChange).toHaveBeenCalledWith('eu-west-1', expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(await screen.findByRole('listbox')).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Choose a region' })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(screen.getByRole('option', { name: 'EU West' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('EU West');
    await expect(trigger).toHaveFocus();
  },
};

export const Escape: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await userEvent.click(trigger);
    await expect(await screen.findByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const Groups: Story = {
  args: { items: undefined, defaultValue: 'postgres' },
  render: (args) => (
    <div className="w-64">
      <Field>
        <FieldLabel htmlFor="engine">Engine</FieldLabel>
        <Select {...args}>
          <SelectTrigger id="engine" width="fill">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Relational</SelectLabel>
              <SelectItem value="postgres">PostgreSQL</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Key-value</SelectLabel>
              <SelectItem value="redis">Redis</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Engine' }));
    await expect(await screen.findByRole('group', { name: 'Relational' })).toBeVisible();
    await expect(screen.getByRole('group', { name: 'Key-value' })).toBeVisible();
    await expect(screen.getByRole('option', { name: 'PostgreSQL' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack space="md">
      {sizes.map((size) => (
        <div key={size} className="w-64">
          <Field>
            <FieldLabel htmlFor={`region-${size}`}>{size}</FieldLabel>
            <Select {...args}>
              <SelectTrigger id={`region-${size}`} size={size} width="fill">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <RegionItems />
              </SelectContent>
            </Select>
          </Field>
        </div>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) => canvas.getByRole('combobox', { name: size }).getBoundingClientRect().height,
    );
    await expect(heights).toEqual([32, 36]);
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`ghost` sits in a toolbar next to ghost buttons. It shows its fill on hover, on focus, and while the list is open.',
      },
    },
  },
  args: { defaultValue: 'us-east-1' },
  render: (args) => (
    <Inline space="sm">
      {variants.map((variant) => (
        <Select key={variant} {...args}>
          <SelectTrigger aria-label={`Region ${variant}`} variant={variant} size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <RegionItems />
          </SelectContent>
        </Select>
      ))}
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    const ghost = canvas.getByRole('combobox', { name: 'Region ghost' });
    const soft = canvas.getByRole('combobox', { name: 'Region soft' });
    await expect(getComputedStyle(ghost).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(soft).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await userEvent.click(ghost);
    await expect(await screen.findByRole('listbox')).toBeVisible();
    await expect(ghost).toHaveAttribute('data-popup-open');
    await waitFor(() =>
      expect(getComputedStyle(ghost).backgroundColor).toBe(getComputedStyle(soft).backgroundColor),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const Width: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`auto` fits the value. `fill` fills the container, so the container sets a fixed width.',
      },
    },
  },
  args: { defaultValue: 'eu-west-1' },
  render: (args) => (
    <div className="w-72">
      <Stack space="sm">
        <Select {...args}>
          <SelectTrigger aria-label="Auto width">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <RegionItems />
          </SelectContent>
        </Select>
        <Select {...args}>
          <SelectTrigger aria-label="Fill width" width="fill">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <RegionItems />
          </SelectContent>
        </Select>
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const auto = canvas.getByRole('combobox', { name: 'Auto width' }).getBoundingClientRect();
    const fill = canvas.getByRole('combobox', { name: 'Fill width' }).getBoundingClientRect();
    await expect(fill.width).toBe(288);
    await expect(auto.width).toBeLessThan(fill.width);
  },
};

export const LongOption: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The list grows past the trigger width to show a long option in full.',
      },
    },
  },
  args: {
    items: [
      { label: 'Small', value: 'small' },
      { label: 'Dedicated compute with 64 vCPU and 256 GB memory', value: 'xl' },
    ],
    defaultValue: 'small',
  },
  render: (args) => (
    <div className="w-28">
      <Field>
        <FieldLabel htmlFor="machine">Machine</FieldLabel>
        <Select {...args}>
          <SelectTrigger id="machine" width="fill">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="xl">Dedicated compute with 64 vCPU and 256 GB memory</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Machine' });
    await userEvent.click(trigger);
    const option = await screen.findByRole('option', {
      name: 'Dedicated compute with 64 vCPU and 256 GB memory',
    });
    const popup = option.closest('[data-slot=select-content]') as HTMLElement;
    const triggerWidth = trigger.getBoundingClientRect().width;
    await expect(triggerWidth).toBeLessThan(150);
    await waitFor(() =>
      expect(popup.getBoundingClientRect().width).toBeGreaterThan(triggerWidth * 2),
    );
    await expect(option.scrollWidth).toBeLessThanOrEqual(option.clientWidth);
    await expect(popup.scrollWidth).toBeLessThanOrEqual(popup.clientWidth);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-64">
      <Field disabled>
        <FieldLabel htmlFor="region">Region</FieldLabel>
        <Select {...args}>
          <SelectTrigger id="region" width="fill">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <RegionItems />
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div className="w-64">
      <Field invalid>
        <FieldLabel htmlFor="region">Region</FieldLabel>
        <Select {...args}>
          <SelectTrigger id="region" width="fill" aria-invalid aria-describedby="region-error">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <RegionItems />
          </SelectContent>
        </Select>
        <FieldError id="region-error">Choose a region.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Region' });
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription('Choose a region.');
  },
};
