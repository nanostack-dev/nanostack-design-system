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
} from '@/components/avatar';
import { Inline } from '@/layout/inline';

const sizes: AvatarSize[] = ['sm', 'md', 'lg'];

const usage = `
A picture of a person or an organization, with initials when the image does not load. Use it in lists, menus, comments and account controls.

The props are the whole API. The parts do not accept \`className\` or \`style\`.

## size

| Value | Size | Use it for |
| --- | --- | --- |
| \`sm\` | 24 px | Inside a table row, a chip, or a dense list. |
| \`md\` | 32 px | The default. Menus, the account control in a top bar, comments. |
| \`lg\` | 40 px | A profile header or a list item with two lines of text. |

## Parts

- \`AvatarImage\` needs an \`alt\` with the name. \`AvatarFallback\` shows the initials while the image loads or when it fails.
- \`AvatarBadge\` is a small dot in the corner, for a presence or a check. Give it \`role="img"\` and an \`aria-label\`.
- \`AvatarGroup\` overlaps a few avatars. \`AvatarGroupCount\` shows how many more there are.

## Do not

- Do not resize an avatar or colour its fallback. Choose \`size\`.
- Do not use an avatar for an icon that is not a person or an organization.
`;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { docs: { description: { component: usage } } },
  args: { size: 'md' },
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
    <Inline space="sm" alignY="center">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>{size.toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const widths = ['SM', 'MD', 'LG'].map(
      (label) =>
        canvas.getByText(label).closest('[data-slot="avatar"]')!.getBoundingClientRect().width,
    );
    await expect(widths).toEqual([24, 32, 40]);
  },
};

export const WithBadge: Story = {
  args: { size: 'lg' },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>GH</AvatarFallback>
      <AvatarBadge role="img" aria-label="Verified">
        <CheckIcon aria-hidden />
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
