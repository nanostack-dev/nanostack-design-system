import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { DataTable } from '../src/blocks/data-table.js';
import { CopyButton } from '../src/components/copy-button.js';
import { ConfirmationDialog } from '../src/blocks/confirmation-dialog.js';
import { TagInput } from '../src/components/tag-input.js';
import { TagAutocomplete } from '../src/components/tag-autocomplete.js';
import { Theme } from '../src/theme.js';
import { DocumentTheme } from '../src/components/document-theme.js';

// Geometry and real observer behavior are covered by the browser contracts.
beforeAll(() =>
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  ),
);
afterAll(() => vi.unstubAllGlobals());

describe('application catalog behavior', () => {
  it('labels each cell with its column header for the phone card layout', () => {
    render(
      <DataTable
        label="Endpoints"
        columns={[
          { accessorKey: 'name', header: 'Endpoint' },
          { accessorKey: 'request_count' },
          { id: 'actions', header: '', cell: () => 'Open' },
        ]}
        data={[{ name: 'Stripe', request_count: 12 }]}
        enableRowSelection
        getRowId={(endpoint) => endpoint.name}
      />,
    );
    const cells = within(screen.getByRole('table', { name: 'Endpoints' })).getAllByRole('cell');
    expect(cells.map((cell) => cell.getAttribute('data-ns-label'))).toEqual([
      null,
      'Endpoint',
      'request count',
      '',
    ]);
  });

  it('sorts client records before paging and preserves selected rows across pages', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        label="People"
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        data={[{ name: 'Zoe' }, { name: 'Amy' }, { name: 'Kai' }]}
        initialPageSize={2}
        pageSizeOptions={[2, 3]}
        enableRowSelection
        getRowId={(person) => person.name}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Name' }));
    const table = within(screen.getByRole('table', { name: 'People' }));
    expect(table.getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '',
      'Amy',
      '',
      'Kai',
    ]);
    await user.click(table.getByRole('checkbox', { name: 'Select Amy' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(table.getByText('Zoe')).toBeVisible();
    expect(screen.getByText('1 of 3 selected')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(table.getByRole('checkbox', { name: 'Select Amy' })).toBeChecked();
  });

  it('keys manual-mode selection by row ID across server pages and reports it', async () => {
    const user = userEvent.setup();
    const changes: string[][] = [];
    const runs = Array.from({ length: 42 }, (_, index) => ({
      id: `run-${index + 1}`,
      name: `Run ${index + 1}`,
    }));
    function ServerRuns() {
      const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
      const start = pagination.pageIndex * pagination.pageSize;
      return (
        <DataTable
          label="Runs"
          mode="manual"
          columns={[{ accessorKey: 'name', header: 'Name' }]}
          data={runs.slice(start, start + pagination.pageSize)}
          rowCount={runs.length}
          pagination={pagination}
          onPaginationChange={(update) =>
            setPagination((current) => (typeof update === 'function' ? update(current) : update))
          }
          enableRowSelection
          getRowId={(run) => run.id}
          onSelectedRowIdsChange={(ids) => changes.push(ids)}
        />
      );
    }
    render(<ServerRuns />);
    const table = within(screen.getByRole('table', { name: 'Runs' }));
    await user.click(table.getByRole('checkbox', { name: 'Select Run 1' }));
    expect(changes.at(-1)).toEqual(['run-1']);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(table.getByRole('checkbox', { name: 'Select Run 11' })).not.toBeChecked();
    expect(table.getByRole('row', { name: /Run 11/ })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('1 of 42 selected')).toBeVisible();
    await user.click(table.getByRole('checkbox', { name: 'Select all visible rows' }));
    expect(changes.at(-1)).toHaveLength(11);
    expect(changes.at(-1)).toContain('run-1');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(table.getByRole('checkbox', { name: 'Select Run 1' })).toBeChecked();
    expect(table.getByRole('checkbox', { name: 'Select Run 2' })).not.toBeChecked();
    expect(screen.getByText('11 of 42 selected')).toBeVisible();
  });

  it('reads controlled selection for checkboxes and row highlight alike', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <DataTable
        label="Flows"
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        data={[
          { id: 'flow-a', name: 'Checkout' },
          { id: 'flow-b', name: 'Signup' },
        ]}
        enableRowSelection
        getRowId={(flow) => flow.id}
        getRowLabel={(flow) => `${flow.name} flow`}
        selectedRowIds={['flow-b']}
        onSelectedRowIdsChange={change}
      />,
    );
    const table = within(screen.getByRole('table', { name: 'Flows' }));
    expect(table.getByRole('checkbox', { name: 'Select Signup flow' })).toBeChecked();
    expect(table.getByRole('row', { name: /Signup/ })).toHaveAttribute('aria-selected', 'true');
    expect(table.getByRole('row', { name: /Checkout/ })).toHaveAttribute('aria-selected', 'false');
    await user.click(table.getByRole('checkbox', { name: 'Select Checkout flow' }));
    expect(change).toHaveBeenCalledWith(['flow-b', 'flow-a']);
    expect(table.getByRole('checkbox', { name: 'Select Checkout flow' })).not.toBeChecked();
  });

  it('highlights the application-selected row when the table has no checkboxes', () => {
    render(
      <DataTable
        label="Environments"
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        data={[{ name: 'Production' }, { name: 'Staging' }]}
        isRowSelected={(environment) => environment.name === 'Staging'}
      />,
    );
    const table = within(screen.getByRole('table', { name: 'Environments' }));
    expect(table.queryByRole('checkbox')).toBeNull();
    expect(table.getByRole('row', { name: /Staging/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('delegates manual pagination without silently slicing the server page', async () => {
    const user = userEvent.setup();
    const changePage = vi.fn();
    render(
      <DataTable
        label="Server records"
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        data={[{ name: 'Record 21' }]}
        mode="manual"
        pagination={{ pageIndex: 2, pageSize: 10 }}
        rowCount={42}
        onPaginationChange={changePage}
      />,
    );
    expect(screen.getByText('Record 21')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(changePage).toHaveBeenCalledWith({ pageIndex: 3, pageSize: 10 });
    expect(screen.getByText('Page 3 of 5')).toBeVisible();
  });

  it('announces clipboard failure only after the write completes', async () => {
    const user = userEvent.setup();
    const failed = vi.fn();
    render(
      <CopyButton
        value="secret"
        label="Copy token"
        copyText={async () => false}
        onCopyFailed={failed}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy token' }));
    expect(await screen.findByRole('button', { name: 'Copy failed' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
    expect(failed).toHaveBeenCalledOnce();
  });

  it('keeps destructive confirmation open until the application completes its work', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const close = vi.fn();
    render(
      <ConfirmationDialog
        open
        onOpenChange={close}
        severity="destructive"
        title="Delete record?"
        description="This removes the record."
        actionLabel="Delete"
        onAction={action}
      />,
    );
    await user.click(screen.getByRole('button', { name: /^Delete$/ }));
    expect(action).toHaveBeenCalledOnce();
    expect(close).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(close).toHaveBeenCalledWith(false);
  });

  it('ignores a held key and repeat activation while the confirmation is pending', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    function PendingConfirmation() {
      const [pending, setPending] = useState(false);
      return (
        <ConfirmationDialog
          open
          onOpenChange={() => undefined}
          severity="destructive"
          title="Delete record?"
          description="This removes the record."
          actionLabel="Delete"
          pending={pending}
          onAction={() => {
            action();
            setPending(true);
          }}
        />
      );
    }
    render(<PendingConfirmation />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
    await user.tab();
    const button = screen.getByRole('button', { name: /^Delete$/ });
    expect(button).toHaveFocus();
    await user.keyboard('{Enter>4/}');
    expect(action).toHaveBeenCalledOnce();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await user.click(button);
    expect(action).toHaveBeenCalledOnce();
  });

  it('treats a held Enter key as one confirmation even without a pending state', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ConfirmationDialog
        open
        onOpenChange={() => undefined}
        title="Archive record?"
        description="The record moves to the archive."
        actionLabel="Archive"
        onAction={action}
      />,
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
    await user.tab();
    expect(screen.getByRole('button', { name: /^Archive$/ })).toHaveFocus();
    await user.keyboard('{Enter>4/}');
    expect(action).toHaveBeenCalledOnce();
  });

  it('commits and removes controlled tags while preserving validation errors', async () => {
    const user = userEvent.setup();
    function Tags() {
      const [value, onChange] = useState<string[]>([]);
      return (
        <TagInput
          value={value}
          onChange={onChange}
          aria-label="Tags"
          validateTag={(tag) => (tag.includes(' ') ? 'No spaces' : null)}
        />
      );
    }
    render(<Tags />);
    await user.type(screen.getByRole('textbox', { name: 'Tags' }), 'hello{Enter}');
    await user.type(screen.getByRole('textbox', { name: 'Tags' }), 'two words{Enter}');
    expect(screen.getByText('No spaces')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Tags' })).toHaveValue('two words');
    await user.click(screen.getByRole('button', { name: 'Remove tag hello' }));
    expect(screen.queryByRole('button', { name: 'Remove tag hello' })).not.toBeInTheDocument();
  });

  it('does not allow disabled tag removals', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagAutocomplete
        value={['production']}
        onChange={onChange}
        suggestions={[]}
        disabled
        aria-label="Tags"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Remove production' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('only themes the host document when explicitly mounted and restores its previous state', () => {
    const root = document.documentElement;
    root.setAttribute('data-ns-brand', 'previous');
    const view = render(
      <Theme brand="anchor" colorScheme="dark">
        <DocumentTheme />
      </Theme>,
    );
    expect(root).toHaveAttribute('data-ns-brand', 'anchor');
    expect(root).toHaveClass('dark', 'ns-document');
    view.unmount();
    expect(root).toHaveAttribute('data-ns-brand', 'previous');
    expect(root).not.toHaveClass('ns-document');
    root.removeAttribute('data-ns-brand');
  });
});
