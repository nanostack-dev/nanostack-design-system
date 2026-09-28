import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { AspectRatio } from './aspect-ratio';

const meta = {
  title: 'Components/Aspect Ratio',
  component: AspectRatio,
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args} className="rounded-2xl bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          Preview
        </div>
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectRatio(element: Element, ratio: number) {
  const { width, height } = element.getBoundingClientRect();
  await expect(width).toBe(320);
  await expect(Math.abs(width / height - ratio)).toBeLessThan(0.01);
}

export const Widescreen: Story = {
  play: async ({ canvasElement }) => {
    await expectRatio(canvasElement.querySelector('[data-slot="aspect-ratio"]')!, 16 / 9);
  },
};

export const Square: Story = {
  args: { ratio: 1 },
  play: async ({ canvasElement }) => {
    await expectRatio(canvasElement.querySelector('[data-slot="aspect-ratio"]')!, 1);
  },
};
