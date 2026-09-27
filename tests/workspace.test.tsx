import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { KeyValueRow, KeyValueDraftRow } from '../src/components/key-value-editor.js';
import { DocumentTabs, DocumentTab, WorkspaceSplit } from '../src/blocks/workspace.js';

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
});
