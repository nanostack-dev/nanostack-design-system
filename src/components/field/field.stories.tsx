import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
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
  type FieldOrientation,
} from '@/components/field';
import { Input } from '@/components/input';
import { Switch } from '@/components/switch';

const orientations: FieldOrientation[] = ['vertical', 'horizontal', 'responsive'];

const usage = `
The layout of one form control with its label, description and error. Build every form with it: \`FieldGroup\` holds the fields and sets the space between them, \`FieldSet\` with \`FieldLegend\` names a group, and \`Field\` holds one control.

The props are the whole API. The parts do not accept \`className\` or \`style\`. \`Field\` fills its container, so a wrapper or a layout block sets the width of the form.

## Parts

| Part | Use it for |
| --- | --- |
| \`FieldLabel\` | The name of the control. Next to a checkbox or a radio, it uses the regular weight. Wrap a whole \`Field\` in it to make a choice card. |
| \`FieldDescription\` | A hint under the control. Link it with \`aria-describedby\`. |
| \`FieldError\` | The error message. It is an alert. Give it \`children\`, or \`errors\` from a form library: duplicate messages show once. |
| \`FieldContent\` | Label and description on one side of a horizontal field. |
| \`FieldTitle\` | The title in a choice card, where the whole card is the label. |
| \`FieldSeparator\` | A line between two parts of a form, with an optional word such as "Or". |

## orientation

| Value | Use it for |
| --- | --- |
| \`vertical\` | The default. Label above the control. Every text field, select and textarea. |
| \`horizontal\` | Control and label side by side: a checkbox, a radio, a switch, or a row of form actions. |
| \`responsive\` | Vertical in a narrow \`FieldGroup\`, horizontal when the group is wide. Use it for settings pages that also show in a sheet. |

## invalid and disabled

- \`invalid\` colours the label and the error. Also set \`aria-invalid\` on the control, so the control shows its error border and assistive technology announces it.
- \`disabled\` dims the label. Also set \`disabled\` on the control.

## FieldLabel size and tone

\`FieldLabel\` takes the same \`size\` and \`tone\` as \`Label\`.

| Value | Use it for |
| --- | --- |
| \`size="md"\` | The default. A field in a page, a dialog or a settings form. |
| \`size="sm"\` | A field in a dense tool form, next to \`size="sm"\` controls. |
| \`tone="default"\` | The default. A label that the user reads first. |
| \`tone="muted"\` | A label that the value outranks, in a dense tool form. \`invalid\` still colours it. |

## FieldLegend size

| Value | Use it for |
| --- | --- |
| \`md\` | The default. The title of a section of a form. |
| \`sm\` | The name of a group of checkboxes or radios, where it reads as a label. |

## Do not

- Do not put space between fields with margins. \`FieldGroup\` owns the space.
- Do not colour a description to warn. Use \`FieldError\`, or an \`Alert\` above the form.
- Do not use a plain \`Label\` in a form. Use \`FieldLabel\` in a \`Field\`.
`;

const meta = {
  title: 'Components/Field',
  parameters: { docs: { description: { component: usage } } },
  component: Field,
  argTypes: { orientation: { control: 'select', options: orientations } },
  render: (args) => (
    <div className="w-80">
      <Field {...args}>
        <FieldLabel htmlFor="project-name">Project name</FieldLabel>
        <Input id="project-name" aria-describedby="project-name-description" />
        <FieldDescription id="project-name-description">
          Shown in the sidebar and in shared links.
        </FieldDescription>
      </Field>
    </div>
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
  parameters: {
    docs: {
      description: {
        story:
          'A full form: `FieldSet` names it, `FieldGroup` spaces the fields, and a horizontal `Field` holds the checkbox and the actions.',
      },
    },
  },
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
            <FieldLabel htmlFor="newsletter">Send me product updates</FieldLabel>
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
    const choiceLabel = canvas.getByText('Send me product updates');
    await expect(getComputedStyle(choiceLabel).fontWeight).toBe('400');
    await expect(getComputedStyle(canvas.getByText('Full name')).fontWeight).toBe('500');
  },
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-96">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="notifications">Notifications</FieldLabel>
          <FieldDescription>Email me when a deployment fails.</FieldDescription>
        </FieldContent>
        <Switch id="notifications" />
      </Field>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Notifications' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const ChoiceCard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Wrap a `Field` in a `FieldLabel` to make the whole card the click target.',
      },
    },
  },
  render: () => (
    <div className="w-96">
      <FieldLabel htmlFor="backups">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Daily backups</FieldTitle>
            <FieldDescription>Keep a snapshot for 30 days.</FieldDescription>
          </FieldContent>
          <Checkbox id="backups" />
        </Field>
      </FieldLabel>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(canvas.getByText('Daily backups'));
    await expect(checkbox).toBeChecked();
  },
};

export const CheckboxGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`FieldLegend size="sm"` names a group of checkboxes like a label. `data-slot="checkbox-group"` on the `FieldGroup` puts the options closer together.',
      },
    },
  },
  render: () => (
    <div className="w-64">
      <FieldSet>
        <FieldLegend size="sm">Notify me about</FieldLegend>
        <FieldGroup data-slot="checkbox-group">
          {['Deployments', 'Incidents'].map((topic) => (
            <Field key={topic} orientation="horizontal">
              <Checkbox id={`topic-${topic}`} />
              <FieldLabel htmlFor={`topic-${topic}`}>{topic}</FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </div>
  ),
  play: async ({ canvas }) => {
    const legend = canvas.getByText('Notify me about');
    await expect(getComputedStyle(legend).fontSize).toBe('14px');
    await expect(canvas.getByRole('group', { name: 'Notify me about' })).toBeVisible();
  },
};

export const Invalid: Story = {
  render: () => (
    <div className="w-80">
      <Field invalid>
        <FieldLabel htmlFor="slug">Slug</FieldLabel>
        <Input id="slug" defaultValue="My Project" aria-invalid aria-describedby="slug-error" />
        <FieldError id="slug-error">Use lowercase letters, numbers and dashes.</FieldError>
      </Field>
    </div>
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
    <div className="w-80">
      <Field invalid>
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
    </div>
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
    <div className="w-80">
      <Field disabled>
        <FieldLabel htmlFor="region">Region</FieldLabel>
        <Input id="region" defaultValue="eu-west-1" disabled />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group')).toHaveAttribute('data-disabled', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Region' })).toBeDisabled();
    await expect(canvas.getByText('Region')).toHaveClass(
      'group-data-[disabled=true]/field:text-muted-foreground',
    );
  },
};

export const DenseLabels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`FieldLabel size="sm" tone="muted"` in a dense tool form. An invalid field still colours its label.',
      },
    },
  },
  render: () => (
    <div className="w-72">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="header-name" size="sm" tone="muted">
            Header
          </FieldLabel>
          <Input id="header-name" size="sm" font="mono" defaultValue="Authorization" />
        </Field>
        <Field invalid>
          <FieldLabel htmlFor="header-value" size="sm" tone="muted">
            Value
          </FieldLabel>
          <Input
            id="header-value"
            size="sm"
            font="mono"
            aria-invalid
            aria-describedby="header-value-error"
          />
          <FieldError id="header-value-error">Enter a value.</FieldError>
        </Field>
      </FieldGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const header = canvas.getByText('Header');
    await expect(getComputedStyle(header).fontSize).toBe('12px');
    await expect(header).toHaveClass('text-muted-foreground');
    const value = getComputedStyle(canvas.getByText('Value')).color;
    await expect(value).toBe(getComputedStyle(canvas.getByRole('alert')).color);
    await expect(canvas.getByRole('textbox', { name: 'Value' })).toHaveAccessibleDescription(
      'Enter a value.',
    );
  },
};
