import { TextBIcon, TextItalicIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Toggle, type ToggleSize, type ToggleVariant } from './toggle';

const variants: ToggleVariant[] = ['default', 'outline'];
const sizes: ToggleSize[] = ['sm', 'default', 'lg'];

const meta = {
  title: 'Components/Toggle',
  parameters: {
    docs: {
      description: {
        component:
          'A button that stays pressed or not pressed. Use it for a single formatting option, such as bold.',
      },
    },
  },
  component: Toggle,
  args: { children: 'Bookmark', onPressedChange: fn() },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Bookmark' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {variants.map((variant) => (
        <Toggle key={variant} {...args} variant={variant}>
          {variant}
        </Toggle>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const outline = canvas.getByRole('button', { name: 'outline' });
    const plain = canvas.getByRole('button', { name: 'default' });
    await expect(getComputedStyle(outline).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(plain).borderTopWidth).toBe('0px');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {sizes.map((size) => (
        <Toggle key={size} {...args} size={size} variant="outline">
          {size}
        </Toggle>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) => canvas.getByRole('button', { name: size }).getBoundingClientRect().height,
    );
    await expect([...heights].sort((a, b) => a - b)).toEqual(heights);
  },
};

export const IconOnly: Story = {
  render: (args) => (
    <div className="flex items-center gap-1">
      <Toggle {...args} aria-label="Bold" defaultPressed>
        <TextBIcon />
      </Toggle>
      <Toggle {...args} aria-label="Italic">
        <TextItalicIcon />
      </Toggle>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole('button', { name: 'Bookmark' });
    await expect(toggle).toBeDisabled();
    toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onPressedChange).not.toHaveBeenCalled();
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Bookmark' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};
