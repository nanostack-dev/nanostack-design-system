import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';

import { NanostackMark } from './index';

const usage = `
The Nanostack mark: every Nanostack product carries it. \`AppShellBrand\` already shows it next to the product name at the top of the sidebar, so a signed-in screen needs nothing more. Use \`NanostackMark\` on its own for a screen outside the app frame, such as sign-in or an error page.

The body of the mark takes the current text colour, so it reads in light and dark. The corner keeps the brand blue in both themes.

## size

| Value | Use it for |
| --- | --- |
| \`sm\` | 20 px. Next to body text. |
| \`md\` | 24 px. The default. A header or a card title. |
| \`lg\` | 32 px. The brand slot and a sign-in screen. |

## label

Give \`label\` ("Nanostack") when no text next to the mark names it. Omit it when a product name follows the mark: the mark is then decorative.

## Do not

- Do not redraw, recolour or crop the mark. Ask for a variant here.
- Do not put the mark in a coloured tile. It is drawn to stand on the surface.
- Do not use a product's own logo in the sidebar brand slot. \`AppShellBrand\` shows the Nanostack mark and the product name.
`;

const meta = {
  title: 'Blocks/NanostackMark',
  component: NanostackMark,
  parameters: { docs: { description: { component: usage } } },
  args: { size: 'md', label: 'Nanostack' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof NanostackMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Nanostack' })).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <Inline space="lg" alignY="center">
      <NanostackMark size="sm" label="Nanostack, small" />
      <NanostackMark size="md" label="Nanostack, medium" />
      <NanostackMark size="lg" label="Nanostack, large" />
    </Inline>
  ),
};

export const WithProductName: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Decorative next to a name: no `label`, hidden from assistive technology.',
      },
    },
  },
  render: () => (
    <Inline space="xs" alignY="center">
      <NanostackMark size="lg" />
      <Text weight="semibold">Echopoint</Text>
    </Inline>
  ),
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector('[data-slot=nanostack-mark]');
    await expect(mark).toHaveAttribute('aria-hidden', 'true');
  },
};
