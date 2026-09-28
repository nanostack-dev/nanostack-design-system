import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Text } from '@/components/text';

import { TextLink } from './text-link';

const usage = `
A link inside text or in a list of links. It renders the \`linkComponent\` of \`DesignSystemProvider\`, so the product router handles the click. For a link that looks like a button, use \`ButtonLink\`.

| Prop | Values | Use it for |
| --- | --- | --- |
| \`tone\` | \`brand\` (default), \`neutral\` | \`neutral\` inside muted text, where a brand colour would be too loud. It is underlined, so it stays visible as a link. |
| \`external\` | boolean | A link that leaves the product. It opens a new tab. |
`;

const meta = {
  title: 'Components/TextLink',
  component: TextLink,
  parameters: { docs: { description: { component: usage } } },
  args: { href: '#flows', children: 'View all flows' },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'View all flows' })).toHaveAttribute(
      'href',
      '#flows',
    );
  },
};

export const InText: Story = {
  render: (args) => (
    <Text tone="muted">
      No runs yet. <TextLink {...args} tone="neutral" /> to start one.
    </Text>
  ),
};

export const External: Story = {
  args: { external: true, href: 'https://ui.shadcn.com', children: 'shadcn/ui' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'shadcn/ui' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noreferrer');
  },
};
