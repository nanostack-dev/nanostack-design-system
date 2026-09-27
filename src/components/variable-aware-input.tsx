'use client';

import { useMemo } from 'react';
import { CodeEditor, type CodeEditorProps } from './code-editor.js';
import type { Variable } from './editor-variables.js';

export interface VariableAwareInputVariable {
  name?: string | undefined;
  key?: string | undefined;
  value?: string | undefined;
  description?: string | undefined;
}

export type VariableAwareInputProps = Omit<CodeEditorProps, 'variant' | 'variables'> & {
  variables?: readonly VariableAwareInputVariable[] | undefined;
  multiline?: boolean | undefined;
};

/** Supports key/value stores while keeping the editor's canonical variable shape small. */
export function VariableAwareInput({
  variables,
  multiline = false,
  ...props
}: VariableAwareInputProps) {
  const normalized = useMemo<Variable[]>(
    () =>
      (variables ?? []).flatMap((variable) => {
        const name = (variable.name ?? variable.key ?? '').trim();
        return name ? [{ name, value: variable.value, description: variable.description }] : [];
      }),
    [variables],
  );
  return <CodeEditor {...props} variant={multiline ? 'editor' : 'input'} variables={normalized} />;
}

export type { VariableTemplate } from './editor-variables.js';
