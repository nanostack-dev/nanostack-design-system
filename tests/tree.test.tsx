import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Tree, TreeBranch, TreeGroup, TreeItem, TreeItemButton } from '../src/blocks/workspace.js';

it('moves focus through visible enabled items, maintaining a single primary tab stop', async () => {
  const user = userEvent.setup();
  render(
    <Tree aria-label="Folders">
      <TreeItem aria-label="Root" tabIndex={0} selected>
        Root
      </TreeItem>
      <TreeBranch>
        <TreeItem aria-label="Expanded" tabIndex={-1} aria-expanded>
          Expanded
        </TreeItem>
        <TreeGroup>
          <TreeItem aria-label="Child" tabIndex={-1}>
            Child
          </TreeItem>
        </TreeGroup>
      </TreeBranch>
      <TreeItem aria-label="Disabled" tabIndex={-1} aria-disabled>
        Disabled
      </TreeItem>
      <TreeGroup hidden>
        <TreeItem aria-label="Hidden" tabIndex={-1}>
          Hidden
        </TreeItem>
      </TreeGroup>
      <TreeItem aria-label="Last" tabIndex={-1}>
        Last
      </TreeItem>
    </Tree>,
  );
  const root = screen.getByRole('treeitem', { name: 'Root' });
  await user.tab();
  expect(root).toHaveFocus();
  await user.keyboard('{ArrowDown}{ArrowDown}');
  expect(screen.getByRole('treeitem', { name: 'Child' })).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('treeitem', { name: 'Last' })).toHaveFocus();
  expect(root).toHaveAttribute('tabindex', '-1');
  await user.keyboard('{Home}');
  expect(root).toHaveFocus();
  await user.keyboard('{End}{ArrowUp}');
  expect(screen.getByRole('treeitem', { name: 'Child' })).toHaveFocus();
});

it('keeps item actions native and respects consumer prevention before navigation', async () => {
  const user = userEvent.setup();
  const activate = vi.fn();
  const handle = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') event.preventDefault();
  });
  render(
    <Tree aria-label="Requests" onKeyDown={handle}>
      <TreeItem>
        <TreeItemButton>First</TreeItemButton>
      </TreeItem>
      <TreeItem>
        <TreeItemButton onClick={activate}>Second</TreeItemButton>
      </TreeItem>
    </Tree>,
  );
  await user.tab();
  await user.keyboard('{ArrowDown}{Home}{Enter}');
  expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
  expect(activate).toHaveBeenCalledOnce();
  expect(handle).toHaveBeenCalled();
});
