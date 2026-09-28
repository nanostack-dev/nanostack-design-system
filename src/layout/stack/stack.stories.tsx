import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Text } from '@/components/text';

import { Stack } from './stack';

const usage = `
Places children in a column with even space between them. Components have no outer margin, so \`Stack\` is how vertical space is made.

| Prop | Values | Use it for |
| --- | --- | --- |
| \`space\` | \`none\` \`xxs\` \`xs\` \`sm\` \`md\` \`lg\` \`xl\` \`xxl\` (0, 2, 4, 8, 12, 16, 24, 32 px) | \`xs\` inside a field, \`sm\` between related lines, \`md\` (default) between blocks of a form or card, \`lg\` and up between page sections. |
| \`align\` | \`stretch\` (default), \`start\`, \`center\`, \`end\` | \`start\` when children must keep their own width, for example buttons. |
| \`as\` | \`div\`, \`section\`, \`ul\`, \`ol\`, \`form\`, \`fieldset\` | The element that carries the meaning. |
`;

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: { docs: { description: { component: usage } } },
  args: { space: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Text>First line</Text>
      <Text>Second line</Text>
      <Text>Third line</Text>
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const first = canvas.getByText('First line').getBoundingClientRect();
    const second = canvas.getByText('Second line').getBoundingClientRect();
    await expect(Math.round(second.top - first.bottom)).toBe(12);
  },
};

export const Spaces: Story = {
  render: () => (
    <Stack space="lg">
      {(['xs', 'sm', 'md', 'lg'] as const).map((space) => (
        <Stack key={space} space={space}>
          <Text weight="medium">{`space="${space}"`}</Text>
          <Text tone="muted">Line one</Text>
          <Text tone="muted">Line two</Text>
        </Stack>
      ))}
    </Stack>
  ),
};

export const AsList: Story = {
  args: { as: 'ul', space: 'xs' },
  render: (args) => (
    <Stack {...args}>
      <li>Webhooks</li>
      <li>Flows</li>
    </Stack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
  },
};
