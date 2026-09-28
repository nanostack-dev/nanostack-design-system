import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { ScrollArea, ScrollBar } from './scroll-area';

const tags = Array.from({ length: 40 }, (_, index) => `v1.${40 - index}.0`);
const artworks = ['Harbor', 'Glacier', 'Canyon', 'Meadow', 'Dune', 'Summit'];

const meta = {
  title: 'Components/Scroll Area',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <ScrollArea className="h-72 w-48 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="border-b py-2 text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    )!;
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area-thumb"]')!;
    const thumbTop = thumb.getBoundingClientRect().top;
    viewport.scrollTop = viewport.scrollHeight;
    await waitFor(() => expect(thumb.getBoundingClientRect().top).toBeGreaterThan(thumbTop));
  },
};

export const Horizontal: Story = {
  render: (args) => (
    <ScrollArea className="w-80 rounded-md border whitespace-nowrap" {...args}>
      <div className="flex w-max gap-4 p-4">
        {artworks.map((artwork) => (
          <figure key={artwork} className="shrink-0">
            <div className="flex h-32 w-40 items-center justify-center rounded-md bg-muted text-sm">
              {artwork}
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">{artwork}</figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    )!;
    await expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    viewport.scrollLeft = 200;
    await waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0));
  },
};
