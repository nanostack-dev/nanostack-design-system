import { KeyIcon, UsersIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Button } from '@/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
  type CardSize,
  type CardVariant,
} from '@/components/card';
import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';
import { Spread } from '@/layout/spread';
import { Stack } from '@/layout/stack';

const variants: CardVariant[] = ['solid', 'outline', 'soft'];
const sizes: CardSize[] = ['md', 'sm'];

const usage = `
A surface that groups a title, content and actions about one subject. Use it for a dashboard panel, a settings section, or an item in a grid. For one key number, use the \`StatCard\` block. For a row in a list, use \`Item\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. Put a \`Stack\`, \`Inline\` or \`Spread\` inside \`CardContent\` to place its children.

## variant: how the surface stands out

| Value | Use it for |
| --- | --- |
| \`solid\` | The default. A card on the page background, such as a dashboard panel. It has a shadow. |
| \`outline\` | A card next to many others, or a card inside a section that already has a surface: a form step, a grid of options. It is flat, with a border. |
| \`soft\` | A quiet panel inside another surface, such as a summary in a dialog. It has a tint and no border. |

## size: how dense the card is

| Value | Padding | Use it for |
| --- | --- | --- |
| \`md\` | 24 px | The default. A card with a title, a description and content. |
| \`sm\` | 16 px | A small card in a grid, or a card in a dialog or a side panel. |

## Parts

- \`CardHeader\` holds \`CardTitle\`, \`CardDescription\` and one \`CardAction\` in the top-right corner.
- \`CardTitle\` takes an \`icon\`: a Phosphor icon before the title.
- \`CardContent\` holds the body. \`CardFooter\` holds the actions, in a row.

## Do not

- Do not change the title size. For a big number, use the \`StatCard\` block.
- Do not add spacing classes to \`CardContent\`. Put a \`Stack\` inside it.
- Do not colour the text of \`CardContent\`. Use \`Text tone="muted"\`.
- Do not nest a \`solid\` card in another card. Use \`outline\` or \`soft\` inside.
`;

function TeamCard(props: CardProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Invite people to work on this project.</CardDescription>
        <CardAction>
          <Button size="sm">Manage</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Text>Three people have access to this project.</Text>
      </CardContent>
      <CardFooter>
        <Button variant="solid" tone="brand">
          Invite
        </Button>
      </CardFooter>
    </Card>
  );
}

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { docs: { description: { component: usage } } },
  args: { variant: 'solid', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
  render: (args) => (
    <div className="w-80">
      <TeamCard {...args} />
    </div>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Team members')).toHaveAttribute('data-slot', 'card-title');
    await expect(canvas.getByText('Invite people to work on this project.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Manage' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Invite' })).toBeVisible();
  },
};

export const Variants: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          '`solid` has a shadow, `outline` is flat with a border, `soft` is a tint with no border.',
      },
    },
  },
  render: (args) => (
    <Inline space="lg" alignY="start">
      {variants.map((variant) => (
        <div key={variant} className="w-72">
          <TeamCard {...args} variant={variant} data-testid={variant} />
        </div>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const [solid, outline, soft] = variants.map((variant) => canvas.getByTestId(variant));
    await expect(getComputedStyle(solid).boxShadow).not.toBe('none');
    await expect(getComputedStyle(outline).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(soft).borderTopWidth).toBe('0px');
    await expect(getComputedStyle(soft).backgroundColor).not.toBe(
      getComputedStyle(outline).backgroundColor,
    );
  },
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <Inline space="lg" alignY="start">
      {sizes.map((size) => (
        <div key={size} className="w-72">
          <TeamCard {...args} size={size} data-testid={size} />
        </div>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const paddingOf = (size: CardSize) =>
      Number.parseFloat(getComputedStyle(canvas.getByTestId(size)).paddingTop);
    await expect(paddingOf('md')).toBe(24);
    await expect(paddingOf('sm')).toBe(16);
  },
};

export const TitleWithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `icon` prop replaces a hand-made flex row with an icon and a title.',
      },
    },
  },
  render: (args) => (
    <div className="w-80">
      <Card {...args}>
        <CardHeader>
          <CardTitle icon={KeyIcon}>API key</CardTitle>
          <CardDescription>Used by the CLI and the CI pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack space="sm">
            <Spread>
              <Text tone="muted">Created</Text>
              <Text>12 September 2026</Text>
            </Spread>
            <Spread>
              <Text tone="muted">Last used</Text>
              <Text>2 hours ago</Text>
            </Spread>
          </Stack>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    const title = canvas.getByText('API key');
    await expect(title.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Grid: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      {['Owners', 'Members', 'Viewers'].map((group) => (
        <Card key={group} variant="outline" size="sm" role="group" aria-label={group}>
          <CardHeader>
            <CardTitle icon={UsersIcon}>{group}</CardTitle>
            <CardDescription>People with this role.</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const owners = canvas.getByRole('group', { name: 'Owners' });
    await expect(within(owners).getByText('People with this role.')).toBeVisible();
    await expect(canvas.getAllByRole('group')).toHaveLength(3);
  },
};

export const LongContent: Story = {
  render: (args) => (
    <div className="w-64">
      <Card {...args} data-testid="card">
        <CardHeader>
          <CardTitle>Monthly recurring revenue across every region and plan</CardTitle>
          <CardDescription>
            Includes annual plans converted to a monthly amount and excludes refunds.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('card');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
  },
};
