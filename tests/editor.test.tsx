import { createRef, useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView, runScopeHandlers } from '@codemirror/view';
import { language } from '@codemirror/language';
import { insertBlankLine, insertNewlineAndIndent, undo } from '@codemirror/commands';
import { acceptCompletion, CompletionContext, completionStatus } from '@codemirror/autocomplete';
import {
  CodeEditor,
  CodeViewer,
  type CodeEditorHandle,
  type CodeEditorOptions,
} from '../src/components/code-editor.js';
import { VariableAwareInput } from '../src/components/variable-aware-input.js';
import { getVariableMatches } from '../src/components/editor-variables.js';
import { variableCompletions } from '../src/internal/editor/variables.js';
import { Theme } from '../src/theme.js';
import { Label } from '../src/components/layout.js';

describe('editor', () => {
  it('synchronizes external values without reporting them as user edits and keeps a behavior-only ref', () => {
    const ref = createRef<CodeEditorHandle>();
    const onChange = vi.fn();
    const { rerender } = render(
      <CodeEditor ref={ref} value="first" onChange={onChange} label="Body" />,
    );
    expect(screen.getByRole('textbox', { name: 'Body' })).toHaveTextContent('first');
    expect(ref.current?.getValue()).toBe('first');
    expect(Object.keys(ref.current!)).toEqual(['focus', 'selectAll', 'getValue']);
    rerender(<CodeEditor ref={ref} value="second" onChange={onChange} label="Body" />);
    expect(screen.getByRole('textbox', { name: 'Body' })).toHaveTextContent('second');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps external values out of undo history and maps the cursor around them', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <CodeEditor value="world" onChange={onChange} label="Body" />,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    act(() => view.dispatch({ selection: { anchor: 5 } }));
    rerender(<CodeEditor value="hello world" onChange={onChange} label="Body" />);
    expect(view.state.doc.toString()).toBe('hello world');
    expect(view.state.selection.main.head).toBe(11);
    expect(undo(view)).toBe(false);
    expect(view.state.doc.toString()).toBe('hello world');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('undoes only user edits after an external value arrives', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <CodeEditor value="GET /users" onChange={onChange} label="Request" />,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    act(() => view.dispatch({ changes: { from: 0, insert: '# ' }, userEvent: 'input.type' }));
    rerender(<CodeEditor value="# GET /users/1" onChange={onChange} label="Request" />);
    expect(undo(view)).toBe(true);
    expect(view.state.doc.toString()).toBe('GET /users/1');
    expect(onChange).toHaveBeenLastCalledWith('GET /users/1');
  });

  it('starts a fresh history for a new document key without saving the previous body', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <CodeEditor
        documentKey="a"
        value="A body"
        onChange={onChange}
        language="json"
        variables={[{ name: 'host', value: 'localhost' }]}
        label="Body"
      />,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    act(() => view.dispatch({ changes: { from: 6, insert: ' edited' }, userEvent: 'input.type' }));
    expect(onChange).toHaveBeenLastCalledWith('A body edited');
    onChange.mockClear();
    rerender(
      <CodeEditor
        documentKey="b"
        value="{{host}}"
        onChange={onChange}
        language="json"
        variables={[{ name: 'host', value: 'localhost' }]}
        label="Body"
      />,
    );
    expect(view.state.doc.toString()).toBe('{{host}}');
    expect(undo(view)).toBe(false);
    expect(view.state.doc.toString()).toBe('{{host}}');
    expect(onChange).not.toHaveBeenCalled();
    expect(view.state.facet(language)?.name).toBe('json');
    expect(container.querySelector('.cm-variable-resolved')).toHaveTextContent('{{host}}');
    expect(screen.getByRole('textbox', { name: 'Body' })).toBe(view.contentDOM);
  });

  it('names each textbox from its own label or labelling element, never a generic default', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label id="url-label" htmlFor="url">
          Request URL
        </Label>
        <VariableAwareInput id="url" aria-labelledby="url-label" />
        <CodeViewer label="Response" value="{}" />
      </>,
    );
    const url = screen.getByRole('textbox', { name: 'Request URL' });
    expect(url).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('textbox', { name: 'Response' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /^Code (editor|preview)$/ })).toBeNull();
    await user.click(screen.getByText('Request URL'));
    expect(url).toHaveFocus();
  });

  it('keeps a disabled editor out of focus when its label is clicked', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label id="body-label" htmlFor="body">
          Body
        </Label>
        <CodeEditor id="body" aria-labelledby="body-label" disabled />
      </>,
    );
    await user.click(screen.getByText('Body'));
    expect(screen.getByRole('textbox', { name: 'Body' })).not.toHaveFocus();
  });

  it('updates readonly, placeholder and variant behavior without recreating the textbox', () => {
    const { rerender } = render(
      <CodeEditor defaultValue="" placeholder="Initial…" label="Query" />,
    );
    const editor = screen.getByRole('textbox', { name: 'Query' });
    expect(editor).toHaveAttribute('contenteditable', 'true');
    expect(screen.getByText('Initial…')).toBeInTheDocument();
    rerender(<CodeEditor readOnly variant="input" placeholder="New placeholder…" label="Query" />);
    expect(screen.getByRole('textbox', { name: 'Query' })).toBe(editor);
    expect(editor).toHaveAttribute('contenteditable', 'false');
    expect(editor).toHaveAttribute('aria-readonly', 'true');
    expect(editor).toHaveAttribute('aria-multiline', 'false');
    expect(screen.getByText('New placeholder…')).toBeInTheDocument();
  });

  describe('single-line input', () => {
    function renderInput() {
      const onChange = vi.fn();
      const { container } = render(
        <CodeEditor variant="input" defaultValue="api" onChange={onChange} label="URL" />,
      );
      const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
      view.dispatch({ selection: { anchor: 3 } });
      return { view, onChange };
    }

    it.each([
      ['Enter', {}],
      ['Shift+Enter', { shiftKey: true }],
      ['Mod+Enter', { ctrlKey: true }],
    ])('ignores %s', (_name, modifiers) => {
      const { view } = renderInput();
      runScopeHandlers(
        view,
        new KeyboardEvent('keydown', { key: 'Enter', ...modifiers }),
        'editor',
      );
      expect(view.state.doc.toString()).toBe('api');
      expect(view.state.doc.lines).toBe(1);
    });

    it('ignores a line break inserted as typed input', () => {
      const { view, onChange } = renderInput();
      view.dispatch(view.state.replaceSelection('\n'), { userEvent: 'input.type' });
      expect(view.state.doc.toString()).toBe('api');
      expect(onChange).not.toHaveBeenCalled();
    });

    it.each([
      ['a pasted URL with a trailing line break', 'input.paste', '.example.com/users\r\n'],
      ['a dropped multi-line selection', 'input.drop', '.example\n.com'],
      ['an accepted completion', 'input.complete', '\n.example.com'],
    ])('strips line breaks from %s', (_name, userEvent, text) => {
      const { view, onChange } = renderInput();
      view.dispatch(view.state.replaceSelection(text), { userEvent });
      const expected = `api${text.replace(/\r?\n/g, '')}`;
      expect(view.state.doc.toString()).toBe(expected);
      expect(view.state.doc.lines).toBe(1);
      expect(view.state.selection.main.head).toBe(expected.length);
      expect(onChange).toHaveBeenLastCalledWith(expected);
    });

    it('strips line breaks inserted by editing commands', () => {
      const { view } = renderInput();
      insertNewlineAndIndent(view);
      insertBlankLine(view);
      expect(view.state.doc.toString()).toBe('api');
      expect(view.state.selection.main.head).toBe(3);
    });
  });

  it('normalizes variable keys, refreshes resolution, and keeps viewers free of authoring affordances', () => {
    const { rerender, container } = render(
      <VariableAwareInput
        value="{{host}}"
        variables={[{ key: ' host ', value: 'localhost' }]}
        label="URL"
      />,
    );
    expect(container.querySelector('.cm-variable-resolved')).toHaveTextContent('{{host}}');
    rerender(<VariableAwareInput value="{{host}}" variables={[]} label="URL" />);
    expect(container.querySelector('.cm-variable')).toHaveTextContent('{{host}}');
    expect(container.querySelector('.cm-variable-resolved')).toBeNull();
    rerender(<CodeViewer value="{{host}}" label="Response" />);
    expect(screen.getByRole('textbox', { name: 'Response' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
    expect(container.querySelector('.cm-variable')).toBeNull();
    expect(container.querySelector('.cm-foldGutter')).toBeNull();
  });

  it('keeps an open completion and configuration while a controlled parent re-renders inline variables', async () => {
    function Harness() {
      const [value, setValue] = useState('');
      return (
        <CodeEditor
          value={value}
          onChange={setValue}
          variables={[{ name: 'host', value: 'localhost' }, { name: 'token' }]}
          label="URL"
        />
      );
    }
    const { container, rerender } = render(<Harness />);
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    const type = (text: string) =>
      act(() =>
        view.dispatch({
          changes: { from: view.state.selection.main.head, insert: text },
          selection: { anchor: view.state.selection.main.head + text.length },
          userEvent: 'input.type',
        }),
      );
    type('{{');
    await waitFor(() => expect(completionStatus(view.state)).toBe('active'));
    const dispatch = vi.spyOn(view, 'dispatch');
    type('h');
    rerender(<Harness />);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(completionStatus(view.state)).toBe('active');
    expect(acceptCompletion(view)).toBe(true);
    expect(view.state.doc.toString()).toBe('{{host}}');
  });

  it('refreshes variable resolution only when the resolved values change', () => {
    const { container, rerender } = render(
      <CodeEditor value="{{host}}" variables={[{ name: 'host' }]} label="URL" />,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    const dispatch = vi.spyOn(view, 'dispatch');
    rerender(<CodeEditor value="{{host}}" variables={[{ name: 'host' }]} label="URL" />);
    expect(dispatch).not.toHaveBeenCalled();
    expect(container.querySelector('.cm-variable-resolved')).toBeNull();
    rerender(
      <CodeEditor value="{{host}}" variables={[{ name: 'host', value: 'a' }]} label="URL" />,
    );
    expect(container.querySelector('.cm-variable-resolved')).toHaveTextContent('{{host}}');
  });

  it('re-detects an uncontrolled document language only when auto-detection is on', () => {
    const { container, rerender } = render(
      <CodeEditor autoDetectLanguage defaultValue="" label="Body" />,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    act(() => view.dispatch({ changes: { from: 0, insert: '<note></note>' } }));
    expect(view.state.facet(language)?.name).toBe('xml');
    act(() => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: '{}' } }));
    expect(view.state.facet(language)?.name).toBe('json');
    rerender(<CodeEditor defaultValue="" label="Body" />);
    expect(view.state.facet(language)).toBeNull();
    act(() => view.dispatch({ changes: { from: 0, insert: '[' } }));
    expect(view.state.facet(language)).toBeNull();
  });

  it('inherits the nearest theme in its popover portal and removes the portal on unmount', () => {
    const { rerender, unmount } = render(
      <Theme colorScheme="dark" brand="echopoint">
        <CodeEditor label="Body" />
      </Theme>,
    );
    const host = document.querySelector('.ns-editor-popovers')!;
    expect(host.parentElement).toHaveAttribute('data-ns-theme', 'dark');
    expect(host.parentElement).toHaveAttribute('data-ns-brand', 'echopoint');
    rerender(
      <Theme colorScheme="light" brand="anchor">
        <CodeEditor label="Body" />
      </Theme>,
    );
    expect(host.parentElement).toHaveAttribute('data-ns-theme', 'light');
    expect(host.parentElement).toHaveAttribute('data-ns-brand', 'anchor');
    unmount();
    expect(document.querySelector('.ns-editor-popovers')).toBeNull();
  });

  it('strips untyped styling, raw editor extensions and attribute-based variation overrides', () => {
    const unsafe = {
      className: 'override',
      style: { color: 'red' },
      css: 'color:red',
      minHeight: '900px',
      maxHeight: '900px',
      extensions: [],
      'data-ns-editor-height': '900px',
      'data-ns-editor-variant': 'viewer',
      render: <span>Replacement</span>,
    } as unknown as CodeEditorOptions;
    const { container } = render(
      <CodeEditor {...unsafe} height="compact" variant="input" label="Code" />,
    );
    const root = container.querySelector('.ns-code-editor')!;
    expect(root).not.toHaveAttribute('style');
    expect(root).not.toHaveAttribute('css');
    expect(root).not.toHaveAttribute('minHeight');
    expect(root).toHaveAttribute('data-ns-editor-height', 'compact');
    expect(root).toHaveAttribute('data-ns-editor-variant', 'input');
    expect(screen.queryByText('Replacement')).toBeNull();
  });
});

describe('variable matching and completion', () => {
  it('matches spaced double/triple templates and custom patterns without sharing regex state', () => {
    expect(getVariableMatches('{{ host }} {{{token}}}')).toEqual([
      { from: 0, to: 10, name: 'host' },
      { from: 11, to: 22, name: 'token' },
    ]);
    const pattern = /\$\{([^}]+)\}/g;
    pattern.lastIndex = 7;
    expect(getVariableMatches('${host}', { pattern })).toEqual([{ from: 0, to: 7, name: 'host' }]);
    expect(pattern.lastIndex).toBe(7);
    expect(getVariableMatches('😀text', { pattern: /()/gu })).toEqual([]);
  });

  it.each([
    ['spaced double braces', '{{ host }}', [{ from: 0, to: 10, name: 'host' }]],
    ['triple braces', '{{{token}}}', [{ from: 0, to: 11, name: 'token' }]],
    ['a JSON closing brace', '{"id":{{userId}}}', [{ from: 6, to: 16, name: 'userId' }]],
    ['triple braces inside JSON', '{"id":{{{userId}}}}', [{ from: 6, to: 18, name: 'userId' }]],
    ['an extra closing brace', '{{a}}}', [{ from: 0, to: 5, name: 'a' }]],
    ['an unclosed variable', '{{host', []],
    ['an empty variable', '{{   }}', []],
    ['a nested opening', '{{ {{host}} }}', [{ from: 3, to: 11, name: 'host' }]],
    [
      'several variables',
      '{{a}}/{{ b }}',
      [
        { from: 0, to: 5, name: 'a' },
        { from: 6, to: 13, name: 'b' },
      ],
    ],
  ])('matches %s', (_case, text, expected) => {
    expect(getVariableMatches(text)).toEqual(expected);
  });

  it('matches an unclosed variable followed by long whitespace in linear time', () => {
    const started = performance.now();
    expect(getVariableMatches(`{{${' '.repeat(20_000)}`)).toEqual([]);
    expect(getVariableMatches(`{{{${' '.repeat(20_000)}}}`)).toEqual([]);
    expect(performance.now() - started).toBeLessThan(50);
  });

  it('highlights a JSON-adjacent variable without its closing JSON brace and keeps edits fast', () => {
    const { container } = render(
      <CodeEditor defaultValue={`{"id":{{userId}}}\n{{${' '.repeat(20_000)}`} label="Body" />,
    );
    expect(container.querySelector('.cm-variable')).toHaveTextContent(/^\{\{userId\}\}$/);
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    const started = performance.now();
    view.dispatch({ changes: { from: view.state.doc.length, insert: ' ' } });
    expect(performance.now() - started).toBeLessThan(50);
  });

  it('keeps an open variable completion accepting Tab immediately after each typed character', async () => {
    const { container } = render(
      <CodeEditor defaultValue="" variables={[{ name: 'host' }, { name: 'token' }]} label="URL" />,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    const type = (text: string) =>
      view.dispatch({
        changes: { from: view.state.selection.main.head, insert: text },
        selection: { anchor: view.state.selection.main.head + text.length },
        userEvent: 'input.type',
      });
    type('{{');
    await waitFor(() => expect(completionStatus(view.state)).toBe('active'));
    type('h');
    type('o');
    expect(acceptCompletion(view)).toBe(true);
    expect(view.state.doc.toString()).toBe('{{host}}');
  });

  it('offers typed variables and matching closing delimiters for custom completion templates', () => {
    const state = EditorState.create({ doc: '${ho' });
    const source = variableCompletions([{ name: 'host', value: 'localhost' }, { name: 'token' }], {
      templates: [{ open: '${', close: '}' }],
    });
    const result = source(new CompletionContext(state, state.doc.length, true));
    expect(result?.from).toBe(2);
    expect(result?.options.map((option) => option.label)).toEqual(['host']);
    expect(result?.options[0]?.detail).toBe('localhost');
  });
});
