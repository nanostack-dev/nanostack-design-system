import { TextBIcon, TextItalicIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Toggle, type ToggleSize, type ToggleVariant } from '@/components/toggle';
import { Inline } from '@/layout/inline';

const variants: ToggleVariant[] = ['ghost', 'outline'];
const sizes: ToggleSize[] = ['sm', 'md', 'lg'];

const usage = `
A button that stays pressed or not pressed. Use it for one option that is on or off, such as bold text or a pinned panel. For one choice out of a few, use \`ToggleGroup\`. For a setting in a form, use \`Switch\` or \`Checkbox\`.

The props are the whole API. \`Toggle\` does not accept \`className\` or \`style\`. It uses the \`variant\` and \`size\` names of \`Button\`, so a toggle next to a button can match it.

## variant

| Value | Use it for |
| --- | --- |
| \`ghost\` | The default. A toggle in a toolbar or a panel header, next to \`ghost\` buttons. |
| \`outline\` | A toggle that must look clickable on its own, next to \`outline\` buttons. |

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense toolbar. It lines up with a \`sm\` button. |
| \`md\` | 36 px | The default. It lines up with a \`md\` button. |
| \`lg\` | 40 px | A toolbar next to \`lg\` buttons. |

## Other props

- \`pressed\`, \`defaultPressed\` and \`onPressedChange\`: the state.
- An icon-only toggle needs an \`aria-label\`.

## Do not

- Do not use a toggle to start an action. Use \`Button\`.
- Do not change the label when the state changes. The pressed look shows the state.
`;

const meta = {
  title: 'Components/Toggle',
  parameters: { docs: { description: { component: usage } } },
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
    <Inline space="sm">
      {variants.map((variant) => (
        <Toggle key={variant} {...args} variant={variant}>
          {variant}
        </Toggle>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const outline = canvas.getByRole('button', { name: 'outline' });
    const plain = canvas.getByRole('button', { name: 'ghost' });
    await expect(getComputedStyle(outline).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(plain).borderTopWidth).toBe('0px');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Inline space="sm">
      {sizes.map((size) => (
        <Toggle key={size} {...args} size={size} variant="outline">
          {size}
        </Toggle>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) => canvas.getByRole('button', { name: size }).getBoundingClientRect().height,
    );
    await expect(heights).toEqual([32, 36, 40]);
  },
};

export const IconOnly: Story = {
  render: (args) => (
    <Inline space="xs">
      <Toggle {...args} aria-label="Bold" defaultPressed>
        <TextBIcon />
      </Toggle>
      <Toggle {...args} aria-label="Italic">
        <TextItalicIcon />
      </Toggle>
    </Inline>
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
