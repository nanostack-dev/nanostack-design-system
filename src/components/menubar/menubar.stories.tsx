import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/menubar';

const onNewFile = fn();
const onOpenFile = fn();
const onUndo = fn();
const onWordWrapChange = fn();
const onZoomChange = fn();

const usage = `
A horizontal bar of menus, as in a desktop application: File, Edit, View. Use it for an editor or a tool with many commands.

For the actions of one item use \`DropdownMenu\`. For site navigation use \`NavigationMenu\`. For a toolbar of buttons use \`Inline\` with \`Button\`.

The parts do not accept \`className\` or \`style\`. \`MenubarContent\` fits its labels. It is at least as wide as its trigger and 192 px, and it stops at the edge of the viewport.

## MenubarItem tone

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. Any command. |
| \`critical\` | A command that deletes or discards work, such as "Close without saving". Put it last, after a \`MenubarSeparator\`. |

## Other props

- \`inset\` on \`MenubarItem\`, \`MenubarLabel\` and \`MenubarSubTrigger\`: lines up an item without an icon with the items that have one.
- \`MenubarCheckboxItem\` and \`MenubarRadioItem\`: a setting, such as "Word wrap" or the zoom level. The check mark is on the left, as in a desktop menu.
- \`MenubarShortcut\`: the keyboard shortcut of the command. Show it only when the shortcut really works.

## Do not

- Do not use \`variant="destructive"\`. It is \`tone="critical"\` now.
- Do not put a menubar on a page that has fewer than three menus. Use buttons or a \`DropdownMenu\`.
- Do not use a menubar for navigation between pages.
`;

const meta = {
  title: 'Components/Menubar',
  parameters: {
    docs: {
      description: {
        component: usage,
      },
    },
  },
  component: Menubar,
  beforeEach: () => {
    for (const callback of [onNewFile, onOpenFile, onUndo, onWordWrapChange, onZoomChange]) {
      callback.mockClear();
    }
  },
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem onClick={onNewFile}>
              New file
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onOpenFile}>Open file</MenubarItem>
            <MenubarItem disabled>Share</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem tone="critical">Close all editors and discard unsaved changes</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem onClick={onUndo}>
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarCheckboxItem onCheckedChange={onWordWrapChange}>Word wrap</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel>Zoom</MenubarLabel>
            <MenubarRadioGroup defaultValue="100" onValueChange={onZoomChange}>
              <MenubarRadioItem value="100">100%</MenubarRadioItem>
              <MenubarRadioItem value="125">125%</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('menubar')).toBeVisible();
    const file = canvas.getByRole('menuitem', { name: 'File' });
    await userEvent.click(file);
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(menu).toBeVisible());
    await expect(file).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Open file' }));
    await expect(onOpenFile).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(file).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const file = canvas.getByRole('menuitem', { name: 'File' });
    const edit = canvas.getByRole('menuitem', { name: 'Edit' });
    await userEvent.tab();
    await expect(file).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(edit).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(file).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const fileMenu = await screen.findByRole('menu');
    const newFile = within(fileMenu).getByRole('menuitem', { name: /New file/ });
    await waitFor(() => expect(newFile).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(fileMenu).getByRole('menuitem', { name: 'Open file' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(file).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowDown}');
    const editMenu = await screen.findByRole('menu');
    const undo = within(editMenu).getByRole('menuitem', { name: /Undo/ });
    await waitFor(() => expect(undo).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(onUndo).toHaveBeenCalledOnce();
    await waitFor(() => expect(edit).toHaveFocus());
    await expect(onNewFile).not.toHaveBeenCalled();
  },
};

export const CheckboxAndRadio: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('menuitem', { name: 'View' }));
    const menu = await screen.findByRole('menu');
    const wordWrap = within(menu).getByRole('menuitemcheckbox', { name: 'Word wrap' });
    await userEvent.click(wordWrap);
    await expect(onWordWrapChange).toHaveBeenCalledWith(true, expect.anything());
    await expect(wordWrap).toHaveAttribute('aria-checked', 'true');
    const zoom = within(menu).getByRole('menuitemradio', { name: '125%' });
    await userEvent.click(zoom);
    await expect(onZoomChange).toHaveBeenCalledWith('125', expect.anything());
    await expect(zoom).toHaveAttribute('aria-checked', 'true');
  },
};

const longLabel = 'Close all editors and discard unsaved changes';

export const LongLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Nanostack fix: the menu grows past the trigger width to show a long label in full.',
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const file = canvas.getByRole('menuitem', { name: 'File' });
    await userEvent.click(file);
    const menu = await screen.findByRole('menu');
    const item = within(menu).getByRole('menuitem', { name: longLabel });
    const openFile = within(menu).getByRole('menuitem', { name: 'Open file' });
    await waitFor(() =>
      expect(item.getBoundingClientRect().height).toBeCloseTo(
        openFile.getBoundingClientRect().height,
        0,
      ),
    );
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
    await expect(menu.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const CriticalItem: Story = {
  parameters: {
    docs: {
      description: {
        story: '`tone="critical"` marks a command that discards work.',
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('menuitem', { name: 'File' }));
    const menu = await screen.findByRole('menu');
    const discard = within(menu).getByRole('menuitem', { name: longLabel });
    await expect(discard).toHaveAttribute('data-tone', 'critical');
    await expect(discard).toHaveClass('text-destructive-on-tint');
    await expect(within(menu).getByRole('menuitem', { name: 'Open file' })).toHaveAttribute(
      'data-tone',
      'neutral',
    );
  },
};
