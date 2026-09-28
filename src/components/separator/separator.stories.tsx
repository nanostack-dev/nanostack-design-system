import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Separator } from './separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-3 text-sm">
      <div>
        <p className="font-medium">Nanostack</p>
        <p className="text-muted-foreground">Shared UI for every product.</p>
      </div>
      <Separator {...args} />
      <p>Tokens, primitives and blocks.</p>
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
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Docs</span>
      <Separator {...args} />
      <span>Source</span>
      <Separator {...args} />
      <span>Releases</span>
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
