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
} from '@/components/context-menu';

const onCopy = fn();
const onRename = fn();
const onDelete = fn();
const onShowHiddenChange = fn();
const onExport = fn();

const usage = `
A menu that opens on a right click, a long press, or the context menu key. Use it for the actions on an item in a canvas, a file tree or a table.

A context menu is hidden. Always give the same actions another way to open, such as a \`DropdownMenu\` on the row. For a visible menu use \`DropdownMenu\`.

The parts do not accept \`className\` or \`style\`. \`ContextMenuTrigger\` wraps the area that opens the menu. Put the area in \`render\` when it needs its own look, and give it \`tabIndex={0}\` when it is not already focusable.

## ContextMenuItem tone

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. Any action. |
| \`critical\` | An action that deletes or cannot be undone. Put it last, after a \`ContextMenuSeparator\`. |

## Other props

- \`inset\`: lines up the text of an item without an icon with the text of the items that have one.
- \`ContextMenuCheckboxItem\` and \`ContextMenuRadioItem\`: a setting that the menu changes.
- \`ContextMenuSub\`, \`ContextMenuSubTrigger\` and \`ContextMenuSubContent\`: a second level, such as "Export as".

The menu opens at the pointer, fits its labels, is at least 192 px wide, and stops at the edge of the viewport.

## Do not

- Do not use \`variant="destructive"\`. It is \`tone="critical"\` now.
- Do not put an action only in a context menu. Touch and keyboard users may never find it.
- Do not open a context menu on a text field. The browser menu there has Copy and Paste.
`;

const meta = {
  title: 'Components/Context Menu',
  parameters: {
    docs: {
      description: {
        component: usage,
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
        render={
          <div className="flex h-36 w-72 items-center justify-center rounded-3xl border border-dashed text-sm text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
        }
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
          <ContextMenuItem tone="critical" onClick={onDelete}>
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

export const CriticalItem: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`tone="critical"` marks an action that deletes. Its text uses `--destructive-on-tint`, so it passes WCAG AA on the menu and on its focus tint.',
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const area = canvas.getByText('Right-click the file area');
    await userEvent.pointer({ keys: '[MouseRight]', target: area });
    const menu = await screen.findByRole('menu');
    const remove = within(menu).getByRole('menuitem', { name: 'Delete' });
    await expect(remove).toHaveAttribute('data-tone', 'critical');
    await expect(remove).toHaveClass('text-destructive-on-tint');
    await userEvent.click(remove);
    await expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};
