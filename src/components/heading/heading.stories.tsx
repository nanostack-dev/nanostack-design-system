import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Stack } from '@/layout/stack';

import { Heading } from './heading';

const usage = `
A title. \`level\` sets both the element (\`h1\` to \`h4\`) and the size, so the outline of the page and its look stay in step.

| Level | Size | Use it for |
| --- | --- | --- |
| \`1\` | 24 px | The page title. One per page. |
| \`2\` | 20 px | A page section. |
| \`3\` | 18 px | A card or panel title. |
| \`4\` | 16 px | A group inside a card. |

Do not skip a level to get a smaller size. If the size is wrong for the outline, the layout needs a change, not the heading.
`;

const meta = {
  title: 'Components/Heading',
  component: Heading,
  parameters: { docs: { description: { component: usage } } },
  args: { level: 1, children: 'Workspace pulse' },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Workspace pulse' })).toBeVisible();
  },
};

export const Levels: Story = {
  render: () => (
    <Stack space="sm">
      <Heading level={1}>Level 1 page title</Heading>
      <Heading level={2}>Level 2 section</Heading>
      <Heading level={3}>Level 3 card title</Heading>
      <Heading level={4}>Level 4 group</Heading>
    </Stack>
  ),
};
