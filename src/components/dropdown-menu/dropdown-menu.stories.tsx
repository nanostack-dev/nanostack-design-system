import {
  DotsThreeIcon,
  GearIcon,
  PencilSimpleIcon,
  SignOutIcon,
  TrashIcon,
  UserIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button, IconButton } from '@/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuContentWidth,
} from '@/components/dropdown-menu';
import { Inline } from '@/layout/inline';
import { DesignSystemProvider, type LinkComponentProps } from '@/provider';

const onProfile = fn();
const onSettings = fn();
const onSignOut = fn();

const usage = `
A menu of actions or options that opens from a button. Use it for the actions on a row, a card or a panel, and for an account menu.

Use \`Select\` to pick one value in a form. Use \`Combobox\` when the list is long and the user types to find an option. Use \`ContextMenu\` only as a second way to open actions that a visible menu already offers.

The parts do not accept \`className\` or \`style\`. Put a \`Button\` or an \`IconButton\` in \`DropdownMenuTrigger render\`.

## DropdownMenuContent width

| Value | Width | Use it for |
| --- | --- | --- |
| \`auto\` | Fits the labels, at least 192 px and at least the trigger | The default. Almost every menu. |
| \`sm\` | 224 px | A menu of actions on a row or a card, when its labels change from row to row (a count, a name, a permission hint). Every row then opens a menu of the same width. |
| \`md\` | 256 px | A menu that shows a current value next to each label, or a second line under a label, such as "Runner: Cloud" or "3 online". |

Every width stops at the edge of the viewport. A long label wraps in \`sm\` and \`md\`, and never overflows.

## DropdownMenuItem tone

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. Any action. |
| \`critical\` | An action that deletes or cannot be undone: Delete, Remove, Revoke, Sign out. Put it last, after a \`DropdownMenuSeparator\`. |

## Other props

- \`side\` and \`align\` on \`DropdownMenuContent\`: where the menu opens. The default is below the trigger, aligned to its start. Use \`align="end"\` for a menu on the right edge of a row, and \`side="right"\` for a menu that opens from a sidebar.
- \`DropdownMenuLinkItem\` with \`href\`: an item that navigates. It renders the \`linkComponent\` of \`DesignSystemProvider\`, so the product router handles the click. Set \`aria-current="page"\` on the link of the current page.
- \`inset\`: lines up the text of an item without an icon with the text of the items that have one.
- \`DropdownMenuCheckboxItem\` and \`DropdownMenuRadioItem\`: a setting that the menu changes. The check mark shows the current value.

## Do not

- Do not use \`variant="destructive"\`. It is \`tone="critical"\` now.
- Do not set the menu width with \`className\`. Use \`width\`. Most menus need no width.
- Do not render a router link inside \`DropdownMenuItem\`. Use \`DropdownMenuLinkItem\`.
- Do not show the selected option with a background colour. Use \`DropdownMenuRadioItem\` in a \`DropdownMenuRadioGroup\`.
- Do not put a form or a text field in a menu. Use \`Popover\`.
`;

const meta = {
  title: 'Components/Dropdown Menu',
  parameters: { docs: { description: { component: usage } } },
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
          <DropdownMenuItem tone="critical" onClick={onSignOut}>
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

const onDelete = fn();

export const CriticalItem: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`tone="critical"` marks an action that deletes. Its text uses `--destructive-on-tint`, so it passes WCAG AA on the menu and on its focus tint.',
      },
    },
  },
  beforeEach: () => {
    onDelete.mockClear();
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger
        render={<IconButton icon={DotsThreeIcon} label="Row actions" tooltip={false} />}
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PencilSimpleIcon />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="critical" onClick={onDelete}>
          <TrashIcon />
          Delete request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Row actions' }));
    const menu = await screen.findByRole('menu');
    const remove = within(menu).getByRole('menuitem', { name: 'Delete request' });
    await expect(remove).toHaveAttribute('data-tone', 'critical');
    await expect(remove).toHaveClass('text-destructive-on-tint');
    await expect(within(menu).getByRole('menuitem', { name: 'Rename' })).toHaveAttribute(
      'data-tone',
      'neutral',
    );
    await userEvent.click(remove);
    await expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

const longLabel = 'Transfer ownership to another workspace member';

export const LongLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `width="auto"`, the menu grows past the trigger to show a long label on one line, and stops at the edge of the viewport.',
      },
    },
  },
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

const widths: { width: DropdownMenuContentWidth; pixels: number }[] = [
  { width: 'auto', pixels: 192 },
  { width: 'sm', pixels: 224 },
  { width: 'md', pixels: 256 },
];

export const Widths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each trigger is an icon button. `auto` fits the labels and never goes below 192 px. `sm` and `md` keep one width for every row, whatever the labels say.',
      },
    },
  },
  render: (args) => (
    <Inline space="sm">
      {widths.map(({ width }) => (
        <DropdownMenu key={width} {...args}>
          <DropdownMenuTrigger
            render={<IconButton icon={DotsThreeIcon} label={`Menu ${width}`} tooltip={false} />}
          />
          <DropdownMenuContent width={width}>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem tone="critical">Delete 3 items</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const { width, pixels } of widths) {
      await userEvent.click(canvas.getByRole('button', { name: `Menu ${width}` }));
      const menu = await screen.findByRole('menu');
      await waitFor(() => expect(menu).toBeVisible());
      await expect(menu).toHaveAttribute('data-width', width);
      await waitFor(() => expect(menu.getBoundingClientRect().width).toBeCloseTo(pixels, 0));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    }
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

function StoryLink({ href, ref, onClick, ...props }: LinkComponentProps) {
  return (
    <a
      ref={ref}
      href={href}
      data-router-link=""
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    />
  );
}

export const LinkItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`DropdownMenuLinkItem` navigates with the product router, through `DesignSystemProvider linkComponent`. The menu closes after the click. `aria-current="page"` marks the current page.',
      },
    },
  },
  render: (args) => (
    <DesignSystemProvider linkComponent={StoryLink}>
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Settings</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuLinkItem href="#members" aria-current="page">
              <UserIcon />
              Members
            </DropdownMenuLinkItem>
            <DropdownMenuLinkItem href="#preferences">
              <GearIcon />
              Preferences
            </DropdownMenuLinkItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </DesignSystemProvider>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    const menu = await screen.findByRole('menu');
    const members = within(menu).getByRole('menuitem', { name: 'Members' });
    await expect(members).toHaveAttribute('href', '#members');
    await expect(members).toHaveAttribute('data-router-link');
    await expect(members).toHaveAttribute('aria-current', 'page');
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Preferences' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};
