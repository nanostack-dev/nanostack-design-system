import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  SearchButton,
  type SearchButtonSize,
  type SearchButtonWidth,
} from '@/components/search-button';
import { Stack } from '@/layout/stack';

const sizes: SearchButtonSize[] = ['sm', 'md'];
const widths: SearchButtonWidth[] = ['auto', 'fill'];

const usage = `
A button that looks like a search field. It opens a search palette or a command menu: the search itself happens in the palette, not in the button. For a field that filters a list as the user types, use \`Input\` or \`InputGroup\`.

The props are the whole API. \`SearchButton\` does not accept \`className\` or \`style\`. It is a button: its accessible name is \`label\`, and \`shortcut\` goes into \`aria-keyshortcuts\`.

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense header, a sidebar, or a top bar on a phone. |
| \`md\` | 36 px | The default. The search of a top bar. |

## width

| Value | Use it for |
| --- | --- |
| \`auto\` | The default. The button is as wide as its label and shortcut. |
| \`fill\` | The button fills its container, such as the middle column of a top bar. The container sets the width. |

## Other props

- \`label\`: the text in the button and its accessible name, such as "Search workspace". Say what the user can search.
- \`shortcut\`: the keys that open the search, shown with \`Kbd\`, such as \`['⌘', 'K']\`. \`⌘\`, \`⌃\`, \`⌥\` and \`⇧\` become \`Meta\`, \`Control\`, \`Alt\` and \`Shift\` in \`aria-keyshortcuts\`. The product still listens for the keys.
- \`onClick\`: opens the palette.

## Do not

- Do not use it as a text field. It takes no value. Use \`Input\`.
- Do not show a shortcut that the product does not handle.
- Do not put a placeholder such as "Search..." in \`label\`. Say what the search covers.
`;

const meta = {
  title: 'Components/Search Button',
  component: SearchButton,
  parameters: { docs: { description: { component: usage } } },
  args: { label: 'Search workspace', shortcut: ['⌘', 'K'], onClick: fn() },
  argTypes: {
    size: { control: 'select', options: sizes },
    width: { control: 'select', options: widths },
  },
} satisfies Meta<typeof SearchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Search workspace' });
    await expect(button).toHaveAttribute('aria-keyshortcuts', 'Meta+K');
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Search workspace' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack space="sm" align="start">
      {sizes.map((size) => (
        <SearchButton key={size} {...args} size={size} label={`Search ${size}`} />
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) =>
        canvas.getByRole('button', { name: `Search ${size}` }).getBoundingClientRect().height,
    );
    await expect(heights).toEqual([32, 36]);
  },
};

export const FillWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In a top bar, the middle column sets the width and the button fills it. A long label ends with an ellipsis before the shortcut.',
      },
    },
  },
  args: { width: 'fill', label: 'Search endpoints, flows, requests, and webhook payloads' },
  render: (args) => (
    <div className="w-72">
      <SearchButton {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', {
      name: 'Search endpoints, flows, requests, and webhook payloads',
    });
    await expect(button.getBoundingClientRect().width).toBe(288);
    await expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth);
    const kbd = button.querySelector('[data-slot="kbd-group"]')!;
    await expect(kbd.getBoundingClientRect().right).toBeLessThanOrEqual(
      button.getBoundingClientRect().right,
    );
  },
};

export const WithoutShortcut: Story = {
  parameters: {
    docs: {
      description: {
        story: 'On a phone, the search has no keyboard shortcut. Leave `shortcut` out.',
      },
    },
  },
  args: { shortcut: undefined, size: 'sm', label: 'Search' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Search' });
    await expect(button).not.toHaveAttribute('aria-keyshortcuts');
    await expect(button.querySelector('[data-slot="kbd"]')).toBeNull();
  },
};

export const ControlShortcut: Story = {
  args: { shortcut: ['Ctrl', 'Shift', 'f'], label: 'Search files' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Search files' })).toHaveAttribute(
      'aria-keyshortcuts',
      'Control+Shift+F',
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Search workspace' });
    await expect(button).toBeDisabled();
    button.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
