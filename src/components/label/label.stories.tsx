import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Label, type LabelSize, type LabelTone } from '@/components/label';
import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';

const sizes: LabelSize[] = ['sm', 'md'];
const tones: LabelTone[] = ['default', 'muted'];

const usage = `
The accessible name of a form control outside a form layout. Inside a form, use \`FieldLabel\` in a \`Field\`: it adds the invalid colour, the disabled state and the choice-card layout. \`FieldLabel\` takes the same \`size\` and \`tone\`.

The props are the whole API. \`Label\` does not accept \`className\` or \`style\`. It is medium weight, and dimmed when its control is disabled.

## size

| Value | Use it for |
| --- | --- |
| \`md\` | The default. A label in a page, a dialog or a settings form. |
| \`sm\` | A label in a dense tool form, such as the auth fields of a request editor, where the controls are \`size="sm"\`. |

## tone

| Value | Use it for |
| --- | --- |
| \`default\` | The default. A label that the user reads first. |
| \`muted\` | A label that the value outranks, in a dense tool form. Use it with \`size="sm"\`. |

## Do not

- Do not use \`size="sm"\` in a page form to save space. Use \`Field\` in a \`FieldGroup\`, or give the control an \`aria-label\` when the context names it.
- Do not use \`tone="muted"\` for a required field or an error. The invalid colour comes from \`Field invalid\`.
- Do not use a \`Label\` as a heading for a group of controls. Use \`FieldSet\` with \`FieldLegend\`.
- Do not hide a label with a class. Give the control an \`aria-label\` instead.
`;

const meta = {
  title: 'Components/Label',
  parameters: { docs: { description: { component: usage } } },
  component: Label,
  args: { htmlFor: 'username', children: 'Username' },
  render: (args) => (
    <div className="w-64">
      <Stack space="sm">
        <Label {...args} />
        <Input id="username" />
      </Stack>
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Username'));
    await expect(canvas.getByRole('textbox', { name: 'Username' })).toHaveFocus();
  },
};

export const WithCheckbox: Story = {
  args: { htmlFor: 'terms', children: 'Accept the terms' },
  render: (args) => (
    <Inline space="sm">
      <Checkbox id="terms" />
      <Label {...args} />
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await userEvent.click(canvas.getByText('Accept the terms'));
    await expect(checkbox).toBeChecked();
  },
};

export const SizesAndTones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Rows are sizes, columns are tones. `size="sm"` with `tone="muted"` is the label of a dense tool form.',
      },
    },
  },
  render: () => (
    <Stack space="md">
      {sizes.map((size) => (
        <Inline key={size} space="lg">
          {tones.map((tone) => (
            <Stack key={tone} space="xs">
              <Label htmlFor={`${size}-${tone}`} size={size} tone={tone}>
                {`Label ${size} ${tone}`}
              </Label>
              <Input id={`${size}-${tone}`} size="sm" />
            </Stack>
          ))}
        </Inline>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const fontSize = (name: string) => getComputedStyle(canvas.getByText(name)).fontSize;
    await expect(fontSize('Label sm default')).toBe('12px');
    await expect(fontSize('Label md default')).toBe('14px');
    await expect(canvas.getByText('Label sm muted')).toHaveClass('text-muted-foreground');
    await expect(canvas.getByText('Label md default')).not.toHaveClass('text-muted-foreground');
  },
};

export const DenseToolForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The auth fields of a request editor. Small muted labels let the values lead, and each label still names its control.',
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Stack space="sm">
        <Stack space="xs">
          <Label htmlFor="auth-key" size="sm" tone="muted">
            Key
          </Label>
          <Input id="auth-key" size="sm" font="mono" defaultValue="X-API-Key" />
        </Stack>
        <Stack space="xs">
          <Label htmlFor="auth-value" size="sm" tone="muted">
            Value
          </Label>
          <Input id="auth-value" size="sm" font="mono" defaultValue="{{api_key}}" />
        </Stack>
      </Stack>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Value'));
    await expect(canvas.getByRole('textbox', { name: 'Value' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Key' })).toHaveValue('X-API-Key');
  },
};
