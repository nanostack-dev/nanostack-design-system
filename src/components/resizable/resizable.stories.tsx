import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  args: { orientation: 'horizontal' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Panels with handles that the user drags to change their size. Use it for editors and split views.',
      },
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function panelWidth(canvasElement: HTMLElement, id: string) {
  const panel = canvasElement.querySelector<HTMLElement>(`[data-panel][id="${id}"]`)!;
  return panel.getBoundingClientRect().width;
}

export const Default: Story = {
  render: (args) => (
    <ResizablePanelGroup className="min-h-48 max-w-2xl rounded-lg border" {...args}>
      <ResizablePanel id="navigation" defaultSize="40%" minSize="20%">
        <div className="flex h-full items-center justify-center p-6 text-sm">Navigation</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize navigation" />
      <ResizablePanel id="editor" defaultSize="60%">
        <div className="flex h-full items-center justify-center p-6 text-sm">Editor</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const handle = canvas.getByRole('separator', { name: 'Resize navigation' });
    const before = panelWidth(canvasElement, 'navigation');
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(panelWidth(canvasElement, 'navigation')).toBeGreaterThan(before));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(panelWidth(canvasElement, 'navigation')).toBeLessThan(before));
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ResizablePanelGroup className="min-h-72 max-w-md rounded-lg border" {...args}>
      <ResizablePanel defaultSize="30%">
        <div className="flex h-full items-center justify-center p-6 text-sm">Header</div>
      </ResizablePanel>
      <ResizableHandle aria-label="Resize header" />
      <ResizablePanel defaultSize="70%">
        <div className="flex h-full items-center justify-center p-6 text-sm">Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator', { name: 'Resize header' })).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
  },
};
