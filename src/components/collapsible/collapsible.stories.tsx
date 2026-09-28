import { CaretUpDownIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '@/components/button';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

const meta = {
  title: 'Components/Collapsible',
  parameters: {
    docs: {
      description: {
        component:
          'A section that shows or hides its content. Use it for optional details that most users do not need.',
      },
    },
  },
  component: Collapsible,
  args: { onOpenChange: fn() },
  render: (args) => (
    <Collapsible className="flex w-72 flex-col gap-2" {...args}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Three starred repositories</span>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <CaretUpDownIcon />
          <span className="sr-only">Show repositories</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm">design-system</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 text-sm">anchor</div>
        <div className="rounded-md border px-4 py-2 text-sm">echopoint</div>
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show repositories' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('anchor')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByText('anchor')).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true, expect.anything());

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(canvas.queryByText('anchor')).not.toBeInTheDocument());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show repositories' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Show repositories' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByText('echopoint')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Show repositories' });
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
    trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
