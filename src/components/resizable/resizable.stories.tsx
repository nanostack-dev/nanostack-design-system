import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/resizable';

const usage = `
Panels with handles that the user drags to change their size. Use it for editors and split views, such as a request above its response. For a sidebar that opens and closes, use \`Sidebar\` or \`Sheet\`.

The behaviour props come from \`react-resizable-panels\` v4 and pass through: \`orientation\`, \`defaultLayout\`, \`onLayoutChanged\` and \`groupRef\` on the group (use \`useDefaultLayout\` from \`react-resizable-panels\` to save the layout), and \`defaultSize\`, \`minSize\`, \`maxSize\`, \`collapsible\` and \`collapsedSize\` on a panel.

The group fills its parent: the height of a flex column, or the parent height. A panel lays its content out in a column, so a child with \`height: 100%\` or \`flex: 1\` fills it.

## orientation (on \`ResizablePanelGroup\`)

| Value | Use it for |
| --- | --- |
| \`horizontal\` | The default. Panels side by side: navigation beside an editor. |
| \`vertical\` | Panels one above the other: a request above its response. |

## withHandle (on \`ResizableHandle\`)

| Value | Use it for |
| --- | --- |
| \`false\` | The default. A thin line. Use it when the handle is obvious from the layout. |
| \`true\` | A visible grip on the line. Use it when the user may not know that the panels resize. |

## Do not

- Do not restyle the handle or the panels. The handle has one look in every product.
- Do not forget \`aria-label\` on \`ResizableHandle\`. It names what the handle resizes.
- Do not give every panel a \`minSize\` of 0. Keep each panel readable, or make it \`collapsible\`.
`;

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  args: { orientation: 'horizontal', onLayoutChanged: fn() },
  parameters: {
    layout: 'padded',
    docs: { description: { component: usage } },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function panelSize(canvasElement: HTMLElement, id: string, axis: 'width' | 'height') {
  const panel = canvasElement.querySelector<HTMLElement>(`[data-panel][id="${id}"]`)!;
  return panel.getBoundingClientRect()[axis];
}

function PanelLabel({ children }: { children: string }) {
  return <div className="flex h-full items-center justify-center p-6 text-sm">{children}</div>;
}

export const Default: Story = {
  render: (args) => (
    <div className="flex h-48 max-w-2xl rounded-lg border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel id="navigation" defaultSize="40%" minSize="20%">
          <PanelLabel>Navigation</PanelLabel>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize navigation" />
        <ResizablePanel id="editor" defaultSize="60%">
          <PanelLabel>Editor</PanelLabel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const handle = canvas.getByRole('separator', { name: 'Resize navigation' });
    const before = panelSize(canvasElement, 'navigation', 'width');
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await waitFor(() =>
      expect(panelSize(canvasElement, 'navigation', 'width')).toBeGreaterThan(before),
    );
    await userEvent.keyboard('{Home}');
    await waitFor(() =>
      expect(panelSize(canvasElement, 'navigation', 'width')).toBeLessThan(before),
    );
    await waitFor(() => expect(args.onLayoutChanged).toHaveBeenCalled());
  },
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A request above its response. The group fills the space left under the header, and both panels can collapse.',
      },
    },
  },
  args: { orientation: 'vertical', defaultLayout: { request: 55, response: 45 } },
  render: (args) => (
    <div className="flex h-72 max-w-md flex-col rounded-lg border">
      <div className="border-b p-3 text-sm font-medium">Open requests</div>
      <ResizablePanelGroup {...args}>
        <ResizablePanel id="request" minSize="15%" collapsible collapsedSize="0%">
          <PanelLabel>Request</PanelLabel>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize request and response" />
        <ResizablePanel id="response" minSize="15%" collapsible collapsedSize="0%">
          <PanelLabel>Response</PanelLabel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('separator', { name: 'Resize request and response' }),
    ).toHaveAttribute('aria-orientation', 'horizontal');
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="resizable-panel-group"]')!;
    const frame = group.parentElement!.getBoundingClientRect();
    await expect(Math.round(group.getBoundingClientRect().bottom)).toBe(
      Math.round(frame.bottom - 1),
    );
    const request = panelSize(canvasElement, 'request', 'height');
    const response = panelSize(canvasElement, 'response', 'height');
    await expect(request).toBeGreaterThan(response);
  },
};
