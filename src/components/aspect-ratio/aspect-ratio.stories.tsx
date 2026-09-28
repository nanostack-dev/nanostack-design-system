import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { AspectRatio } from '@/components/aspect-ratio';

const usage = `
A box that keeps a fixed width-to-height ratio. Use it for images, videos, maps and previews that must not change shape when the width changes. It fills the width of its container and crops what does not fit.

\`AspectRatio\` has no look props. Put the media, or a surface for it, inside.

## ratio

\`ratio\` is width divided by height.

| Value | Use it for |
| --- | --- |
| \`16 / 9\` | Video, screenshots and wide previews. |
| \`4 / 3\` | Photos and cards with an image on top. |
| \`1\` | Avatars, logos and square thumbnails. |

## Do not

- Do not set a height on the content. The ratio sets it.
- Do not use it for text. Text must reflow when the width changes.
`;

const meta = {
  title: 'Components/Aspect Ratio',
  parameters: { docs: { description: { component: usage } } },
  component: AspectRatio,
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <div className="flex size-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
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

export const CropsContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Content taller than the ratio is cropped, so the box keeps its shape.',
      },
    },
  },
  args: { ratio: 4 / 3 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <div className="h-[600px] rounded-2xl bg-muted" />
      </AspectRatio>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expectRatio(canvasElement.querySelector('[data-slot="aspect-ratio"]')!, 4 / 3);
  },
};
