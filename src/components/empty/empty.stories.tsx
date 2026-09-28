import { FolderIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '@/components/button';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty';

const onCreate = fn();

const meta = {
  title: 'Components/Empty',
  component: Empty,
  render: (args) => (
    <Empty {...args} className="w-96 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Get started by creating a new project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onCreate}>
          <PlusIcon data-icon="inline-start" />
          Create project
        </Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('No projects yet')).toBeVisible();
    await expect(canvas.getByText('Get started by creating a new project.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Create project' }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};

export const TextOnly: Story = {
  render: (args) => (
    <Empty {...args} className="w-96">
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Try another search term or <a href="#filters">clear the filters</a>.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'clear the filters' })).toHaveAttribute(
      'href',
      '#filters',
    );
  },
};
