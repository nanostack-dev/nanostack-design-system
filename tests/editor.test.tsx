import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EditorState } from '@codemirror/state';
import { CompletionContext } from '@codemirror/autocomplete';
import {
  CodeEditor,
  CodeViewer,
  type CodeEditorHandle,
  type CodeEditorProps,
} from '../src/components/code-editor.js';
import { VariableAwareInput } from '../src/components/variable-aware-input.js';
import { getVariableMatches } from '../src/components/editor-variables.js';
import { variableCompletions } from '../src/internal/editor/variables.js';
import { Theme } from '../src/theme.js';

describe('editor', () => {
  it('synchronizes external values without reporting them as user edits and keeps a behavior-only ref', () => {
    const ref = createRef<CodeEditorHandle>();
    const onChange = vi.fn();
    const { rerender } = render(
      <CodeEditor ref={ref} value="first" onChange={onChange} aria-label="Body" />,
    );
    expect(screen.getByRole('textbox', { name: 'Body' })).toHaveTextContent('first');
    expect(ref.current?.getValue()).toBe('first');
    expect(Object.keys(ref.current!)).toEqual(['focus', 'selectAll', 'getValue']);
    rerender(<CodeEditor ref={ref} value="second" onChange={onChange} aria-label="Body" />);
    expect(screen.getByRole('textbox', { name: 'Body' })).toHaveTextContent('second');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('updates readonly, placeholder and variant behavior without recreating the textbox', () => {
    const { rerender } = render(
      <CodeEditor defaultValue="" placeholder="Initial…" aria-label="Query" />,
    );
    const editor = screen.getByRole('textbox', { name: 'Query' });
    expect(editor).toHaveAttribute('contenteditable', 'true');
    expect(screen.getByText('Initial…')).toBeInTheDocument();
    rerender(
      <CodeEditor readOnly variant="input" placeholder="New placeholder…" aria-label="Query" />,
    );
    expect(screen.getByRole('textbox', { name: 'Query' })).toBe(editor);
    expect(editor).toHaveAttribute('contenteditable', 'false');
    expect(editor).toHaveAttribute('aria-readonly', 'true');
    expect(editor).toHaveAttribute('aria-multiline', 'false');
    expect(screen.getByText('New placeholder…')).toBeInTheDocument();
  });

  it('normalizes variable keys, refreshes resolution, and keeps viewers free of authoring affordances', () => {
    const { rerender, container } = render(
      <VariableAwareInput
        value="{{host}}"
        variables={[{ key: ' host ', value: 'localhost' }]}
        aria-label="URL"
      />,
    );
    expect(container.querySelector('.cm-variable-resolved')).toHaveTextContent('{{host}}');
    rerender(<VariableAwareInput value="{{host}}" variables={[]} aria-label="URL" />);
    expect(container.querySelector('.cm-variable')).toHaveTextContent('{{host}}');
    expect(container.querySelector('.cm-variable-resolved')).toBeNull();
    rerender(<CodeViewer value="{{host}}" aria-label="Response" />);
    expect(screen.getByRole('textbox', { name: 'Response' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
    expect(container.querySelector('.cm-variable')).toBeNull();
    expect(container.querySelector('.cm-foldGutter')).toBeNull();
  });

  it('inherits the nearest theme in its popover portal and removes the portal on unmount', () => {
    const { rerender, unmount } = render(
      <Theme colorScheme="dark" brand="echopoint">
        <CodeEditor aria-label="Body" />
      </Theme>,
    );
    const host = document.querySelector('.ns-editor-popovers')!;
    expect(host.parentElement).toHaveAttribute('data-ns-theme', 'dark');
    expect(host.parentElement).toHaveAttribute('data-ns-brand', 'echopoint');
    rerender(
      <Theme colorScheme="light" brand="anchor">
        <CodeEditor aria-label="Body" />
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
    } as unknown as CodeEditorProps;
    const { container } = render(
      <CodeEditor {...unsafe} height="compact" variant="input" aria-label="Code" />,
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
