import { GearIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

const onProfile = fn();
const onSettings = fn();
const onSignOut = fn();

const meta = {
  title: 'Components/Dropdown Menu',
  component: DropdownMenu,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onProfile.mockClear();
    onSettings.mockClear();
    onSignOut.mockClear();
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Account</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>ada@example.com</DropdownMenuLabel>
          <DropdownMenuItem onClick={onProfile}>
            <UserIcon />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettings}>
            <GearIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onSignOut}>
            <SignOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Account' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(menu).toBeVisible());
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(within(menu).getByRole('menuitem', { name: 'Billing' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(within(menu).getByRole('menuitem', { name: /Settings/ }));
    await expect(onSettings).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Account' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    const profile = within(menu).getByRole('menuitem', { name: /Profile/ });
    const settings = within(menu).getByRole('menuitem', { name: /Settings/ });
    const billing = within(menu).getByRole('menuitem', { name: 'Billing' });
    const signOut = within(menu).getByRole('menuitem', { name: /Sign out/ });
    await waitFor(() => expect(profile).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(settings).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(billing).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(menu).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    await expect(signOut).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(billing).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(signOut).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(profile).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onProfile).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const EscapeCloses: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Account' });
    await userEvent.click(trigger);
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onProfile).not.toHaveBeenCalled();
    await expect(onSignOut).not.toHaveBeenCalled();
  },
};

const longLabel = 'Transfer ownership to another workspace member';

export const LongLabel: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        More
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>{longLabel}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'More' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    const item = within(menu).getByRole('menuitem', { name: longLabel });
    await waitFor(() => expect(menu).toBeVisible());
    await expect(menu.getBoundingClientRect().width).toBeGreaterThan(
      trigger.getBoundingClientRect().width,
    );
    await expect(menu.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
    const rename = within(menu).getByRole('menuitem', { name: 'Rename' });
    await waitFor(() =>
      expect(item.getBoundingClientRect().height).toBeCloseTo(
        rename.getBoundingClientRect().height,
        0,
      ),
    );
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
    await expect(menu.scrollWidth).toBeLessThanOrEqual(menu.clientWidth);
  },
};

const onShowToolbarChange = fn();
const onDensityChange = fn();

export const CheckboxAndRadio: Story = {
  beforeEach: () => {
    onShowToolbarChange.mockClear();
    onDensityChange.mockClear();
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>View</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Panels</DropdownMenuLabel>
          <DropdownMenuCheckboxItem defaultChecked onCheckedChange={onShowToolbarChange}>
            Show toolbar
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup defaultValue="comfortable" onValueChange={onDensityChange}>
            <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View' }));
    const menu = await screen.findByRole('menu');
    const toolbar = within(menu).getByRole('menuitemcheckbox', { name: 'Show toolbar' });
    await expect(toolbar).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toolbar);
    await expect(onShowToolbarChange).toHaveBeenCalledWith(false, expect.anything());
    await expect(toolbar).toHaveAttribute('aria-checked', 'false');
    const compact = within(menu).getByRole('menuitemradio', { name: 'Compact' });
    await userEvent.click(compact);
    await expect(onDensityChange).toHaveBeenCalledWith('compact', expect.anything());
    await expect(compact).toHaveAttribute('aria-checked', 'true');
    await expect(within(menu).getByRole('menuitemradio', { name: 'Comfortable' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
};

const onMove = fn();

export const Submenu: Story = {
  beforeEach: () => {
    onMove.mockClear();
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onMove('design')}>Design</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove('platform')}>Platform</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    const moveTo = within(menu).getByRole('menuitem', { name: 'Move to' });
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(moveTo).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    const design = await screen.findByRole('menuitem', { name: 'Design' });
    await waitFor(() => expect(design).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'Platform' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(moveTo).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Platform' }));
    await expect(onMove).toHaveBeenCalledWith('platform');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};
