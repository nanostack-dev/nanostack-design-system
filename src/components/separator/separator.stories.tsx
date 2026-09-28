import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ArrowsOutIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { IconButton } from '@/components/button';
import { Separator } from '@/components/separator';
import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';

const usage = `
A line between groups of content. Use it instead of a border on a \`div\`. Between two sections of a page, a heading and space from \`Stack\` are often enough.

The props are the whole API. \`Separator\` does not accept \`className\` or \`style\`. It has no margin: the layout around it sets the space.

## orientation

| Value | Use it for |
| --- | --- |
| \`horizontal\` | The default. Between blocks in a column: sections of a panel, groups in a menu. |
| \`vertical\` | Between items in a row: groups of toolbar buttons, links in a footer. |

## length (vertical only)

| Value | Use it for |
| --- | --- |
| \`full\` | The default. The line takes the full height of the row, for example between two panels. |
| \`short\` | A 16 px line, centred, between groups of controls in a toolbar or a header. |

## Do not

- Do not add margin to a separator. Set \`space\` on the \`Stack\` or \`Inline\` around it.
- Do not fade the line. The border token is the only colour.
`;

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { docs: { description: { component: usage } } },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-72">
      <Stack space="md">
        <Stack space="none">
          <Text weight="medium">Nanostack</Text>
          <Text tone="muted">Shared UI for every product.</Text>
        </Stack>
        <Separator {...args} />
        <Text>Tokens, primitives and blocks.</Text>
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator');
    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(separator.getBoundingClientRect().height).toBe(1);
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="h-5">
      <Inline space="md" alignY="center">
        <Text>Docs</Text>
        <Separator {...args} />
        <Text>Source</Text>
        <Separator {...args} />
        <Text>Releases</Text>
      </Inline>
    </div>
  ),
  play: async ({ canvas }) => {
    const separators = canvas.getAllByRole('separator');
    await expect(separators).toHaveLength(2);
    for (const separator of separators) {
      await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
      await expect(separator.getBoundingClientRect().width).toBe(1);
    }
  },
};

export const ShortInToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`length="short"` replaces the hand-set heights (`h-4`, `h-5`) that products gave toolbar separators.',
      },
    },
  },
  render: () => (
    <Inline space="xs" alignY="center" role="toolbar" aria-label="Canvas">
      <IconButton icon={MagnifyingGlassPlusIcon} label="Zoom in" tooltip={false} />
      <IconButton icon={MagnifyingGlassMinusIcon} label="Zoom out" tooltip={false} />
      <Separator orientation="vertical" length="short" />
      <IconButton icon={ArrowsOutIcon} label="Fit to screen" tooltip={false} />
    </Inline>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator');
    await expect(separator).toHaveAttribute('data-length', 'short');
    await expect(separator.getBoundingClientRect().height).toBe(16);
    const toolbar = canvas.getByRole('toolbar', { name: 'Canvas' });
    await expect(toolbar.getBoundingClientRect().height).toBe(36);
  },
};
