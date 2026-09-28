import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import {
  Tabs,
  TabsContent,
  TabsList,
  type TabsListVariant,
  TabsTrigger,
  type TabsProps,
} from './tabs';

const variants: TabsListVariant[] = ['default', 'line'];

type AccountTabsProps = TabsProps & { variant?: TabsListVariant; activateOnFocus?: boolean };

function AccountTabs({ variant, activateOnFocus, ...props }: AccountTabsProps) {
  return (
    <Tabs className="w-80" {...props}>
      <TabsList variant={variant} activateOnFocus={activateOnFocus}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Update your name and email address.</TabsContent>
      <TabsContent value="password">Change your password.</TabsContent>
      <TabsContent value="billing">Manage your plan.</TabsContent>
    </Tabs>
  );
}

async function expectPanel(canvasElement: HTMLElement, text: string) {
  await waitFor(() => {
    const panels = [...canvasElement.querySelectorAll('[role="tabpanel"]:not([inert])')];
    expect(panels).toHaveLength(1);
    expect(panels[0]).toHaveTextContent(text);
  });
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { defaultValue: 'account', onValueChange: fn() },
  render: (args) => <AccountTabs {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('tab', { name: 'Account' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expectPanel(canvasElement, 'Update your name');

    await userEvent.click(canvas.getByRole('tab', { name: 'Password' }));
    await expect(canvas.getByRole('tab', { name: 'Password' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expectPanel(canvasElement, 'Change your password.');
    await expect(args.onValueChange).toHaveBeenCalledWith('password', expect.anything());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const account = canvas.getByRole('tab', { name: 'Account' });
    const password = canvas.getByRole('tab', { name: 'Password' });
    await userEvent.tab();
    await expect(account).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(password).toHaveFocus();
    await expect(password).toHaveAttribute('aria-selected', 'false');

    await userEvent.keyboard('{Enter}');
    await expect(password).toHaveAttribute('aria-selected', 'true');
    await expectPanel(canvasElement, 'Change your password.');

    await userEvent.keyboard('{ArrowLeft}');
    await expect(account).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(account).toHaveAttribute('aria-selected', 'true');
    await expectPanel(canvasElement, 'Update your name');

    await userEvent.tab();
    await expect(canvas.getByRole('tabpanel')).toHaveFocus();
  },
};

export const ActivateOnFocus: Story = {
  render: (args) => <AccountTabs {...args} activateOnFocus />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    const password = canvas.getByRole('tab', { name: 'Password' });
    await expect(password).toHaveFocus();
    await expect(password).toHaveAttribute('aria-selected', 'true');
    await expectPanel(canvasElement, 'Change your password.');
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {variants.map((variant) => (
        <AccountTabs key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const lists = canvasElement.querySelectorAll('[data-slot="tabs-list"]');
    await expect([...lists].map((list) => list.getAttribute('data-variant'))).toEqual(variants);
  },
};

export const Disabled: Story = {
  play: async ({ canvas }) => {
    const billing = canvas.getByRole('tab', { name: 'Billing' });
    await expect(billing).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(billing).pointerEvents).toBe('none');
    billing.click();
    await expect(billing).toHaveAttribute('aria-selected', 'false');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    const account = canvas.getByRole('tab', { name: 'Account' }).getBoundingClientRect();
    const password = canvas.getByRole('tab', { name: 'Password' }).getBoundingClientRect();
    await expect(password.top).toBeGreaterThanOrEqual(account.bottom);
  },
};
