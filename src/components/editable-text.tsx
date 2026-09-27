'use client';
import { useState } from 'react';
import { safeProps, type NoCustomStyle } from '../internal/props.js';
export type EditableTextProps = NoCustomStyle & {
  value: string;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  variant?: 'body' | 'title' | 'code';
  onCommit?: ((value: string) => void) | undefined;
};
export function EditableText({
  value,
  label,
  placeholder = 'Untitled',
  readOnly = false,
  variant = 'body',
  onCommit,
  ...props
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== value) onCommit?.(next);
  };
  return editing && !readOnly ? (
    <input
      {...safeProps(props)}
      ref={focusInput}
      className="ns-editable-text"
      data-variant={variant}
      aria-label={label}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          setDraft(value);
          setEditing(false);
        }
      }}
    />
  ) : (
    <button
      type="button"
      {...safeProps(props)}
      className="ns-editable-text"
      data-variant={variant}
      disabled={readOnly || !onCommit}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title={readOnly ? undefined : 'Rename'}
    >
      {value || placeholder}
    </button>
  );
}

function focusInput(input: HTMLInputElement | null) {
  input?.focus();
}
