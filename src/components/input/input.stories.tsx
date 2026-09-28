import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';

import { Input } from './input';

const meta = {
  title: 'Components/Input',
  parameters: {
    docs: {
      description: { component: 'A one-line text field. Use it inside a `Field` with a label.' },
    },
  },
  component: Input,
  args: { id: 'email', type: 'email', placeholder: 'you@example.com', onChange: fn() },
  render: (args) => (
    <Field className="w-72">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input {...args} />
    </Field>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await userEvent.type(input, 'ada@example.com');
    await expect(input).toHaveValue('ada@example.com');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Field data-disabled className="w-72">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input {...args} />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toBeDisabled();
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'email-error', defaultValue: 'ada@' },
  render: (args) => (
    <Field data-invalid className="w-72">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input {...args} />
      <FieldError id="email-error">Enter a complete email address.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Enter a complete email address.');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a complete email address.');
  },
};

export const WithDescription: Story = {
  args: { 'aria-describedby': 'email-description' },
  render: (args) => (
    <Field className="w-72">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input {...args} />
      <FieldDescription id="email-description">We send receipts to this address.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'We send receipts to this address.',
    );
  },
};

export const File: Story = {
  args: { id: 'avatar', type: 'file', placeholder: undefined },
  render: (args) => (
    <Field className="w-72">
      <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
      <Input {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Avatar')).toHaveAttribute('type', 'file');
  },
};
