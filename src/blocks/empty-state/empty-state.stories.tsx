import { FolderIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Inline } from '@/layout/inline';

import { EmptyState } from './empty-state';

const usage = `
A message for a list or a page with no content, with an optional icon and actions. Use it to tell the person why the area is empty and what to do next. For an empty table, pass it as \`emptyState\` of \`DataTable\`. For an error, use \`Alert\`.

The block is closed. It does not accept \`className\` or \`style\`.

## variant: the frame

| Value | Use it for |
| --- | --- |
| \`ghost\` | The default. Inside a card, a panel or a table, which already has a frame. |
| \`outline\` | Alone on a page, where the empty area needs an edge. |

## Other props

- \`icon\`: a Phosphor icon that says what the area holds, for example a folder for projects.
- \`children\`: the actions. Put the main action first. Use at most two.

## Do not

- Do not write "No data". Say what is missing and what to do.
- Do not put an \`outline\` empty state inside a card.
- Do not use more than one \`solid brand\` button.
`;

const onCreate = fn();
const onImport = fn();

const meta = {
  title: 'Blocks/Empty State',
  parameters: {
    docs: { description: { component: usage } },
  },
  component: EmptyState,
  args: {
    icon: FolderIcon,
    title: 'No projects yet',
    description: 'Create a project to start collecting results.',
    children: (
      <Inline space="sm" align="center">
        <Button variant="solid" tone="brand" icon={PlusIcon} onClick={onCreate}>
          Create project
        </Button>
        <Button variant="outline" onClick={onImport}>
          Import
        </Button>
      </Inline>
    ),
  },
  beforeEach: () => {
    onCreate.mockClear();
    onImport.mockClear();
  },
  render: (args) => (
    <div className="w-96">
      <EmptyState {...args} variant="outline" />
    </div>
  ),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithActions: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByText('No projects yet')).toBeVisible();
    await expect(canvas.getByText('Create a project to start collecting results.')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="empty-icon"] svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(onCreate).toHaveBeenCalledOnce();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Import' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onImport).toHaveBeenCalledOnce();
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: undefined,
    title: 'No results',
    description: 'Try another search term.',
    children: undefined,
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('No results')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="empty-icon"]')).not.toBeInTheDocument();
    await expect(
      canvasElement.querySelector('[data-slot="empty-content"]'),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const TitleOnly: Story = {
  args: { icon: undefined, description: undefined, children: undefined, title: 'Nothing here' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Nothing here')).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-slot="empty-description"]'),
    ).not.toBeInTheDocument();
  },
};

export const InsideCard: Story = {
  args: {
    icon: MagnifyingGlassIcon,
    title: 'No matching items',
    description: 'Clear the filters to see every item.',
    children: (
      <Button variant="outline" onClick={onCreate}>
        Clear filters
      </Button>
    ),
  },
  render: (args) => (
    <div className="w-md">
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState {...args} />
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Items')).toBeVisible();
    await expect(canvas.getByText('No matching items')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await expect(document.documentElement).toHaveClass('dark');
    await expect(canvas.getByText('No projects yet')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};
