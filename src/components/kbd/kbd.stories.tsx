import { CommandIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Button } from '@/components/button';
import { Kbd, KbdGroup } from '@/components/kbd';
import { Text } from '@/components/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';

const usage = `
A keyboard key or a shortcut, such as ⌘ K. Use it in menus, tooltips and help text. It has one look: inside a tooltip it switches to the tooltip colours by itself.

The props are the whole API. \`Kbd\` and \`KbdGroup\` do not accept \`className\` or \`style\`.

## Parts

- \`Kbd\`: one key. For a symbol key, put the icon with \`aria-hidden\` and the key name in a visually hidden span.
- \`KbdGroup\`: the keys of one shortcut, pressed together.

## Do not

- Do not use \`Kbd\` for code or a value. Use \`Text font="mono"\`.
- Do not put a whole sentence in \`Kbd\`.
`;

const meta = {
  title: 'Components/Kbd',
  parameters: {
    docs: { description: { component: usage } },
  },
  component: Kbd,
  args: { children: 'Esc' },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const key = canvas.getByText('Esc');
    await expect(key.tagName).toBe('KBD');
    await expect(key).toHaveAttribute('data-slot', 'kbd');
  },
};

export const Group: Story = {
  render: () => (
    <Text>
      Press{' '}
      <KbdGroup>
        <Kbd>
          <CommandIcon aria-hidden />
          <span className="sr-only">Command</span>
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
      to search.
    </Text>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="kbd-group"]');
    await expect(group).toHaveTextContent('CommandK');
    await expect(group?.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
  },
};

export const InTooltip: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>Save</TooltipTrigger>
      <TooltipContent>
        Save draft <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'Save' }));
    const tooltip = await within(document.body).findByText('Save draft');
    await expect(tooltip.querySelector('[data-slot="kbd"]')).toHaveTextContent('S');
  },
};
