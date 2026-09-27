import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { TagAutocomplete } from '../src/components/tag-autocomplete.js';
import { TagInput } from '../src/components/tag-input.js';
import { Command, CommandInput, CommandItem, CommandList } from '../src/components/command.js';
import { Dialog, DialogPopup, DialogTitle } from '../src/components/dialog.js';
import { Button } from '../src/components/button.js';
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

function FreeTags({ initial = [] }: { initial?: string[] }) {
  const [tags, setTags] = useState<string[]>(initial);
  return <TagInput aria-label="Labels" value={tags} onChange={setTags} />;
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

  it('keeps a rejected value in the input next to its error', async () => {
    const user = userEvent.setup();
    render(
      <Suggestions validateTag={(tag) => (tag.length > 5 ? 'Use at most 5 characters' : null)} />,
    );
    const input = screen.getByRole('combobox', { name: 'Tags' });
    await user.type(input, 'toolong{Enter}');
    expect(screen.getByText('Use at most 5 characters')).toBeVisible();
    expect(input).toHaveValue('toolong');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('returns focus to the input after a keyboard removal', async () => {
    const user = userEvent.setup();
    render(<Suggestions initial={['alpha', 'beta']} />);
    screen.getByRole('button', { name: 'Remove alpha' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('button', { name: 'Remove alpha' })).toBeNull();
    const input = screen.getByRole('combobox', { name: 'Tags' });
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes its list on Escape without closing the dialog, then lets Escape close it', async () => {
    const user = userEvent.setup();
    function TagsInDialog() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogPopup>
              <DialogTitle>Edit flow</DialogTitle>
              <Suggestions />
              <Button>Save</Button>
            </DialogPopup>
          </Dialog>
          <p>{open ? 'Dialog open' : 'Dialog closed'}</p>
        </>
      );
    }
    render(<TagsInDialog />);
    const input = screen.getByRole('combobox', { name: 'Tags' });
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Dialog open')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByText('Dialog closed')).toBeInTheDocument());
  });

  it('collapses the list when focus tabs out of the field', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Suggestions />
        <Button>Save</Button>
      </>,
    );
    const input = screen.getByRole('combobox', { name: 'Tags' });
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'false');
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

describe('TagInput', () => {
  it('does not commit while an input method editor is composing', () => {
    render(<FreeTags />);
    const input = screen.getByRole('textbox', { name: 'Labels' });
    fireEvent.change(input, { target: { value: 'にほん' } });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
    expect(screen.queryByRole('button', { name: 'Remove tag にほん' })).toBeNull();
    expect(input).toHaveValue('にほん');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Remove tag にほん' })).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('returns focus to the input after a keyboard removal', async () => {
    const user = userEvent.setup();
    render(<FreeTags initial={['alpha', 'beta']} />);
    screen.getByRole('button', { name: 'Remove tag alpha' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('button', { name: 'Remove tag alpha' })).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Labels' })).toHaveFocus();
  });
});
