import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';
import { Slider } from '@/components/slider';

const usage = `
A handle on a track that sets a value or a range. Use it when an approximate value is enough, such as a volume or a sample rate. For an exact number, use \`Input type="number"\`.

The props are the whole API. \`Slider\` does not accept \`className\` or \`style\`, and it has no variants. A horizontal slider fills its container. A vertical slider fills the height of its container.

## Other props

- \`value\`, \`defaultValue\` and \`onValueChange\`: a number gives one handle and a number back. An array gives one handle per value and an array back.
- \`min\`, \`max\` and \`step\`: the scale. The default is 0 to 100.
- \`orientation="vertical"\`: a vertical track, 160 px high at least.
- Name the slider with \`aria-labelledby\` and the id of its \`FieldLabel\`.

## Do not

- Do not use a slider for an exact value. Use \`Input type="number"\`.
- Do not show a slider without its current value when the value matters. Show the value in the label or next to the slider.
`;

const meta = {
  title: 'Components/Slider',
  parameters: { docs: { description: { component: usage } } },
  component: Slider,
  args: { defaultValue: 50, max: 100, step: 1, onValueChange: fn(), 'aria-labelledby': 'volume' },
  render: (args) => (
    <div className="w-72">
      <Field>
        <FieldLabel id="volume">Volume</FieldLabel>
        <Slider {...args} />
      </Field>
    </div>
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
  parameters: {
    docs: {
      description: { story: 'An array value gives one handle per value, for a range.' },
    },
  },
  args: { defaultValue: [20, 80], 'aria-labelledby': 'price' },
  render: (args) => (
    <div className="w-72">
      <Field>
        <FieldLabel id="price">Price range</FieldLabel>
        <Slider {...args} />
      </Field>
    </div>
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
    <div className="flex h-48 w-fit">
      <Field>
        <FieldLabel id="volume">Volume</FieldLabel>
        <Slider {...args} />
      </Field>
    </div>
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
    <div className="w-72">
      <Field disabled>
        <FieldLabel id="volume">Volume</FieldLabel>
        <Slider {...args} />
      </Field>
    </div>
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
    <div className="w-72">
      <Field invalid>
        <FieldLabel id="volume">Volume</FieldLabel>
        <Slider {...args} />
        <FieldError>Volume above 90 can damage hearing.</FieldError>
      </Field>
    </div>
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
    <div className="w-72">
      <Field>
        <FieldLabel id="volume">Volume</FieldLabel>
        <Slider {...args} />
        <FieldDescription id="volume-description">Applies to every speaker.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider', { name: 'Volume' })).toBeVisible();
  },
};
