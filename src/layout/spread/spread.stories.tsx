import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';
import { Heading } from '@/components/heading';

import { Spread } from './spread';

const usage = `
Pushes its children to opposite ends. Use it for a title with an action, or a label with a value.

| Prop | Values | Use it for |
| --- | --- | --- |
| \`space\` | the spacing scale, default \`sm\` | The smallest gap when the row gets narrow. |
| \`direction\` | \`horizontal\` (default), \`vertical\` | \`vertical\` for a panel whose footer sits at the bottom. |
| \`alignY\` | \`center\` (default), \`start\`, \`end\`, \`baseline\` | \`baseline\` for a heading and a text action. |
`;

const meta = {
  title: 'Layout/Spread',
  component: Spread,
  parameters: { docs: { description: { component: usage } } },
  render: (args) => (
    <div className="w-96">
      <Spread {...args}>
        <Heading level={3}>Webhooks</Heading>
        <Button size="sm">View all</Button>
      </Spread>
    </div>
  ),
} satisfies Meta<typeof Spread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot=spread]')!.getBoundingClientRect();
    const button = canvas.getByRole('button', { name: 'View all' }).getBoundingClientRect();
    await expect(Math.round(button.right)).toBe(Math.round(row.right));
  },
};
