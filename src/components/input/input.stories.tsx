import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';
import { Input, type InputFont, type InputSize, type InputVariant } from '@/components/input';
import { Stack } from '@/layout/stack';

const variants: InputVariant[] = ['soft', 'ghost'];
const sizes: InputSize[] = ['sm', 'md'];
const fonts: InputFont[] = ['sans', 'mono'];

const usage = `
A one-line text field. Put it in a \`Field\` with a \`FieldLabel\`. For an icon, a unit or a button inside the border, use \`InputGroup\`. For more than one line, use \`Textarea\`.

The props are the whole API. \`Input\` does not accept \`className\` or \`style\`. It fills the width of its container, so a layout block or a wrapper sets its width.

## variant: how the field sits on the surface

| Value | Use it for |
| --- | --- |
| \`soft\` | The default. Every field in a form, a dialog, or a filter bar. |
| \`ghost\` | A value that people edit in place: a cell in an editable table, or a title in a toolbar. The fill shows on hover and on focus. |

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense place: a panel filter, a search in a side rail, a row in a key-value editor. It lines up with a \`sm\` button. |
| \`md\` | 36 px | The default. Forms and dialogs. It lines up with a \`md\` button. |

## font

| Value | Use it for |
| --- | --- |
| \`sans\` | The default. Names, descriptions, email addresses, and any text a person reads. |
| \`mono\` | A value that a machine reads: a key, a cron expression, a JSON path, a node id, a header name. The text is one step smaller, because monospace glyphs are wider. |

## Other props

- All the props of the native \`input\` element: \`type\`, \`value\`, \`onChange\`, \`placeholder\`, \`readOnly\`, \`disabled\`, \`aria-*\`.
- \`aria-invalid\` shows the error border. Put the message in a \`FieldError\` and link it with \`aria-describedby\`.

## Do not

- Do not put an icon over the input with absolute positioning. Use \`InputGroup\` with an \`InputGroupAddon\`.
- Do not use \`ghost\` for a field in a form. People cannot see where to type.
- Do not use \`mono\` for text that people read, such as a name or a description.
- Do not set the width on the input. Set it on the container.
`;

const meta = {
  title: 'Components/Input',
  parameters: { docs: { description: { component: usage } } },
  component: Input,
  args: { id: 'email', type: 'email', placeholder: 'you@example.com', onChange: fn() },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    font: { control: 'select', options: fonts },
  },
  render: (args) => (
    <div className="w-72">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input {...args} />
      </Field>
    </div>
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Each size has the same height as the `Button` of the same size.',
      },
    },
  },
  render: (args) => (
    <div className="w-72">
      <Stack space="md">
        {sizes.map((size) => (
          <Field key={size}>
            <FieldLabel htmlFor={`name-${size}`}>{`Size ${size}`}</FieldLabel>
            <Input {...args} id={`name-${size}`} type="text" size={size} placeholder="Checkout" />
          </Field>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) =>
        canvas.getByRole('textbox', { name: `Size ${size}` }).getBoundingClientRect().height,
    );
    await expect(heights).toEqual([32, 36]);
  },
};

export const Mono: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `font="mono"` for a value that a machine reads, such as a cron expression.',
      },
    },
  },
  args: { id: 'cron', type: 'text', font: 'mono', defaultValue: '*/15 * * * *', placeholder: '' },
  render: (args) => (
    <div className="w-72">
      <Field>
        <FieldLabel htmlFor="cron">Cron expression</FieldLabel>
        <Input {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Cron expression' });
    await expect(getComputedStyle(input).fontFamily).toContain('Geist Mono');
  },
};

export const Ghost: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A `ghost` input has no fill until a person points at it or focuses it. Use it to edit a value in place, such as a key in a table row.',
      },
    },
  },
  args: {
    id: undefined,
    type: 'text',
    variant: 'ghost',
    font: 'mono',
    size: 'sm',
    defaultValue: 'API_URL',
    placeholder: 'KEY',
    'aria-label': 'Variable key',
  },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Variable key' });
    await expect(getComputedStyle(input).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await expect(getComputedStyle(input).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
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
    <div className="w-72">
      <Field disabled>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input {...args} />
      </Field>
    </div>
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
    <div className="w-72">
      <Field invalid>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input {...args} />
        <FieldError id="email-error">Enter a complete email address.</FieldError>
      </Field>
    </div>
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
    <div className="w-72">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input {...args} />
        <FieldDescription id="email-description">
          We send receipts to this address.
        </FieldDescription>
      </Field>
    </div>
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
    <div className="w-72">
      <Field>
        <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
        <Input {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Avatar')).toHaveAttribute('type', 'file');
  },
};
