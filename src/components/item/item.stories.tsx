import { CaretRightIcon, FileTextIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '@/components/button';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  type ItemSize,
  type ItemVariant,
} from './item';

const variants: ItemVariant[] = ['default', 'outline', 'muted'];
const sizes: ItemSize[] = ['default', 'sm', 'xs'];

const meta = {
  title: 'Components/Item',
  parameters: {
    docs: {
      description: {
        component:
          'A row with media, a title, a description and actions. Use it for lists of people, files or settings.',
      },
    },
  },
  component: Item,
  args: { variant: 'outline', size: 'default' },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
  render: (args) => (
    <ItemGroup className="w-96">
      <Item {...args} role="listitem">
        <ItemMedia variant="icon">
          <ShieldCheckIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Two-factor authentication</ItemTitle>
          <ItemDescription>Protect the account with a second step.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Enable
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
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
    <ItemGroup className="w-96">
      {variants.map((variant) => (
        <Item key={variant} {...args} variant={variant} role="listitem">
          <ItemContent>
            <ItemTitle>{variant}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(variants.length);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <ItemGroup className="w-96">
      {sizes.map((size) => (
        <Item key={size} {...args} size={size} role="listitem">
          <ItemContent>
            <ItemTitle>{size}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  ),
  play: async ({ canvas }) => {
    const heights = canvas
      .getAllByRole('listitem')
      .map((item) => item.getBoundingClientRect().height);
    await expect([...heights].sort((a, b) => b - a)).toEqual(heights);
  },
};

export const AsLink: Story = {
  render: (args) => {
    const onNavigate = fn((event: React.MouseEvent) => event.preventDefault());
    return (
      <nav aria-label="Documents" className="flex w-96 flex-col">
        <Item {...args} render={<a href="#report" onClick={onNavigate} />}>
          <ItemMedia variant="icon">
            <FileTextIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Quarterly report</ItemTitle>
            <ItemDescription>Updated two hours ago.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <CaretRightIcon />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item {...args} render={<a href="#notes" onClick={onNavigate} />}>
          <ItemContent>
            <ItemTitle>Release notes</ItemTitle>
          </ItemContent>
        </Item>
      </nav>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Quarterly report/ })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Release notes/ })).toHaveFocus();
  },
};
