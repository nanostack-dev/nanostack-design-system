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
    await user.click(table.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(table.getByText('Zoe')).toBeVisible();
    expect(screen.getByText('1 of 3 selected')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(table.getAllByRole('checkbox', { name: 'Select row' })[0]).toBeChecked();
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
