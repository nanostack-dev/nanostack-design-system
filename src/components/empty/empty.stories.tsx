import { FolderIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Button } from '@/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  type EmptyVariant,
} from '@/components/empty';

const onCreate = fn();
const variants: EmptyVariant[] = ['ghost', 'outline'];

const usage = `
The parts of an empty state: media, a title, a description and actions. Use it when a list, a table or a page has no content yet, or when a search finds nothing. The \`EmptyState\` block gives a shorter API for the common case. Inside a table, use \`TableEmpty\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. \`Empty\` fills the width of its container.

## variant

| Value | Use it for |
| --- | --- |
| \`ghost\` | The default. An empty state inside a surface that already has an edge, such as a card or a panel. |
| \`outline\` | An empty state on the page background, where a dashed border shows the area that content will fill. |

## Parts

- \`EmptyMedia\`: pass \`icon\` for a Phosphor icon on a tinted tile. Pass children for an avatar or an illustration.
- \`EmptyTitle\`: what is empty, in a few words.
- \`EmptyDescription\`: why, and what to do next. It can hold a link.
- \`EmptyContent\`: one or two actions.

## Do not

- Do not write "No data". Say what is missing, such as "No webhooks yet".
- Do not put more than two actions in \`EmptyContent\`.
- Do not resize the icon tile. It has one size.
`;

const meta = {
  title: 'Components/Empty',
  component: Empty,
  parameters: { docs: { description: { component: usage } } },
  args: { variant: 'outline' },
  argTypes: { variant: { control: 'select', options: variants } },
  render: (args) => (
    <div className="w-96">
      <Empty {...args}>
        <EmptyHeader>
          <EmptyMedia icon={FolderIcon} />
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Get started by creating a new project.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="solid" tone="brand" icon={PlusIcon} onClick={onCreate}>
            Create project
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByText('No projects yet')).toBeVisible();
    await expect(canvas.getByText('Get started by creating a new project.')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="empty-icon"] svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {variants.map((variant) => (
        <Empty key={variant} variant={variant} data-testid={variant}>
          <EmptyHeader>
            <EmptyTitle>{`${variant} empty state`}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByTestId('ghost')).borderTopWidth).toBe('0px');
    const outline = getComputedStyle(canvas.getByTestId('outline'));
    await expect(outline.borderTopWidth).toBe('1px');
    await expect(outline.borderTopStyle).toBe('dashed');
  },
};

export const WithAvatar: Story = {
  parameters: {
    docs: { description: { story: 'Children of `EmptyMedia` render as they are, with no tile.' } },
  },
  render: (args) => (
    <div className="w-96">
      <Empty {...args}>
        <EmptyHeader>
          <EmptyMedia>
            <Avatar size="lg">
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
          </EmptyMedia>
          <EmptyTitle>Ada has no runs yet</EmptyTitle>
          <EmptyDescription>Runs that Ada starts appear here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const media = canvasElement.querySelector('[data-slot="empty-icon"]');
    await expect(media).toHaveAttribute('data-variant', 'default');
    await expect(media?.querySelector('[data-slot="avatar"]')).not.toBeNull();
  },
};

export const TextOnly: Story = {
  render: (args) => (
    <div className="w-96">
      <Empty {...args}>
        <EmptyHeader>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>
            Try another search term or <a href="#filters">clear the filters</a>.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'clear the filters' })).toHaveAttribute(
      'href',
      '#filters',
    );
  },
};
