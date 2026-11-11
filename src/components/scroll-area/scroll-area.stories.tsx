import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { expect, waitFor } from 'storybook/test';

import { ScrollArea } from '@/components/scroll-area';

const tags = Array.from({ length: 40 }, (_, index) => `v1.${40 - index}.0`);
const artworks = ['Harbor', 'Glacier', 'Canyon', 'Meadow', 'Dune', 'Summit'];

const usage = `
A scroll container with a thin scrollbar that follows the theme. Use it for a list or a detail pane inside a surface of fixed height, such as a sidebar, an inspector, or a split view. For a whole page, let the page scroll.

The element that scrolls is the viewport, \`[data-slot=scroll-area-viewport]\`. The props below set it for you, so a product never reaches into the viewport with a selector.

## height

| Value | Use it for |
| --- | --- |
| \`auto\` | The default. The area is as tall as its content, up to \`maxHeight\`. |
| \`fill\` | The area fills the rest of a flex column, or the height of its parent: a sidebar navigation, an inspector body, a tab panel. |

## maxHeight

| Value | Use it for |
| --- | --- |
| \`none\` | The default. Use it with \`height="fill"\`, or when the parent sets the height. |
| \`md\` | A list or a detail pane in a page that must not grow past the screen: \`min(70vh, 36rem)\`. Run history and node history use it. |

## overscroll

| Value | Use it for |
| --- | --- |
| \`auto\` | The default. At the end of the area, the scroll moves on to the page. |
| \`contain\` | The scroll stops at the end of the area. Use it for a sidebar or a list in a pane, so the page behind does not move. |

## orientation

| Value | Use it for |
| --- | --- |
| \`vertical\` | The default. A list of rows. |
| \`horizontal\` | A row of cards or open tabs wider than its container. |
| \`both\` | A wide table or a code block that scrolls both ways. |

## A floating header over the area

A header that floats over the top of the area, such as a frosted title bar, needs its measured height as an inset. A prop cannot carry a measured value, so \`ScrollArea\` has none for it. Use one CSS variable instead:

1. Measure the floating header with a \`ResizeObserver\`, and set its height as a CSS variable, such as \`--header-inset\`, on the element that holds the header and the area.
2. Put the padding on the content inside the area: \`pt-(--header-inset)\`. The first row then starts under the header, and rows still scroll under it.
3. Give a sticky child the same variable as its \`top\`: \`sticky top-(--header-inset)\`. It then sticks just under the floating header, with no gap for rows to show through.

Measure the header. Do not assume its height: a few pixels short leaves a gap between the two headers.

## Keyboard focus

An area that scrolls is a tab stop, so the arrow keys scroll it. An area with no overflow is not. The focus ring is drawn inside the area, over the content, and follows the corner radius of the parent. A pane that clips (\`overflow-hidden\`) cannot cut it, and the pane needs no padding for it.

While the ring shows, it is above the content of the area, a sticky header included, and above a header that floats over the area. A popup in a portal, such as \`Popover\` or \`Dialog\`, stays above the ring.

## Do not

- Do not pad the area itself, or its viewport, for a floating header. Pad the content inside it.
- Do not put \`className\` on the area or reach into \`[data-slot=scroll-area-viewport]\`. Pick \`height\`, \`maxHeight\` and \`overscroll\`.
- Do not cap the height on a wrapper around the area. The viewport scrolls, so the cap goes on the area with \`maxHeight\`.
- Do not nest two areas that scroll the same way.
- Do not pad a pane, or remove its \`overflow-hidden\`, to make room for the focus ring. The ring is inside the area.
`;

const meta = {
  title: 'Components/Scroll Area',
  parameters: { docs: { description: { component: usage } } },
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

function TagList() {
  return (
    <div className="p-4">
      <h4 className="mb-4 text-sm font-medium">Tags</h4>
      {tags.map((tag) => (
        <div key={tag} className="border-b py-2 text-sm">
          {tag}
        </div>
      ))}
    </div>
  );
}

function viewportOf(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
}

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `height="fill"`, the area takes the height of its parent and scrolls inside it.',
      },
    },
  },
  args: { height: 'fill' },
  render: (args) => (
    <div className="h-72 w-48 rounded-md border">
      <ScrollArea {...args}>
        <TagList />
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const viewport = viewportOf(canvasElement);
    await expect(viewport.getBoundingClientRect().height).toBeLessThanOrEqual(288);
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area-thumb"]')!;
    const thumbTop = thumb.getBoundingClientRect().top;
    viewport.scrollTop = viewport.scrollHeight;
    await waitFor(() => expect(thumb.getBoundingClientRect().top).toBeGreaterThan(thumbTop));
  },
};

export const FillFlexColumn: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In a flex column, `height="fill"` takes the space left under the header. With `overscroll="contain"`, the scroll stops at the end of the list.',
      },
    },
  },
  args: { height: 'fill', overscroll: 'contain' },
  render: (args) => (
    <div className="flex h-80 w-56 flex-col rounded-md border">
      <div className="border-b p-4 text-sm font-medium">Workspace</div>
      <ScrollArea {...args}>
        <TagList />
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement);
    await expect(getComputedStyle(viewport).overscrollBehaviorY).toBe('contain');
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area"]')!;
    const frame = root.parentElement!.getBoundingClientRect();
    await expect(Math.round(root.getBoundingClientRect().bottom)).toBe(
      Math.round(frame.bottom - 1),
    );
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
  },
};

export const MaxHeight: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `maxHeight="md"`, the area grows with its content up to `min(70vh, 36rem)`, then scrolls. The cap is on the viewport, the element that scrolls.',
      },
    },
  },
  args: { maxHeight: 'md', overscroll: 'contain' },
  render: (args) => (
    <div className="w-56 rounded-md border">
      <ScrollArea {...args}>
        <TagList />
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement);
    const cap = Math.min(window.innerHeight * 0.7, 576);
    await expect(viewport.getBoundingClientRect().height).toBeLessThanOrEqual(cap + 0.5);
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
  },
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <div className="w-80 rounded-md border">
      <ScrollArea {...args}>
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
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const viewport = viewportOf(canvasElement);
    await expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    await expect(
      canvasElement.querySelector('[data-slot="scroll-area-scrollbar"][data-orientation]'),
    ).toHaveAttribute('data-orientation', 'horizontal');
    viewport.scrollLeft = 200;
    await waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0));
  },
};

function useMeasuredHeight<Element extends HTMLElement>() {
  const ref = useRef<Element>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    setHeight(element.offsetHeight);
    return () => observer.disconnect();
  }, []);
  return { ref, height };
}

const runSteps = Array.from({ length: 24 }, (_, index) => `Step ${index + 1}`);

function RunHistoryPane() {
  const { ref, height } = useMeasuredHeight<HTMLDivElement>();
  return (
    <section
      aria-label="Run history"
      className="relative flex h-80 w-80 flex-col overflow-hidden rounded-md border bg-card"
      style={{ '--header-inset': `${height}px` } as CSSProperties}
    >
      <div
        ref={ref}
        data-testid="floating-header"
        className="absolute inset-x-0 top-0 z-20 border-b bg-card/90 px-4 py-3 backdrop-blur"
      >
        <h3 className="text-sm font-semibold">Run history</h3>
      </div>
      <ScrollArea height="fill">
        <div className="pt-(--header-inset)">
          <h4
            data-testid="sticky-header"
            className="sticky top-(--header-inset) z-10 border-b bg-card px-4 py-2 text-sm font-medium"
          >
            Run 482 failed
          </h4>
          {runSteps.map((step) => (
            <div key={step} className="border-b px-4 py-2 text-sm">
              {step}
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}

export const FloatingHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A floating header over the area. The pane measures the header and sets `--header-inset`. The content inside the area has `pt-(--header-inset)`, and the report header inside it has `sticky top-(--header-inset)`. After a scroll, the report header stays just under the floating header.',
      },
    },
  },
  render: () => <RunHistoryPane />,
  play: async ({ canvas, canvasElement }) => {
    const floating = canvas.getByTestId('floating-header');
    const sticky = canvas.getByTestId('sticky-header');
    await waitFor(() =>
      expect(sticky.getBoundingClientRect().top).toBeCloseTo(
        floating.getBoundingClientRect().bottom,
        0,
      ),
    );
    const viewport = viewportOf(canvasElement);
    viewport.scrollTop = 240;
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(200));
    await waitFor(() =>
      expect(sticky.getBoundingClientRect().top).toBeCloseTo(
        floating.getBoundingClientRect().bottom,
        0,
      ),
    );
    await expect(canvas.getByText('Step 1').getBoundingClientRect().bottom).toBeLessThanOrEqual(
      floating.getBoundingClientRect().bottom,
    );
  },
};

const responseLines = Array.from(
  { length: 30 },
  (_, index) => `"requestId${index + 1}": "req_${'9f2c4e7a1b'.repeat(8)}",`,
);

function ResponseBodyPane() {
  return (
    <section
      aria-label="Response body"
      data-testid="clipping-pane"
      className="h-64 w-80 overflow-hidden rounded-3xl bg-card"
    >
      <ScrollArea height="fill" orientation="both">
        <div className="w-max min-w-full">
          <h4 className="sticky top-0 z-20 border-b bg-card px-4 py-2 text-sm font-medium">
            Response body
          </h4>
          {responseLines.map((line) => (
            <pre key={line} className="bg-muted px-4 py-1 font-mono text-xs odd:bg-card">
              {line}
            </pre>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}

// `pnpm test` runs the story in Vitest browser mode, which takes a real screenshot.
// Only that run defines the theme. Plain Storybook has no screenshot, so it has no pixels.
async function screenshotOf(element: HTMLElement) {
  if (!import.meta.env.VITE_STORYBOOK_THEME) return null;
  const browser = await import('vitest/browser');
  const base64 = await browser.page.screenshot({ element, save: false });
  const png = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  const bitmap = await createImageBitmap(new Blob([png], { type: 'image/png' }));
  const context = new OffscreenCanvas(bitmap.width, bitmap.height).getContext('2d')!;
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, bitmap.width, bitmap.height);
}

const sides = ['top', 'right', 'bottom', 'left'] as const;
const alongSide = [0.15, 0.3, 0.5, 0.7, 0.85];

// Points on the middle line of a 3 px ring that follows the edge of a pane:
// five on each side, and one on each rounded corner.
function ringPoints(width: number, height: number, radius: number) {
  const middle = 1.5;
  const corner = radius - (radius - middle) / Math.SQRT2;
  return {
    top: alongSide.map((fraction) => [fraction * width, middle]),
    right: alongSide.map((fraction) => [width - middle, fraction * height]),
    bottom: alongSide.map((fraction) => [fraction * width, height - middle]),
    left: alongSide.map((fraction) => [middle, fraction * height]),
    corners: [
      [corner, corner],
      [width - corner, corner],
      [width - corner, height - corner],
      [corner, height - corner],
    ],
  };
}

function pixelAt(image: ImageData, scale: number, [x, y]: number[]) {
  const at = (Math.floor(y! * scale) * image.width + Math.floor(x! * scale)) * 4;
  return Array.from(image.data.slice(at, at + 3));
}

export const WorstCase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The area fills a rounded pane that clips (`overflow-hidden`, no padding). Opaque rows and a sticky header touch every edge. The focus ring is drawn inside the area, over the content, and follows the corners of the pane. All four sides and corners show while the content is scrolled both ways. The test compares screenshots with and without keyboard focus.',
      },
    },
  },
  render: () => <ResponseBodyPane />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const pane = canvas.getByTestId('clipping-pane');
    const viewport = viewportOf(canvasElement);
    // A late font swap moves the rows between the two screenshots.
    await document.fonts.ready;
    viewport.scrollTop = 120;
    viewport.scrollLeft = 90;
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(100));
    await waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(80));
    const scrolled = [viewport.scrollTop, viewport.scrollLeft];
    await expect(viewport).not.toHaveFocus();
    const rest = await screenshotOf(pane);

    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    await expect(viewport.matches(':focus-visible')).toBe(true);
    await expect([viewport.scrollTop, viewport.scrollLeft]).toEqual(scrolled);

    const ring = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area-focus-ring"]')!;
    const ringBox = ring.getBoundingClientRect();
    const paneBox = pane.getBoundingClientRect();
    for (const side of sides) await expect(ringBox[side]).toBeCloseTo(paneBox[side], 0);

    const focused = await screenshotOf(pane);
    if (!rest || !focused) return;
    await expect(focused.width).toBe(rest.width);
    const scale = focused.width / paneBox.width;
    const radius = parseFloat(getComputedStyle(pane).borderTopLeftRadius);
    await expect(radius).toBeGreaterThan(8);
    for (const [part, points] of Object.entries(
      ringPoints(paneBox.width, paneBox.height, radius),
    )) {
      const drawn = points.filter((point) => {
        const before = pixelAt(rest, scale, point);
        return pixelAt(focused, scale, point).some(
          (channel, at) => Math.abs(channel - before[at]!) > 8,
        );
      });
      await expect(`${part}: ${drawn.length} of ${points.length}`).toBe(
        `${part}: ${points.length} of ${points.length}`,
      );
    }
  },
};
