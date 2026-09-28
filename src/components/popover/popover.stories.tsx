import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/popover';

const onCopy = fn();

const usage = `
A floating panel that opens from a trigger and holds interactive content. Use it for a small form, a filter or a picker next to the control that opens it. For text only, use \`Tooltip\`. For a preview on hover, use \`HoverCard\`. For a list of actions, use \`DropdownMenu\`.

The parts are closed. \`PopoverContent\` does not accept \`className\` or \`style\`. It is 288 px wide and sits 4 px from its trigger.

## side: where the panel opens

| Value | Use it for |
| --- | --- |
| \`bottom\` | The default. A trigger in a toolbar or a page header. |
| \`top\` | A trigger near the bottom of the screen, such as a status bar. |
| \`right\` or \`left\` | A trigger in a side rail, so the panel does not cover the rail. |

The panel flips to the other side when there is no room.

## align: which edge lines up with the trigger

| Value | Use it for |
| --- | --- |
| \`center\` | The default. |
| \`start\` | A trigger at the start of a row, so the panel does not overflow. |
| \`end\` | A trigger at the end of a row, such as a header action. |

## Other parts

- \`PopoverTrigger\` takes \`render\`: \`<PopoverTrigger render={<Button>Share</Button>} />\`.
- \`PopoverHeader\`, \`PopoverTitle\` and \`PopoverDescription\` name the panel. A title gives the panel its accessible name.

## Do not

- Do not set a width or an offset. The panel has one size.
- Do not put a whole page in a popover. Use \`Sheet\` or \`Dialog\`.
`;

const meta = {
  title: 'Components/Popover',
  parameters: { docs: { description: { component: usage } } },
  component: Popover,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onCopy.mockClear();
  },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>Share</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Share this page</PopoverTitle>
          <PopoverDescription>Anyone with the link can view the page.</PopoverDescription>
        </PopoverHeader>
        <Button variant="solid" tone="brand" onClick={onCopy}>
          Copy link
        </Button>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Share' });
    await userEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'Share this page' });
    await waitFor(() => expect(popover).toBeVisible());
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(within(popover).getByRole('button', { name: 'Copy link' }));
    await expect(onCopy).toHaveBeenCalledOnce();
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Share' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const popover = await screen.findByRole('dialog', { name: 'Share this page' });
    await waitFor(() =>
      expect(within(popover).getByRole('button', { name: 'Copy link' })).toHaveFocus(),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Placement: Story = {
  parameters: {
    docs: {
      description: {
        story: '`side="right"` and `align="start"`: the panel opens to the right of the trigger.',
      },
    },
  },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>Details</PopoverTrigger>
      <PopoverContent side="right" align="start">
        <PopoverHeader>
          <PopoverTitle>Details</PopoverTitle>
          <PopoverDescription>The panel opens to the right of the trigger.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Details' });
    await userEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'Details' });
    await waitFor(() =>
      expect(popover.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().right,
      ),
    );
  },
};
