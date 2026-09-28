import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Box } from './box';

const usage = `
The one open part of the system. \`Box\` accepts \`className\` and \`style\` and renders the element you choose with \`as\`.

Use it only inside the definition file of a product component that needs a look no component gives, for example a flow canvas node. Style it with design tokens only (\`bg-card\`, \`border-border\`, \`text-muted-foreground\`). A page never uses \`Box\`: it composes components and layout blocks.

If two products build the same thing with \`Box\`, it belongs in the design system.
`;

const meta = {
  title: 'Layout/Box',
  component: Box,
  parameters: { docs: { description: { component: usage } } },
  render: () => (
    <Box
      as="section"
      aria-label="Run summary"
      className="rounded-xl border border-border bg-card p-4 text-sm"
    >
      A product component surface
    </Box>
  ),
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Run summary' })).toHaveAttribute(
      'data-slot',
      'box',
    );
  },
};
