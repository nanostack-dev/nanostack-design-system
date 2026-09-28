import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';

import { Label } from './label';

const meta = {
  title: 'Components/Label',
  component: Label,
  args: { htmlFor: 'username', children: 'Username' },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Label {...args} />
      <Input id="username" />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Username'));
    await expect(canvas.getByRole('textbox', { name: 'Username' })).toHaveFocus();
  },
};

export const WithCheckbox: Story = {
  args: { htmlFor: 'terms', children: 'Accept the terms' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label {...args} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await userEvent.click(canvas.getByText('Accept the terms'));
    await expect(checkbox).toBeChecked();
  },
};
