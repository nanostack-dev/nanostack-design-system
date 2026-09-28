import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  type NativeSelectSize,
} from './native-select';

const sizes: NativeSelectSize[] = ['sm', 'default'];

const meta = {
  title: 'Components/Native Select',
  component: NativeSelect,
  args: { id: 'region', defaultValue: 'eu-west-1', onChange: fn() },
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => (
    <Field className="w-64">
      <FieldLabel htmlFor={args.id}>Region</FieldLabel>
      <NativeSelect {...args}>
        <NativeSelectOption value="us-east-1">US East</NativeSelectOption>
        <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
        <NativeSelectOption value="ap-south-1">Asia Pacific South</NativeSelectOption>
      </NativeSelect>
    </Field>
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
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <Field key={size} className="w-64">
          <FieldLabel htmlFor={`region-${size}`}>{size}</FieldLabel>
          <NativeSelect {...args} id={`region-${size}`} size={size}>
            <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
          </NativeSelect>
        </Field>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const small = canvas.getByRole('combobox', { name: 'sm' }).getBoundingClientRect().height;
    const regular = canvas
      .getByRole('combobox', { name: 'default' })
      .getBoundingClientRect().height;
    await expect(small).toBeLessThan(regular);
  },
};

export const Groups: Story = {
  render: (args) => (
    <Field className="w-64">
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
    <Field className="w-64" data-invalid>
      <FieldLabel htmlFor={args.id}>Region</FieldLabel>
      <NativeSelect {...args}>
        <NativeSelectOption value="eu-west-1">EU West</NativeSelectOption>
      </NativeSelect>
      <FieldError id="region-error">This region is at capacity.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole('combobox', { name: 'Region' });
    await expect(select).toHaveAttribute('aria-invalid', 'true');
    await expect(select).toHaveAccessibleDescription('This region is at capacity.');
  },
};
