import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';

import { Textarea } from './textarea';

const longText = 'This release notes entry keeps going. '.repeat(12).trim();

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { id: 'notes', placeholder: 'Write release notes', onChange: fn() },
  render: (args) => (
    <Field className="w-80">
      <FieldLabel htmlFor="notes">Release notes</FieldLabel>
      <Textarea {...args} />
    </Field>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Release notes' });
    await userEvent.type(textarea, 'First line{Enter}Second line');
    await expect(textarea).toHaveValue('First line\nSecond line');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Release notes' })).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Field data-disabled className="w-80">
      <FieldLabel htmlFor="notes">Release notes</FieldLabel>
      <Textarea {...args} />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Release notes' });
    await expect(textarea).toBeDisabled();
    await userEvent.tab();
    await expect(textarea).not.toHaveFocus();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'notes-error' },
  render: (args) => (
    <Field data-invalid className="w-80">
      <FieldLabel htmlFor="notes">Release notes</FieldLabel>
      <Textarea {...args} />
      <FieldError id="notes-error">Release notes are required.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Release notes' });
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect(textarea).toHaveAccessibleDescription('Release notes are required.');
  },
};

export const LongContent: Story = {
  args: { defaultValue: longText },
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Release notes' });
    await expect(textarea.scrollWidth).toBeLessThanOrEqual(textarea.clientWidth);
    await expect(textarea.getBoundingClientRect().height).toBeGreaterThan(64);
  },
};
