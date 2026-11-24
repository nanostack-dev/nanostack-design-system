import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DesignSystemProvider, type LinkComponentProps } from './design-system-provider';
import { TextLink } from '@/components/text-link';

function RouterLink({ ref, ...props }: LinkComponentProps) {
  return <a ref={ref} data-router-link="" {...props} />;
}

const usage = `
Wraps the app once. \`linkComponent\` makes \`ButtonLink\` and \`TextLink\` use the product router. A nested provider without \`linkComponent\` inherits the parent's. \`motion\` and \`material\` inherit the same way.

## Do not

- Do not wrap each page in a provider to set the router link. Set it once at the root.
`;

const meta = {
  title: 'Provider/DesignSystemProvider',
  component: DesignSystemProvider,
  parameters: { docs: { description: { component: usage } } },
} satisfies Meta<typeof DesignSystemProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NestedInheritsLinkComponent: Story = {
  args: { children: null },
  render: () => (
    <DesignSystemProvider linkComponent={RouterLink}>
      <DesignSystemProvider>
        <TextLink href="#nested">Nested link</TextLink>
      </DesignSystemProvider>
    </DesignSystemProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Nested link' })).toHaveAttribute(
      'data-router-link',
    );
  },
};
