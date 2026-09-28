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
} from './menubar';

const onNewFile = fn();
const onOpenFile = fn();
const onUndo = fn();
const onWordWrapChange = fn();
const onZoomChange = fn();

const meta = {
  title: 'Components/Menubar',
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal bar of menus, as in a desktop application. Use it for editors and tools with many commands.\n\n**Nanostack addition:** `MenubarContent` is at least as wide as its trigger (minimum 12rem) and grows to fit long labels up to the available width.',
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
            <MenubarItem variant="destructive">
              Close all editors and discard unsaved changes
            </MenubarItem>
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
