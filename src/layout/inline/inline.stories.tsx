import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';

import { Inline } from './inline';

const usage = `
Places children in a row with even space, and wraps them onto the next line when the row is full. Use it for button rows, tags, and toolbars.

| Prop | Values | Use it for |
| --- | --- | --- |
| \`space\` | the spacing scale, default \`sm\` (8 px) | \`xs\` for tags and chips, \`sm\` for buttons, \`md\` for toolbars with groups. |
| \`align\` | \`start\` (default), \`center\`, \`end\` | \`end\` for the actions of a form or a dialog. |
| \`alignY\` | \`center\` (default), \`start\`, \`end\`, \`baseline\` | \`baseline\` when text of different sizes sits in one row. |
| \`wrap\` | \`true\` (default), \`false\` | \`false\` only when the row must scroll or truncate instead. |
`;

const meta = {
  title: 'Layout/Inline',
  component: Inline,
  parameters: { docs: { description: { component: usage } } },
  args: { space: 'sm' },
  render: (args) => (
    <Inline {...args}>
      <Button>Cancel</Button>
      <Button variant="solid" tone="brand">
        Save
      </Button>
    </Inline>
  ),
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const cancel = canvas.getByRole('button', { name: 'Cancel' }).getBoundingClientRect();
    const save = canvas.getByRole('button', { name: 'Save' }).getBoundingClientRect();
    await expect(Math.round(save.left - cancel.right)).toBe(8);
  },
};

export const AlignEnd: Story = {
  args: { align: 'end' },
  render: (args) => (
    <div className="w-96">
      <Inline {...args}>
        <Button>Cancel</Button>
        <Button variant="solid" tone="brand">
          Save
        </Button>
      </Inline>
    </div>
  ),
};
