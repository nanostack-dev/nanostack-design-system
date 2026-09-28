import { PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { Button, IconButton } from '@/components/button';
import { Tooltip, TooltipContent, TooltipTrigger, type TooltipSide } from '@/components/tooltip';
import { Inline } from '@/layout/inline';

const sides: TooltipSide[] = ['top', 'right', 'bottom', 'left'];

const usage = `
A short label that shows when the pointer or the focus rests on a control. Use it to name an icon, or to add one fact such as a full date. For an icon button, \`IconButton\` already shows its \`label\` as a tooltip. For a preview with more content, use \`HoverCard\`.

The parts are closed. \`TooltipContent\` does not accept \`className\` or \`style\`. The text is 12 px on the foreground colour, and the width stops at 320 px.

## side: where the tooltip opens

| Value | Use it for |
| --- | --- |
| \`top\` | The default. Most controls. |
| \`bottom\` | A control in a top bar, so the tooltip does not leave the screen. |
| \`right\` | A control in a left rail, such as a panel toggle or a status dot. |
| \`left\` | A control in a right rail. |

The tooltip flips to the other side when there is no room.

## align

\`center\` is the default. Use \`start\` or \`end\` for a control at the edge of the screen.

## Other props

- \`TooltipTrigger\` takes \`render\`, so the tooltip attaches to your control: \`<TooltipTrigger render={<Button>Save</Button>} />\`.
- \`delay\` on \`TooltipTrigger\`: wait before the tooltip opens, for a dense toolbar where the pointer passes over many controls. \`DesignSystemProvider\` sets no delay by default.
- A \`Kbd\` in the content shows a keyboard shortcut.

## Do not

- Do not put a link, a button or other actions in a tooltip. It closes when the pointer leaves.
- Do not change the text size. It is fixed.
- Do not add a tooltip to an \`IconButton\`. It has one already.
`;

const meta = {
  title: 'Components/Tooltip',
  parameters: { docs: { description: { component: usage } } },
  component: Tooltip,
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger
        render={
          <IconButton icon={PlusIcon} label="Add project" variant="outline" tooltip={false} />
        }
      />
      <TooltipContent>Add project</TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Add project' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByText('Add project')).toBeVisible());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByText('Add project')).not.toBeInTheDocument());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Add project' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(screen.getByText('Add project')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Add project')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Sides: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Each `side`. The bottom one is open, to show the arrow under the trigger.',
      },
    },
  },
  render: (args) => (
    <Inline space="sm" alignY="center">
      {sides.map((side) => (
        <Tooltip key={side} {...args} defaultOpen={side === 'bottom'}>
          <TooltipTrigger render={<Button variant="outline" />}>{side}</TooltipTrigger>
          <TooltipContent side={side}>Opens on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const tooltip = await screen.findByText('Opens on the bottom');
    const trigger = canvas.getByRole('button', { name: 'bottom' });
    await waitFor(() =>
      expect(tooltip.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().bottom,
      ),
    );
  },
};

export const Delay: Story = {
  parameters: {
    docs: {
      description: {
        story: '`delay={300}` on the trigger: the tooltip waits before it opens.',
      },
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger delay={300} render={<Button variant="ghost" />}>
        Run history
      </TooltipTrigger>
      <TooltipContent side="bottom">Open the last 50 runs</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'Run history' }));
    await expect(screen.queryByText('Open the last 50 runs')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Open the last 50 runs')).toBeVisible());
  },
};
