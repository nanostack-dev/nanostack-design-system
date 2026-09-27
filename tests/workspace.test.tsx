import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { EditableText } from '../src/components/editable-text.js';
import {
  DocumentTabs,
  DocumentTab,
  WorkspaceSplit,
  useWorkspaceLayout,
  type WorkspaceLayoutStorage,
  type WorkspaceLayoutPersistence,
} from '../src/blocks/workspace.js';

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
