import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
} from '../src/components/popover.js';
import { Autocomplete } from '../src/components/autocomplete.js';
import { Button } from '../src/components/button.js';
import { Theme } from '../src/theme.js';

function Suggestions({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState('');
  return (
    <Autocomplete
      label="Environment"
      value={value}
      onValueChange={setValue}
      suggestions={['production', 'preview', 'staging']}
      disabled={disabled}
    />
  );
}
describe('collection overlays', () => {
  it('restores trigger focus and preserves portal theme', async () => {
    const user = userEvent.setup();
    render(
      <Theme colorScheme="dark">
        <Popover>
          <PopoverTrigger>Fleet</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Workers</PopoverTitle>
            <Button>Inspect jobs</Button>
          </PopoverContent>
        </Popover>
      </Theme>,
    );
    const trigger = screen.getByRole('button', { name: 'Fleet' });
    await user.click(trigger);
    const popup = screen.getByRole('dialog', { name: 'Workers' });
    expect(popup.closest('.ns-theme')).toHaveAttribute('data-ns-theme', 'dark');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('selects suggestions with the keyboard and retains free text', async () => {
    const user = userEvent.setup();
    render(<Suggestions />);
    const input = screen.getByRole('combobox', { name: 'Environment' });
    await user.type(input, 'stag');
    await screen.findByRole('option', { name: 'staging' });
    await user.keyboard('{ArrowDown}{Enter}');
    expect(input).toHaveValue('staging');
    await user.clear(input);
    await user.type(input, 'future-region');
    await user.tab();
    expect(input).toHaveValue('future-region');
  });
  it('does not open a disabled field', async () => {
    const user = userEvent.setup();
    render(<Suggestions disabled />);
    const input = screen.getByRole('combobox', { name: 'Environment' });
    expect(input).toBeDisabled();
    await user.click(input);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
