import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Switch } from '@/components/switch';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './field';

const meta = {
  title: 'Components/Field',
  parameters: {
    docs: {
      description: {
        component:
          'The layout of one form control with its label, description and error. Use `FieldGroup`, `FieldSet` and `Field` for every form.',
      },
    },
  },
  component: Field,
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel htmlFor="project-name">Project name</FieldLabel>
      <Input id="project-name" aria-describedby="project-name-description" />
      <FieldDescription id="project-name-description">
        Shown in the sidebar and in shared links.
      </FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group')).toHaveAttribute('data-orientation', 'vertical');
    await expect(canvas.getByRole('textbox', { name: 'Project name' })).toHaveAccessibleDescription(
      'Shown in the sidebar and in shared links.',
    );
  },
};

export const Form: Story = {
  render: () => (
    <form className="w-96" onSubmit={(event) => event.preventDefault()}>
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldDescription>These details appear on your public page.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="full-name">Full name</FieldLabel>
            <Input id="full-name" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="work-email">Work email</FieldLabel>
            <Input id="work-email" type="email" autoComplete="email" />
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field orientation="horizontal">
            <Checkbox id="newsletter" />
            <FieldLabel htmlFor="newsletter" className="font-normal">
              Send me product updates
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Button variant="solid" tone="brand" type="submit">
              Save
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Profile' })).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Full name' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Work email' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'Send me product updates' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('checkbox', { name: 'Send me product updates' })).toBeChecked();
  },
};

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-96">
      <FieldContent>
        <FieldLabel htmlFor="notifications">Notifications</FieldLabel>
        <FieldDescription>Email me when a deployment fails.</FieldDescription>
      </FieldContent>
      <Switch id="notifications" />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Notifications' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const ChoiceCard: Story = {
  render: () => (
    <FieldLabel htmlFor="backups" className="w-96">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Daily backups</FieldTitle>
          <FieldDescription>Keep a snapshot for 30 days.</FieldDescription>
        </FieldContent>
        <Checkbox id="backups" />
      </Field>
    </FieldLabel>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(canvas.getByText('Daily backups'));
    await expect(checkbox).toBeChecked();
  },
};

export const Invalid: Story = {
  render: () => (
    <Field data-invalid className="w-80">
      <FieldLabel htmlFor="slug">Slug</FieldLabel>
      <Input id="slug" defaultValue="My Project" aria-invalid aria-describedby="slug-error" />
      <FieldError id="slug-error">Use lowercase letters, numbers and dashes.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group')).toHaveAttribute('data-invalid', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Slug' })).toHaveAccessibleDescription(
      'Use lowercase letters, numbers and dashes.',
    );
    const label = getComputedStyle(canvas.getByText('Slug')).color;
    const error = getComputedStyle(canvas.getByRole('alert')).color;
    await expect(label).toBe(error);
  },
};

export const ErrorList: Story = {
  render: () => (
    <Field data-invalid className="w-80">
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <Input id="password" type="password" aria-invalid />
      <FieldError
        errors={[
          { message: 'Use at least 12 characters.' },
          { message: 'Include a number.' },
          { message: 'Include a number.' },
        ]}
      />
    </Field>
  ),
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(items.map((item) => item.textContent)).toEqual([
      'Use at least 12 characters.',
      'Include a number.',
    ]);
  },
};

export const Disabled: Story = {
  render: () => (
    <Field data-disabled className="w-80">
      <FieldLabel htmlFor="region">Region</FieldLabel>
      <Input id="region" defaultValue="eu-west-1" disabled />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Region' })).toBeDisabled();
    await expect(getComputedStyle(canvas.getByText('Region')).opacity).toBe('0.5');
  },
};
