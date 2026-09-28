import { CommandIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Button } from '@/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';

import { Kbd, KbdGroup } from './kbd';

const meta = {
  title: 'Components/Kbd',
  parameters: {
    docs: {
      description: {
        component:
          'A keyboard key or a shortcut, such as ⌘ K. Use it in menus, tooltips and help text.',
      },
    },
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
    <p className="text-sm">
      Press{' '}
      <KbdGroup>
        <Kbd>
          <CommandIcon aria-hidden />
          <span className="sr-only">Command</span>
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
      to search.
    </p>
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
