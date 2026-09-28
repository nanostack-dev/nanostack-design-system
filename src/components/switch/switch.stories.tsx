import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/field';

import { Switch, type SwitchSize } from './switch';

const sizes: SwitchSize[] = ['sm', 'default'];

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { id: 'airplane', onCheckedChange: fn() },
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => (
    <Field orientation="horizontal" className="w-64">
      <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
      <Switch {...args} />
    </Field>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(toggle).toBeChecked();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).not.toBeChecked();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <Field key={size} orientation="horizontal" className="w-64">
          <FieldLabel htmlFor={`switch-${size}`}>{size}</FieldLabel>
          <Switch {...args} id={`switch-${size}`} size={size} />
        </Field>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const small = canvas.getByRole('switch', { name: 'sm' }).getBoundingClientRect();
    const regular = canvas.getByRole('switch', { name: 'default' }).getBoundingClientRect();
    await expect(small.height).toBeLessThan(regular.height);
    await expect(small.width).toBeLessThan(regular.width);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Field orientation="horizontal" className="w-64" data-disabled>
      <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
      <Switch {...args} />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'airplane-error' },
  render: (args) => (
    <Field orientation="horizontal" className="w-80" data-invalid>
      <FieldContent>
        <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
        <FieldError id="airplane-error">Turn this on before boarding.</FieldError>
      </FieldContent>
      <Switch {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await expect(toggle).toHaveAttribute('aria-invalid', 'true');
    await expect(toggle).toHaveAccessibleDescription('Turn this on before boarding.');
  },
};

export const WithDescription: Story = {
  args: { defaultChecked: true, 'aria-describedby': 'airplane-description' },
  render: (args) => (
    <Field orientation="horizontal" className="w-80">
      <FieldContent>
        <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
        <FieldDescription id="airplane-description">Turns off every radio.</FieldDescription>
      </FieldContent>
      <Switch {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await expect(toggle).toBeChecked();
    await expect(toggle).toHaveAccessibleDescription('Turns off every radio.');
  },
};
