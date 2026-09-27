import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditableText } from '../src/components/editable-text.js';

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
