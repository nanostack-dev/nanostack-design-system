import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Checkbox } from '@/components/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/field';

const usage = `
A box that turns one option on or off. Use it for an independent choice, for the selection of rows in a table, and for agreement to terms. For a setting that applies at once, use \`Switch\`. For one choice out of a few, use \`RadioGroup\`.

The props are the whole API. \`Checkbox\` does not accept \`className\` or \`style\`, and it has no variants: every checkbox looks the same.

## Other props

- \`checked\`, \`defaultChecked\` and \`onCheckedChange\`: the state. \`onCheckedChange\` gives a boolean.
- \`indeterminate\`: the "some rows are selected" state of a select-all checkbox.
- \`disabled\`, \`aria-invalid\` and \`aria-describedby\`: set \`disabled\` or \`invalid\` on the \`Field\` too, so the label follows.

## Do not

- Do not put a checkbox next to loose text. Put it in a \`Field orientation="horizontal"\` with a \`FieldLabel\`, or give it an \`aria-label\`.
- Do not move the checkbox with a margin to line it up with the label. \`Field\` lines them up.
- Do not use a checkbox for a setting that applies at once, without a save button. Use \`Switch\`.
`;

const meta = {
  title: 'Components/Checkbox',
  parameters: { docs: { description: { component: usage } } },
  component: Checkbox,
  args: { id: 'terms', onCheckedChange: fn() },
  render: (args) => (
    <Field orientation="horizontal">
      <Checkbox {...args} />
      <FieldLabel htmlFor={args.id}>Accept the terms</FieldLabel>
    </Field>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    await userEvent.click(canvas.getByText('Accept the terms'));
    await expect(checkbox).not.toBeChecked();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Accept the terms' })).toBeChecked();
  },
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `indeterminate` on a select-all checkbox when only some rows are selected.',
      },
    },
  },
  args: { indeterminate: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Accept the terms' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Field orientation="horizontal" disabled>
      <Checkbox {...args} />
      <FieldLabel htmlFor={args.id}>Accept the terms</FieldLabel>
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'terms-error' },
  render: (args) => (
    <Field orientation="horizontal" invalid>
      <Checkbox {...args} />
      <FieldContent>
        <FieldLabel htmlFor={args.id}>Accept the terms</FieldLabel>
        <FieldError id="terms-error">You must accept the terms to continue.</FieldError>
      </FieldContent>
    </Field>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    await expect(checkbox).toHaveAccessibleDescription('You must accept the terms to continue.');
  },
};

export const Group: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend size="sm">Notify me about</FieldLegend>
      <FieldDescription>Select all that apply.</FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {['Deployments', 'Incidents', 'Billing'].map((topic) => (
          <Field key={topic} orientation="horizontal">
            <Checkbox id={`topic-${topic}`} defaultChecked={topic === 'Incidents'} />
            <FieldLabel htmlFor={`topic-${topic}`}>{topic}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Notify me about' })).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'Deployments' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'Incidents' })).toHaveFocus();
    await expect(canvas.getByRole('checkbox', { name: 'Incidents' })).toBeChecked();
  },
};
