import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';
import { Textarea, type TextareaFont } from '@/components/textarea';

const fonts: TextareaFont[] = ['sans', 'mono'];
const longText = 'This release notes entry keeps going. '.repeat(12).trim();

const usage = `
A text field for more than one line: a comment, a description, release notes, or a request body. Put it in a \`Field\` with a \`FieldLabel\`. For one line, use \`Input\`. For a composer with a send button inside the border, use \`InputGroupTextarea\`.

The props are the whole API. \`Textarea\` does not accept \`className\` or \`style\`. It grows with its content and fills the width of its container. Set the first height with \`rows\`.

## font

| Value | Use it for |
| --- | --- |
| \`sans\` | The default. Text that a person reads. |
| \`mono\` | Text that a machine reads: a JSON body, a script, a list of headers. The text is one step smaller, because monospace glyphs are wider. |

## Do not

- Do not use a \`Textarea\` for a value that must stay on one line, such as a URL.
- Do not use \`mono\` for prose.
- Do not remove the border to put the field in a custom box. Use \`InputGroup\` with \`InputGroupTextarea\`.
`;

const meta = {
  title: 'Components/Textarea',
  parameters: { docs: { description: { component: usage } } },
  component: Textarea,
  args: { id: 'notes', placeholder: 'Write release notes', onChange: fn() },
  argTypes: { font: { control: 'select', options: fonts } },
  render: (args) => (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="notes">Release notes</FieldLabel>
        <Textarea {...args} />
      </Field>
    </div>
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

export const Mono: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `font="mono"` for a body that a machine reads, such as JSON.' },
    },
  },
  args: {
    id: 'body',
    font: 'mono',
    rows: 6,
    placeholder: undefined,
    defaultValue: '{\n  "event": "deployment.failed",\n  "retry": true\n}',
  },
  render: (args) => (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="body">Request body</FieldLabel>
        <Textarea {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Request body' });
    await expect(getComputedStyle(textarea).fontFamily).toContain('Geist Mono');
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
    <div className="w-80">
      <Field disabled>
        <FieldLabel htmlFor="notes">Release notes</FieldLabel>
        <Textarea {...args} />
      </Field>
    </div>
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
    <div className="w-80">
      <Field invalid>
        <FieldLabel htmlFor="notes">Release notes</FieldLabel>
        <Textarea {...args} />
        <FieldError id="notes-error">Release notes are required.</FieldError>
      </Field>
    </div>
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
