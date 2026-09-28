import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/field';
import { Switch } from '@/components/switch';

const usage = `
A switch that turns a setting on or off at once. Use it for a setting that applies without a save button. For a choice that a form sends with its other values, use \`Checkbox\`.

The props are the whole API. \`Switch\` does not accept \`className\` or \`style\`, and it has one size and no variants.

## Other props

- \`checked\`, \`defaultChecked\` and \`onCheckedChange\`: the state. \`onCheckedChange\` gives a boolean.
- \`disabled\`, \`aria-invalid\` and \`aria-describedby\`: set \`disabled\` or \`invalid\` on the \`Field\` too, so the label follows.

## Do not

- Do not use a switch in a form that has a save button. Use \`Checkbox\`.
- Do not name the switch with its state ("On", "Off"). Name the setting.
- Do not put the switch before its label. Put the \`FieldLabel\` first in a \`Field orientation="horizontal"\`.
`;

const meta = {
  title: 'Components/Switch',
  parameters: { docs: { description: { component: usage } } },
  component: Switch,
  args: { id: 'airplane', onCheckedChange: fn() },
  render: (args) => (
    <div className="w-64">
      <Field orientation="horizontal">
        <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
        <Switch {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(toggle).toBeChecked();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).not.toBeChecked();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-64">
      <Field orientation="horizontal" disabled>
        <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
        <Switch {...args} />
      </Field>
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'airplane-error' },
  render: (args) => (
    <div className="w-80">
      <Field orientation="horizontal" invalid>
        <FieldContent>
          <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
          <FieldError id="airplane-error">Turn this on before boarding.</FieldError>
        </FieldContent>
        <Switch {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await expect(toggle).toHaveAttribute('aria-invalid', 'true');
    await expect(toggle).toHaveAccessibleDescription('Turn this on before boarding.');
  },
};

export const WithDescription: Story = {
  args: { defaultChecked: true, 'aria-describedby': 'airplane-description' },
  render: (args) => (
    <div className="w-80">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor={args.id}>Airplane mode</FieldLabel>
          <FieldDescription id="airplane-description">Turns off every radio.</FieldDescription>
        </FieldContent>
        <Switch {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Airplane mode' });
    await expect(toggle).toBeChecked();
    await expect(toggle).toHaveAccessibleDescription('Turns off every radio.');
  },
};
