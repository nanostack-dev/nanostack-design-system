import { CaretRightIcon, FileTextIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent } from 'react';
import { expect, fn } from 'storybook/test';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Button } from '@/components/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemLink,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  type ItemSize,
  type ItemVariant,
} from '@/components/item';

const variants: ItemVariant[] = ['ghost', 'outline', 'soft'];
const sizes: ItemSize[] = ['md', 'sm', 'xs'];

const usage = `
A row with media, a title, a description and actions. Use it for a list of people, files, keys or settings. For a surface with its own header and body, use \`Card\`. For rows with columns, use \`Table\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. \`Item\` fills the width of its container.

## variant: how the row stands out

| Value | Use it for |
| --- | --- |
| \`ghost\` | The default. Rows in a list that already sits on a surface, such as a card or a menu. |
| \`outline\` | A row that stands alone on the page, or a grid of links. |
| \`soft\` | A row to set apart from its neighbours, such as the current plan or a pinned item. |

## size

| Value | Use it for |
| --- | --- |
| \`md\` | The default. A row with a title and a description. |
| \`sm\` | A dense list, or a list in a side panel. |
| \`xs\` | A row with one line of text, such as a result in a menu or a command palette. |

## Parts

- \`ItemLink\` is an \`Item\` that navigates. It takes \`href\` and uses the router link from \`DesignSystemProvider\`.
- \`ItemGroup\` is a list of items, with the space between rows set by \`size\`. Give each item \`role="listitem"\`.
- \`ItemMedia\`: pass \`icon\` for a Phosphor icon. Pass an \`Avatar\` as children. Set \`image\` when the children are an \`img\`, to frame and crop it.
- \`ItemContent\` holds \`ItemTitle\` and \`ItemDescription\`. \`ItemActions\` holds buttons or a caret.
- \`ItemSeparator\` is a line between two items.

## Do not

- Do not put a \`Button\` inside an \`ItemLink\`. A link cannot hold another control.
- Do not use \`Item\` with an \`onClick\` to navigate. Use \`ItemLink\`.
- Do not put more than two actions in \`ItemActions\`. Use a menu.
`;

const meta = {
  title: 'Components/Item',
  component: Item,
  parameters: { docs: { description: { component: usage } } },
  args: { variant: 'outline', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
  render: (args) => (
    <div className="w-96">
      <ItemGroup>
        <Item {...args} role="listitem">
          <ItemMedia icon={ShieldCheckIcon} />
          <ItemContent>
            <ItemTitle>Two-factor authentication</ItemTitle>
            <ItemDescription>Protect the account with a second step.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm">Enable</Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  ),
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(list).toContainElement(canvas.getByRole('listitem'));
    await expect(canvas.getByText('Two-factor authentication')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Enable' })).toBeVisible();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="w-96">
      <ItemGroup>
        {variants.map((variant) => (
          <Item key={variant} {...args} variant={variant} role="listitem" data-testid={variant}>
            <ItemContent>
              <ItemTitle>{variant}</ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(variants.length);
    const border = (variant: ItemVariant) =>
      getComputedStyle(canvas.getByTestId(variant)).borderTopColor;
    await expect(border('outline')).not.toBe(border('ghost'));
    await expect(getComputedStyle(canvas.getByTestId('soft')).backgroundColor).not.toBe(
      getComputedStyle(canvas.getByTestId('ghost')).backgroundColor,
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="w-96">
      <ItemGroup>
        {sizes.map((size) => (
          <Item key={size} {...args} size={size} role="listitem">
            <ItemContent>
              <ItemTitle>{size}</ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = canvas
      .getAllByRole('listitem')
      .map((item) => item.getBoundingClientRect().height);
    await expect([...heights].sort((a, b) => b - a)).toEqual(heights);
    await expect(new Set(heights).size).toBe(sizes.length);
  },
};

export const WithAvatar: Story = {
  render: (args) => (
    <div className="w-96">
      <Item {...args}>
        <ItemMedia>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Ada Lovelace</ItemTitle>
          <ItemDescription>ada@example.com</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('AL')).toBeVisible();
  },
};

export const AsLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`ItemLink` renders the router link from `DesignSystemProvider`, here a plain anchor.',
      },
    },
  },
  render: (args) => {
    const onNavigate = fn((event: MouseEvent) => event.preventDefault());
    return (
      <nav aria-label="Documents" className="w-96">
        <ItemLink variant={args.variant} size={args.size} href="#report" onClick={onNavigate}>
          <ItemMedia icon={FileTextIcon} />
          <ItemContent>
            <ItemTitle>Quarterly report</ItemTitle>
            <ItemDescription>Updated two hours ago.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <CaretRightIcon aria-hidden />
          </ItemActions>
        </ItemLink>
        <ItemSeparator />
        <ItemLink variant={args.variant} size={args.size} href="#notes" onClick={onNavigate}>
          <ItemContent>
            <ItemTitle>Release notes</ItemTitle>
          </ItemContent>
        </ItemLink>
      </nav>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const report = canvas.getByRole('link', { name: /Quarterly report/ });
    await expect(report).toHaveFocus();
    await expect(report).toHaveAttribute('href', '#report');
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Release notes/ })).toHaveFocus();
  },
};
