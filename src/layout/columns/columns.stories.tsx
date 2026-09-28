import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Text } from '@/components/text';

import { Column, Columns } from './columns';

const usage = `
Places children side by side, and stacks them below a breakpoint. Wrap each child in a \`Column\`.

| Prop | Values | Use it for |
| --- | --- | --- |
| \`space\` | the spacing scale, default \`md\` | The gap between columns, and between rows once they stack. |
| \`collapseBelow\` | \`sm\`, \`md\`, \`lg\` | The breakpoint under which the columns stack. Most page layouts use \`md\`. |
| \`alignY\` | \`stretch\` (default), \`start\`, \`center\`, \`end\` | \`start\` when columns have different heights and must not stretch. |
| \`Column width\` | \`fill\` (default), \`content\`, \`1/2\`, \`1/3\`, \`2/3\`, \`1/4\`, \`3/4\` | \`content\` for a side rail that keeps its own width, a fraction for a fixed split. |
`;

const meta = {
  title: 'Layout/Columns',
  component: Columns,
  parameters: { docs: { description: { component: usage } } },
  args: { space: 'md' },
  render: (args) => (
    <div className="w-[36rem]">
      <Columns {...args}>
        <Column width="2/3">
          <Text>Main content</Text>
        </Column>
        <Column>
          <Text>Side panel</Text>
        </Column>
      </Columns>
    </div>
  ),
} satisfies Meta<typeof Columns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const main = canvas.getByText('Main content').getBoundingClientRect();
    const side = canvas.getByText('Side panel').getBoundingClientRect();
    await expect(Math.round(main.top)).toBe(Math.round(side.top));
  },
};

export const CollapseBelowLarge: Story = {
  args: { collapseBelow: 'lg' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
