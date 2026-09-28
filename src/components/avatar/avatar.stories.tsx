import { CheckIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  type AvatarSize,
} from './avatar';

const sizes: AvatarSize[] = ['sm', 'default', 'lg'];

const meta = {
  title: 'Components/Avatar',
  parameters: {
    docs: {
      description: {
        component:
          'A picture of a person or an organization, with initials when the image does not load. Use it in lists, menus and account controls.',
      },
    },
  },
  component: Avatar,
  args: { size: 'default' },
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/missing-avatar.png" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('AL')).toBeVisible();
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>{size.toUpperCase().slice(0, 2)}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = ['SM', 'DE', 'LG'].map(
      (label) =>
        canvas.getByText(label).closest('[data-slot="avatar"]')!.getBoundingClientRect().width,
    );
    await expect([...widths].sort((a, b) => a - b)).toEqual(widths);
    await expect(new Set(widths).size).toBe(3);
  },
};

export const WithBadge: Story = {
  args: { size: 'lg' },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>GH</AvatarFallback>
      <AvatarBadge role="img" aria-label="Verified">
        <CheckIcon />
      </AvatarBadge>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Verified')).toBeVisible();
  },
};

export const Group: Story = {
  render: (args) => (
    <AvatarGroup>
      {['AL', 'GH', 'KJ'].map((initials) => (
        <Avatar key={initials} {...args}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
  play: async ({ canvas }) => {
    for (const text of ['AL', 'GH', 'KJ', '+4']) {
      await expect(canvas.getByText(text)).toBeVisible();
    }
  },
};
