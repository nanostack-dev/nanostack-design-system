import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DirectionProvider, useDirection } from '@/components/direction';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

function DirectionLabel() {
  return <p className="text-sm text-muted-foreground">Direction: {useDirection()}</p>;
}

const usage = `
A provider that sets the reading direction for the components inside it: arrow keys, menus and sliders follow it. Use it once near the root of a product that supports a right-to-left language. \`useDirection()\` reads the current direction.

The provider does not set the \`dir\` attribute. Set \`dir\` on the \`html\` element (or on the same subtree) too, so the text and the layout flip.

## direction

| Value | Use it for |
| --- | --- |
| \`ltr\` | The default. Left-to-right languages, such as English and French. |
| \`rtl\` | Right-to-left languages, such as Arabic and Hebrew. |

## Do not

- Do not set \`rtl\` without the \`dir\` attribute. The keys flip, and the layout does not.
- Do not nest providers for one word in another language. Use \`dir\` on that element.
`;

const meta = {
  title: 'Components/Direction',
  parameters: { docs: { description: { component: usage } } },
  component: DirectionProvider,
  args: { direction: 'rtl' },
  render: (args) => (
    <DirectionProvider {...args}>
      <div dir={args.direction} className="flex flex-col items-start gap-3">
        <DirectionLabel />
        <ToggleGroup aria-label="Alignment" defaultValue={['start']}>
          <ToggleGroupItem value="start">Start</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="end">End</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </DirectionProvider>
  ),
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightToLeft: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Direction: rtl')).toBeVisible();
    const start = canvas.getByRole('button', { name: 'Start' });
    const center = canvas.getByRole('button', { name: 'Center' });
    await expect(start.getBoundingClientRect().left).toBeGreaterThan(
      center.getBoundingClientRect().left,
    );
    await userEvent.tab();
    await expect(start).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(center).toHaveFocus();
  },
};

export const LeftToRight: Story = {
  args: { direction: 'ltr' },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Direction: ltr')).toBeVisible();
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Center' })).toHaveFocus();
  },
};
