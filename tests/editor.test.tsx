import { createRef, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditorView } from '@codemirror/view';
import { language } from '@codemirror/language';
import { undo } from '@codemirror/commands';
import {
  CodeEditor,
  CodeViewer,
  type CodeEditorHandle,
  type CodeEditorOptions,
} from '../src/components/code-editor.js';
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
        value={'{ "b": 1 }'}
        onChange={onChange}
        language="json"
        label="Body"
      />,
    );
    expect(view.state.doc.toString()).toBe('{ "b": 1 }');
    expect(undo(view)).toBe(false);
    expect(view.state.doc.toString()).toBe('{ "b": 1 }');
    expect(onChange).not.toHaveBeenCalled();
    expect(view.state.facet(language)?.name).toBe('json');
    expect(screen.getByRole('textbox', { name: 'Body' })).toBe(view.contentDOM);
  });

  it('names each textbox from its own label or labelling element, never a generic default', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label id="payload-label" htmlFor="payload">
          Payload
        </Label>
        <CodeEditor id="payload" aria-labelledby="payload-label" />
        <CodeViewer label="Response" value="{}" />
      </>,
    );
    const payload = screen.getByRole('textbox', { name: 'Payload' });
    expect(payload).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('textbox', { name: 'Response' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /^Code (editor|preview)$/ })).toBeNull();
    await user.click(screen.getByText('Payload'));
    expect(payload).toHaveFocus();
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
    const { container, rerender } = render(
      <CodeEditor defaultValue="" placeholder="Initial…" label="Query" />,
    );
    const editor = screen.getByRole('textbox', { name: 'Query' });
    expect(editor).toHaveAttribute('contenteditable', 'true');
    expect(screen.getByText('Initial…')).toBeInTheDocument();
    expect(container.querySelector('.cm-foldGutter')).not.toBeNull();
    rerender(<CodeEditor readOnly variant="viewer" placeholder="New placeholder…" label="Query" />);
    expect(screen.getByRole('textbox', { name: 'Query' })).toBe(editor);
    expect(editor).toHaveAttribute('contenteditable', 'false');
    expect(editor).toHaveAttribute('aria-readonly', 'true');
    expect(editor).toHaveAttribute('aria-multiline', 'true');
    expect(container.querySelector('.cm-foldGutter')).toBeNull();
    expect(screen.getByText('New placeholder…')).toBeInTheDocument();
  });

  it('keeps its configuration while a controlled parent re-renders and echoes each edit', () => {
    function Harness() {
      const [value, setValue] = useState('{}');
      return (
        <CodeEditor value={value} onChange={setValue} language="json" lineNumbers label="Body" />
      );
    }
    const { container, rerender } = render(<Harness />);
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    const dispatch = vi.spyOn(view, 'dispatch');
    rerender(<Harness />);
    expect(dispatch).not.toHaveBeenCalled();
    act(() => view.dispatch({ changes: { from: 1, insert: '"a": 1' }, userEvent: 'input.type' }));
    rerender(<Harness />);
    expect(dispatch).toHaveBeenCalledOnce();
    expect(view.state.doc.toString()).toBe('{"a": 1}');
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

  it('follows the nearest color scheme without adding a portal to the page', () => {
    const { container, rerender } = render(
      <Theme colorScheme="dark" brand="echopoint">
        <CodeEditor label="Body" />
      </Theme>,
    );
    const view = EditorView.findFromDOM(container.querySelector('.cm-editor') as HTMLElement)!;
    expect(view.state.facet(EditorView.darkTheme)).toBe(true);
    rerender(
      <Theme colorScheme="light" brand="anchor">
        <CodeEditor label="Body" />
      </Theme>,
    );
    expect(view.state.facet(EditorView.darkTheme)).toBe(false);
    expect(document.body.childElementCount).toBe(1);
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
      <CodeEditor {...unsafe} height="compact" variant="editor" label="Code" />,
    );
    const root = container.querySelector('.ns-code-editor')!;
    expect(root).not.toHaveAttribute('style');
    expect(root).not.toHaveAttribute('css');
    expect(root).not.toHaveAttribute('minHeight');
    expect(root).toHaveAttribute('data-ns-editor-height', 'compact');
    expect(root).toHaveAttribute('data-ns-editor-variant', 'editor');
    expect(screen.queryByText('Replacement')).toBeNull();
  });
});
