import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';

import { Slider } from './slider';

const meta = {
  title: 'Components/Slider',
  parameters: {
    docs: {
      description: {
        component:
          'A handle on a track to select a value or a range. Use it when an approximate value is enough.\n\n**Nanostack addition:** `value` and `defaultValue` accept a number as well as an array, and `onValueChange` then gives back a number.',
      },
    },
  },
  component: Slider,
  args: { defaultValue: 50, max: 100, step: 1, onValueChange: fn(), 'aria-labelledby': 'volume' },
  render: (args) => (
    <Field className="w-72">
      <FieldLabel id="volume">Volume</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const thumbs = canvas.getAllByRole('slider', { name: 'Volume' });
    await expect(thumbs).toHaveLength(1);
    await expect(thumbs[0]).toHaveValue('50');
  },
};

export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    await userEvent.tab();
    await expect(thumb).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveValue('51');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(51, expect.anything());
    await userEvent.keyboard('{End}');
    await expect(thumb).toHaveValue('100');
    await userEvent.keyboard('{Home}');
    await expect(thumb).toHaveValue('0');
  },
};

export const Range: Story = {
  args: { defaultValue: [20, 80], 'aria-labelledby': 'price' },
  render: (args) => (
    <Field className="w-72">
      <FieldLabel id="price">Price range</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const [lower, upper] = canvas.getAllByRole('slider', { name: 'Price range' });
    await expect(lower).toHaveValue('20');
    await expect(upper).toHaveValue('80');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    await expect(lower).toHaveValue('21');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(upper).toHaveValue('79');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Field className="h-48 w-auto items-center">
      <FieldLabel id="volume">Volume</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    await expect(thumb).toHaveAttribute('aria-orientation', 'vertical');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowUp}');
    await expect(thumb).toHaveValue('51');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { a11y: { test: 'todo' } },
  render: (args) => (
    <Field className="w-72" data-disabled>
      <FieldLabel id="volume">Volume</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    await expect(thumb).toBeDisabled();
    await userEvent.tab();
    await expect(thumb).not.toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { defaultValue: 95, 'aria-invalid': true },
  render: (args) => (
    <Field className="w-72" data-invalid>
      <FieldLabel id="volume">Volume</FieldLabel>
      <Slider {...args} />
      <FieldError>Volume above 90 can damage hearing.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole('slider', { name: 'Volume' }).closest('[data-slot=field]');
    await expect(field).toHaveAttribute('data-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Volume above 90 can damage hearing.',
    );
  },
};

export const WithDescription: Story = {
  args: { 'aria-describedby': 'volume-description' },
  render: (args) => (
    <Field className="w-72">
      <FieldLabel id="volume">Volume</FieldLabel>
      <Slider {...args} />
      <FieldDescription id="volume-description">Applies to every speaker.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider', { name: 'Volume' })).toBeVisible();
  },
};
