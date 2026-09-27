import { useState } from 'react';
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
  expect(screen.getByRole('treeitem', { name: 'First' })).toHaveFocus();
  await user.keyboard('{ArrowDown}{Home}{Enter}');
  expect(screen.getByRole('treeitem', { name: 'Second' })).toHaveFocus();
  expect(activate).toHaveBeenCalledOnce();
  await user.keyboard(' ');
  expect(activate).toHaveBeenCalledTimes(2);
  expect(handle).toHaveBeenCalled();
});

interface Node {
  name: string;
  children?: Node[];
}

const nodes: Node[] = [
  {
    name: 'Billing',
    children: [{ name: 'Invoices', children: [{ name: 'List invoices' }] }, { name: 'Refunds' }],
  },
  { name: 'Customers', children: [{ name: 'Create customer' }] },
  { name: 'Health check' },
];

function Branch({ node, opened }: { node: Node; opened: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <TreeBranch>
      <TreeItem
        expanded={node.children ? open : undefined}
        onExpandedChange={setOpen}
        aria-label={node.name}
      >
        <TreeItemButton onClick={() => opened(node.name)}>{node.name}</TreeItemButton>
      </TreeItem>
      {node.children && open ? (
        <TreeGroup>
          {node.children.map((child) => (
            <Branch key={child.name} node={child} opened={opened} />
          ))}
        </TreeGroup>
      ) : null}
    </TreeBranch>
  );
}

function renderCollections(opened = vi.fn()) {
  render(
    <>
      <Tree aria-label="Collections">
        {nodes.map((node) => (
          <Branch key={node.name} node={node} opened={opened} />
        ))}
      </Tree>
      <button>After tree</button>
    </>,
  );
  return opened;
}

const item = (name: string) => screen.getByRole('treeitem', { name });
const tabStops = () =>
  [...screen.getByRole('tree').querySelectorAll('[tabindex="0"]')].map((element) =>
    element.getAttribute('aria-label'),
  );

it('expands, enters, leaves and collapses branches with Arrow Right and Arrow Left', async () => {
  const user = userEvent.setup();
  renderCollections();
  await user.tab();
  expect(item('Billing')).toHaveFocus();
  expect(item('Billing')).toHaveAttribute('aria-expanded', 'false');
  await user.keyboard('{ArrowRight}');
  expect(item('Billing')).toHaveAttribute('aria-expanded', 'true');
  expect(item('Billing')).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(item('Invoices')).toHaveFocus();
  await user.keyboard('{ArrowRight}{ArrowRight}');
  expect(item('List invoices')).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(item('List invoices')).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expect(item('Invoices')).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expect(item('Invoices')).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('treeitem', { name: 'List invoices' })).toBeNull();
  await user.keyboard('{ArrowLeft}');
  expect(item('Billing')).toHaveFocus();
  await user.keyboard('{End}');
  expect(item('Health check')).toHaveFocus();
  await user.keyboard('{ArrowLeft}{Home}');
  expect(item('Billing')).toHaveFocus();
  expect(tabStops()).toEqual(['Billing']);
});

it('cycles through items starting with a repeated typed character', async () => {
  const user = userEvent.setup();
  renderCollections();
  await user.tab();
  await user.keyboard('{ArrowDown}{ArrowRight}');
  await user.keyboard('c');
  expect(item('Create customer')).toHaveFocus();
  await user.keyboard('c');
  expect(item('Customers')).toHaveFocus();
  await user.keyboard('c');
  expect(item('Create customer')).toHaveFocus();
  expect(tabStops()).toEqual(['Create customer']);
});

it('moves to the first item matching several typed characters', async () => {
  const user = userEvent.setup();
  renderCollections();
  await user.tab();
  await user.keyboard('{ArrowDown}{ArrowRight}{Home}');
  await user.keyboard('cr');
  expect(item('Create customer')).toHaveFocus();
});

it('keeps exactly one valid tab stop while items expand and disappear in child state', async () => {
  const user = userEvent.setup();
  const opened = renderCollections();
  await user.tab();
  await user.keyboard('{ArrowRight}{ArrowDown}');
  expect(item('Invoices')).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(tabStops()).toEqual(['Invoices']);
  await user.keyboard('{ArrowUp}{ArrowLeft}');
  expect(screen.queryByRole('treeitem', { name: 'Invoices' })).toBeNull();
  await user.tab();
  expect(screen.getByRole('button', { name: 'After tree' })).toHaveFocus();
  await user.tab({ shift: true });
  expect(item('Billing')).toHaveFocus();
  expect(tabStops()).toEqual(['Billing']);
  await user.keyboard('{Enter}');
  expect(opened).toHaveBeenCalledExactlyOnceWith('Billing');
});
