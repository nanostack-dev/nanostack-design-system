import { ArrowRightIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button, type ButtonSize, type ButtonVariant } from './button';

const variants: ButtonVariant[] = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
];
const sizes: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];

const meta = {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component:
          'The main control that starts an action. Use one `default` button for the main action of a surface and `outline`, `ghost` or `secondary` for the others.',
      },
    },
  },
  component: Button,
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: [...sizes, 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const variant of variants) {
      await expect(canvas.getByRole('button', { name: variant })).toBeVisible();
    }
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) => canvas.getByRole('button', { name: size }).getBoundingClientRect().height,
    );
    await expect([...heights].sort((a, b) => a - b)).toEqual(heights);
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
      <Button {...args} variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button {...args} variant="destructive" size="icon" aria-label="Delete">
        <TrashIcon />
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Delete' })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' });
    await expect(button).toBeDisabled();
    await expect(getComputedStyle(button).pointerEvents).toBe('none');
    button.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const DestructiveOnMutedSurface: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '**Nanostack addition:** destructive text uses `--destructive-on-tint`, so a small destructive button passes WCAG AA on a muted surface as well as on the page background.',
      },
    },
  },
  args: { variant: 'destructive', size: 'xs', children: 'Delete' },
  render: (args) => (
    <div className="flex gap-2 rounded-xl bg-muted p-4">
      <Button {...args} />
      <Button {...args} size="sm" />
    </div>
  ),
  play: async ({ canvas }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Delete' });
    await expect(button).toHaveClass('text-destructive-on-tint');
    await expect(button).not.toHaveClass('text-destructive');
  },
};
