import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

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

import { Checkbox } from './checkbox';

const meta = {
  title: 'Components/Checkbox',
  parameters: {
    docs: {
      description: {
        component:
          'A box that turns one option on or off. Use it for independent choices and for agreement to terms.',
      },
    },
  },
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
    <Field orientation="horizontal" data-disabled>
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
    <Field orientation="horizontal" data-invalid>
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
      <FieldLegend variant="label">Notify me about</FieldLegend>
      <FieldDescription>Select all that apply.</FieldDescription>
      <FieldGroup className="gap-3">
        {['Deployments', 'Incidents', 'Billing'].map((topic) => (
          <Field key={topic} orientation="horizontal">
            <Checkbox id={`topic-${topic}`} defaultChecked={topic === 'Incidents'} />
            <FieldLabel htmlFor={`topic-${topic}`} className="font-normal">
              {topic}
            </FieldLabel>
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
