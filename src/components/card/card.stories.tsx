import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

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
} from './card';

const sizes: CardSize[] = ['default', 'sm'];

function TeamCard(props: CardProps) {
  return (
    <Card className="w-80" {...props}>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Invite people to work on this project.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Three people have access to this project.</p>
      </CardContent>
      <CardFooter>
        <Button>Invite</Button>
      </CardFooter>
    </Card>
  );
}

const meta = {
  title: 'Components/Card',
  parameters: {
    docs: {
      description: {
        component:
          'A surface that groups a title, content and actions about one subject. Use it for dashboard panels and for items in a grid.',
      },
    },
  },
  component: Card,
  args: { size: 'default' },
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => <TeamCard {...args} />,
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

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {sizes.map((size) => (
        <TeamCard key={size} {...args} size={size} data-testid={size} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map((size) => canvas.getByTestId(size).getBoundingClientRect().height);
    await expect(heights[1]).toBeLessThan(heights[0]);
  },
};
