import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  type NativeSelectSize,
} from '@/components/native-select';
import { Stack } from '@/layout/stack';

const sizes: NativeSelectSize[] = ['sm', 'md'];

const usage = `
The select element of the browser, with the system style. Use it on a mobile form, or for a short list of plain text options where the native picker is enough. For a list with search, icons or descriptions, use \`Select\` or \`Combobox\`.

Compose it from \`NativeSelectOption\` and, for sections, \`NativeSelectOptGroup\`. The props are the whole API. The parts do not accept \`className\` or \`style\`.

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense toolbar or a filter row, next to a \`sm\` input or button. |
| \`md\` | 36 px | The default. Forms and dialogs. |

## Do not

- Do not style the options. The browser draws the list.
- Do not use it for more than about fifteen options. Use \`Combobox\`, so people can search.
`;

const meta = {
  title: 'Components/Native Select',
  parameters: { docs: { description: { component: usage } } },
  component: NativeSelect,
  args: { id: 'region', defaultValue: 'eu-west-1', onChange: fn() },
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => (
    <div className="w-64">
      <Field>
        <FieldLabel htmlFor={args.id}>Region</FieldLabel>
        <NativeSelect {...args}>
          <NativeSelectOption value="us-east-1">US East</NativeSelectOption>
          <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
          <NativeSelectOption value="ap-south-1">Asia Pacific South</NativeSelectOption>
        </NativeSelect>
      </Field>
    </div>
  ),
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const select = canvas.getByRole('combobox', { name: 'Region' });
    await expect(select).toHaveValue('eu-west-1');
    await userEvent.selectOptions(select, 'US East');
    await expect(select).toHaveValue('us-east-1');
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole('combobox', { name: 'Region' });
    await userEvent.tab();
    await expect(select).toHaveFocus();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="w-64">
      <Stack space="md">
        {sizes.map((size) => (
          <Field key={size}>
            <FieldLabel htmlFor={`region-${size}`}>{size}</FieldLabel>
            <NativeSelect {...args} id={`region-${size}`} size={size}>
              <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
            </NativeSelect>
          </Field>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const small = canvas.getByRole('combobox', { name: 'sm' }).getBoundingClientRect().height;
    const regular = canvas.getByRole('combobox', { name: 'md' }).getBoundingClientRect().height;
    await expect(small).toBeLessThan(regular);
  },
};

export const Groups: Story = {
  render: (args) => (
    <div className="w-64">
      <Field>
        <FieldLabel htmlFor={args.id}>Region</FieldLabel>
        <NativeSelect {...args}>
          <NativeSelectOptGroup label="Americas">
            <NativeSelectOption value="us-east-1">US East</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Europe">
            <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('group').map((group) => group.getAttribute('label'))).toEqual(
      expect.arrayContaining(['Americas', 'Europe']),
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole('combobox', { name: 'Region' });
    await expect(select).toBeDisabled();
    await userEvent.tab();
    await expect(select).not.toHaveFocus();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'region-error' },
  render: (args) => (
    <div className="w-64">
      <Field invalid>
        <FieldLabel htmlFor={args.id}>Region</FieldLabel>
        <NativeSelect {...args}>
          <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
        </NativeSelect>
        <FieldError id="region-error">This region is at capacity.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole('combobox', { name: 'Region' });
    await expect(select).toHaveAttribute('aria-invalid', 'true');
    await expect(select).toHaveAccessibleDescription('This region is at capacity.');
  },
};
