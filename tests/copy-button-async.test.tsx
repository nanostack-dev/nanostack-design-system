import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CopyButton } from '../src/components/copy-button.js';

function deferred() {
  let resolve!: (value: boolean) => void;
  const promise = new Promise<boolean>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

describe('clipboard asynchronous completion', () => {
  it('keeps success silent until completion and ignores a stale overlapping attempt', async () => {
    const user = userEvent.setup();
    const first = deferred();
    const latest = deferred();
    const copy = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(latest.promise);
    const copied = vi.fn();
    const failed = vi.fn();
    render(
      <CopyButton
        value="token"
        label="Copy token"
        copyText={copy}
        onCopied={copied}
        onCopyFailed={failed}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy token' }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(copied).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Copy token' }));
    await act(async () => {
      latest.resolve(false);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
    await act(async () => {
      first.resolve(true);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
    expect(copied).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledOnce();
  });
  it('does not call completion callbacks after unmount', async () => {
    const user = userEvent.setup();
    const pending = deferred();
    const copied = vi.fn();
    const view = render(
      <CopyButton
        value="token"
        label="Copy token"
        copyText={() => pending.promise}
        onCopied={copied}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy token' }));
    view.unmount();
    await act(async () => {
      pending.resolve(true);
    });
    expect(copied).not.toHaveBeenCalled();
  });
  it('announces a rejected write as failure', async () => {
    const user = userEvent.setup();
    const failed = vi.fn();
    render(
      <CopyButton
        value="token"
        label="Copy token"
        copyText={async () => {
          throw new Error('Clipboard denied');
        }}
        onCopyFailed={failed}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy token' }));
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
    expect(failed).toHaveBeenCalledOnce();
  });
});
