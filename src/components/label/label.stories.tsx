import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';

const usage = `
The accessible name of a form control outside a form layout. Inside a form, use \`FieldLabel\` in a \`Field\`: it adds the invalid colour, the disabled state and the choice-card layout.

The props are the whole API. \`Label\` does not accept \`className\` or \`style\`. It has one look: small, medium weight, and dimmed when its control is disabled.

## Do not

- Do not make a label small and muted to save space. Use \`Field\` in a \`FieldGroup\`, or give the control an \`aria-label\` when the context names it.
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
