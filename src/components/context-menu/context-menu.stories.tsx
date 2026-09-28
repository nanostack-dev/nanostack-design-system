import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, screen, waitFor, within } from 'storybook/test';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

const onCopy = fn();
const onRename = fn();
const onDelete = fn();
const onShowHiddenChange = fn();
const onExport = fn();

const meta = {
  title: 'Components/Context Menu',
  parameters: {
    docs: {
      description: {
        component:
          'A menu that opens on a right click or a long press. Use it for secondary actions on an item. Always give the same actions another way to open.',
      },
    },
  },
  component: ContextMenu,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    for (const callback of [onCopy, onRename, onDelete, onShowHiddenChange, onExport]) {
      callback.mockClear();
    }
  },
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger
        tabIndex={0}
        className="flex h-36 w-72 items-center justify-center rounded-3xl border border-dashed text-sm text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Right-click the file area
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>report.pdf</ContextMenuLabel>
          <ContextMenuItem onClick={onCopy}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem onClick={() => onExport('csv')}>CSV</ContextMenuItem>
                <ContextMenuItem onClick={() => onExport('json')}>JSON</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem onCheckedChange={onShowHiddenChange}>
            Show hidden files
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive" onClick={onDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const area = canvas.getByText('Right-click the file area');
    await userEvent.pointer({ keys: '[MouseRight]', target: area });
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(menu).toBeVisible());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Rename' }));
    await expect(onRename).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const area = canvas.getByText('Right-click the file area');
    await userEvent.tab();
    await expect(area).toHaveFocus();
    fireEvent.contextMenu(area);
    const menu = await screen.findByRole('menu');
    const copy = within(menu).getByRole('menuitem', { name: /Copy/ });
    const rename = within(menu).getByRole('menuitem', { name: 'Rename' });
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(copy).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(rename).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(copy).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onCopy).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(area).toHaveFocus());
  },
};

export const EscapeCloses: Story = {
  play: async ({ canvas, userEvent }) => {
    const area = canvas.getByText('Right-click the file area');
    await userEvent.tab();
    fireEvent.contextMenu(area);
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(area).toHaveFocus());
    await expect(onDelete).not.toHaveBeenCalled();
  },
};

export const CheckboxAndSubmenu: Story = {
  play: async ({ canvas, userEvent }) => {
    const area = canvas.getByText('Right-click the file area');
    await userEvent.pointer({ keys: '[MouseRight]', target: area });
    const menu = await screen.findByRole('menu');
    const hidden = within(menu).getByRole('menuitemcheckbox', { name: 'Show hidden files' });
    await expect(hidden).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(hidden);
    await expect(onShowHiddenChange).toHaveBeenCalledWith(true, expect.anything());
    await expect(hidden).toHaveAttribute('aria-checked', 'true');
    const exportAs = within(menu).getByRole('menuitem', { name: 'Export as' });
    await userEvent.hover(exportAs);
    await waitFor(() => expect(exportAs).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    const csv = await screen.findByRole('menuitem', { name: 'CSV' });
    await waitFor(() => expect(csv).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'JSON' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onExport).toHaveBeenCalledWith('json');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};
