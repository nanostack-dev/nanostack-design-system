import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { KeyValueRow, KeyValueDraftRow } from '../src/components/key-value-editor.js';
import { EditableText } from '../src/components/editable-text.js';
import {
  DocumentTabs,
  DocumentTab,
  WorkspaceSplit,
  useWorkspaceLayout,
  type WorkspaceLayoutStorage,
  type WorkspaceLayoutPersistence,
} from '../src/blocks/workspace.js';

describe('key/value editing', () => {
  it('buffers key renames, refuses duplicates, and cancels with Escape', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <>
        <KeyValueRow
          keyValue="Accept"
          value="json"
          reservedKeys={['Authorization']}
          onKeyChange={change}
        />
        <button>Leave row</button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Accept' }));
    const input = screen.getByRole('textbox', { name: 'name name' });
    await user.clear(input);
    await user.type(input, 'Authorization');
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Leave row' }));
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(change).not.toHaveBeenCalled();
    await user.click(input);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Accept' })).toBeVisible();
  });
  it('opens a field only when its button is activated and returns focus after Enter or Escape', async () => {
    const user = userEvent.setup();
    const renamed = vi.fn();
    const changed = vi.fn();
    const editing = vi.fn();
    render(
      <>
        <button>Before row</button>
        <KeyValueRow
          keyValue="Accept"
          value="{{host}}/json"
          variables={[{ name: 'host', value: 'https://example.com' }]}
          onKeyChange={renamed}
          onValueChange={changed}
          onFocusChange={editing}
        />
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Before row' }));
    await user.tab();
    const keyButton = screen.getByRole('button', { name: 'Accept' });
    expect(keyButton).toHaveFocus();
    expect(screen.queryByRole('textbox')).toBeNull();
    await user.keyboard('{Enter}');
    const keyInput = screen.getByRole('textbox', { name: 'name name' });
    expect(keyInput).toHaveFocus();
    expect(editing).toHaveBeenLastCalledWith(true);
    await user.clear(keyInput);
    await user.keyboard('Content-Type{Enter}');
    expect(renamed).toHaveBeenCalledExactlyOnceWith('Content-Type');
    expect(screen.getByRole('button', { name: 'Accept' })).toHaveFocus();
    expect(editing).toHaveBeenLastCalledWith(false);
    await user.tab();
    const valueButton = screen.getByRole('button', { name: '{{host}}/json' });
    expect(valueButton).toHaveFocus();
    expect(screen.queryByRole('textbox')).toBeNull();
    await user.keyboard(' ');
    await user.keyboard('/v2{Escape}');
    expect(changed).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '{{host}}/json' })).toHaveFocus();
    await user.keyboard('{Enter}/v2{Enter}');
    expect(changed).toHaveBeenCalledExactlyOnceWith('{{host}}/json/v2');
    expect(screen.getByRole('button', { name: '{{host}}/json' })).toHaveFocus();
  });

  it('keeps a rejected rename and its error visible when focus moves on', async () => {
    const user = userEvent.setup();
    const renamed = vi.fn();
    render(
      <KeyValueRow
        keyValue="Accept"
        value="json"
        keyPlaceholder="header"
        reservedKeys={['Authorization']}
        onKeyChange={renamed}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Accept' }));
    const input = screen.getByRole('textbox', { name: 'header name' });
    await user.clear(input);
    await user.type(input, 'Authorization');
    await user.tab();
    expect(screen.getByRole('button', { name: 'json' })).toHaveFocus();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Authorization');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('There is already a header called Authorization.');
    expect(screen.getByRole('alert')).toHaveTextContent('There is already a header called');
    await user.click(screen.getByRole('button', { name: 'json' }));
    expect(screen.getByRole('textbox', { name: 'Accept value' })).toHaveFocus();
    expect(input).toHaveValue('Authorization');
    await user.click(input);
    await user.clear(input);
    await user.keyboard('X-Trace{Enter}');
    expect(renamed).toHaveBeenCalledExactlyOnceWith('X-Trace');
  });

  it('renders value variables inside the value button without nested tab stops', () => {
    render(
      <KeyValueRow
        keyValue="Accept"
        value="{{host}}/json"
        variables={[{ name: 'host', value: 'https://example.com' }]}
      />,
    );
    const valueButton = screen.getByRole('button', { name: '{{host}}/json' });
    expect(valueButton.querySelector('[tabindex]')).toBeNull();
    expect(valueButton.querySelector('[data-variable="host"]')).toHaveAttribute(
      'data-ns-resolved',
      'true',
    );
  });

  it('commits the standing draft only after both fields lose focus', async () => {
    const user = userEvent.setup();
    const commit = vi.fn();
    render(
      <>
        <KeyValueDraftRow keyPlaceholder="header" onCommit={commit} />
        <button>Leave row</button>
      </>,
    );
    await user.type(screen.getByRole('textbox', { name: 'New header' }), 'Accept');
    await user.tab();
    expect(commit).not.toHaveBeenCalled();
    await user.keyboard('application/json');
    await user.click(screen.getByRole('button', { name: 'Leave row' }));
    expect(commit).toHaveBeenCalledExactlyOnceWith('Accept', 'application/json');
    expect(screen.getByRole('textbox', { name: 'New header' })).toHaveValue('');
  });
  it('keeps readonly rows and disabled draft rows inert', async () => {
    const user = userEvent.setup();
    const remove = vi.fn();
    const commit = vi.fn();
    render(
      <>
        <KeyValueRow keyValue="Authorization" value="masked" readOnly onRemove={remove} />
        <KeyValueDraftRow disabled onCommit={commit} />
      </>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.every((input) => (input as HTMLInputElement).disabled)).toBe(true);
    await user.tab();
    expect(commit).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});

describe('editable text', () => {
  it('returns focus to the text button after Enter commits or Escape cancels', async () => {
    const user = userEvent.setup();
    const commit = vi.fn();
    function Harness() {
      const [name, setName] = useState('List invoices');
      return (
        <EditableText
          value={name}
          label="Request name"
          onCommit={(next) => {
            commit(next);
            setName(next);
          }}
        />
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'List invoices' }));
    const input = screen.getByRole('textbox', { name: 'Request name' });
    await user.clear(input);
    await user.keyboard('Refund invoices{Enter}');
    expect(commit).toHaveBeenCalledExactlyOnceWith('Refund invoices');
    expect(screen.getByRole('button', { name: 'Refund invoices' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' draft{Escape}');
    expect(commit).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Refund invoices' })).toHaveFocus();
  });
});

describe('document tabs', () => {
  it('selects and closes documents with separate accessible buttons', async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    function Harness() {
      const [selected, setSelected] = useState('one');
      return (
        <DocumentTabs aria-label="Documents">
          <DocumentTab
            label="One"
            active={selected === 'one'}
            onSelect={() => setSelected('one')}
            onClose={close}
          />
          <DocumentTab
            label="Two"
            dirty
            active={selected === 'two'}
            onSelect={() => setSelected('two')}
            onClose={close}
          />
        </DocumentTabs>
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Two' }));
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-current', 'true');
    await user.click(screen.getByRole('button', { name: 'Close Two tab, unsaved' }));
    expect(close).toHaveBeenCalledOnce();
  });
});

describe('workspace split', () => {
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

  it('starts a pane collapsed by a stored layout as inert', () => {
    render(
      <WorkspaceSplit
        label="Resize panes"
        defaultLayout={{ primary: 100, secondary: 0 }}
        primary={<button>Primary action</button>}
        secondary={<button>Secondary action</button>}
      />,
    );
    expect(screen.getByText('Secondary action').closest('[inert]')).not.toBeNull();
    expect(screen.getByText('Primary action').closest('[inert]')).toBeNull();
  });

  it('gives each split unique pane ids for its separator to control', () => {
    const { container } = render(
      <>
        <WorkspaceSplit
          label="Resize request"
          primary={<p>Request</p>}
          secondary={<p>Response</p>}
        />
        <WorkspaceSplit label="Resize preview" primary={<p>Source</p>} secondary={<p>Preview</p>} />
      </>,
    );
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('primary');
    for (const name of ['Resize request', 'Resize preview']) {
      const controlled = screen.getByRole('separator', { name }).getAttribute('aria-controls');
      expect(controlled && document.getElementById(controlled)).toBeTruthy();
    }
    const request = screen.getByRole('separator', { name: 'Resize request' });
    const preview = screen.getByRole('separator', { name: 'Resize preview' });
    expect(request.getAttribute('aria-controls')).not.toBe(preview.getAttribute('aria-controls'));
  });

  it('restores a stored layout with library keys', () => {
    const values = new Map<string, string>();
    const storage: WorkspaceLayoutStorage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => void values.set(key, value),
    };
    const restored: unknown[] = [];
    let store: WorkspaceLayoutPersistence['onLayoutChanged'] | undefined;
    function Persisted() {
      const persistence = useWorkspaceLayout({ id: 'request-split', storage });
      restored.push(persistence.defaultLayout);
      store = persistence.onLayoutChanged;
      return null;
    }
    const { unmount } = render(<Persisted />);
    expect(restored.at(-1)).toBeUndefined();
    act(() => store?.({ primary: 70, secondary: 30 }, { isUserInteraction: true }));
    unmount();
    render(<Persisted />);
    expect(restored.at(-1)).toEqual({ primary: 70, secondary: 30 });
  });
});
