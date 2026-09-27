import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { TagAutocomplete } from '../src/components/tag-autocomplete.js';
import { Command, CommandInput, CommandItem, CommandList } from '../src/components/command.js';
import { Label } from '../src/components/layout.js';

// cmdk measures and scrolls its list; jsdom has neither API.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
});
afterAll(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
});

function Suggestions(props: {
  inputId?: string;
  validateTag?: (tag: string) => string | null;
  initial?: string[];
}) {
  const [tags, setTags] = useState<string[]>(props.initial ?? []);
  return (
    <TagAutocomplete
      {...(props.inputId ? { inputId: props.inputId } : { 'aria-label': 'Tags' })}
      {...(props.validateTag ? { validateTag: props.validateTag } : {})}
      value={tags}
      onChange={setTags}
      suggestions={['alpha', 'beta']}
    />
  );
}

describe('TagAutocomplete', () => {
  it('lets an external label name and focus the input through inputId', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="flow-tags">Flow tags</Label>
        <Suggestions inputId="flow-tags" />
      </>,
    );
    const input = screen.getByLabelText('Flow tags');
    expect(input).toHaveAttribute('id', 'flow-tags');
    expect(screen.getByRole('combobox', { name: 'Flow tags' })).toBe(input);
    await user.click(screen.getByText('Flow tags'));
    expect(input).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveFocus();
    expect(screen.getByRole('option', { name: 'beta' })).toHaveAttribute('aria-selected', 'true');
    await user.type(input, 'al');
    expect(input).toHaveFocus();
    expect(input).toHaveValue('al');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Remove alpha' })).toBeVisible();
  });
});

describe('CommandInput', () => {
  it('uses a consumer id so an external label names the input', () => {
    render(
      <Command label="Commands">
        <Label htmlFor="command-query">Search commands</Label>
        <CommandInput id="command-query" />
        <CommandList>
          <CommandItem value="deploy">Deploy</CommandItem>
        </CommandList>
      </Command>,
    );
    const input = screen.getByRole('combobox', { name: 'Search commands' });
    expect(input).toHaveAttribute('id', 'command-query');
  });
});
