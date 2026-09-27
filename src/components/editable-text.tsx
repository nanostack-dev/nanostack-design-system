'use client';
import { useRef, useState } from 'react';
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
  const open = useRef(false);
  const returnFocus = useRef(false);
  const finish = (save: boolean, focusTrigger: boolean) => {
    if (!open.current) return;
    open.current = false;
    returnFocus.current = focusTrigger;
    setEditing(false);
    const next = draft.trim();
    if (save && next && next !== value) onCommit?.(next);
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
      onBlur={() => finish(true, false)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          finish(true, true);
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          finish(false, true);
        }
      }}
    />
  ) : (
    <button
      type="button"
      {...safeProps(props)}
      ref={(button) => {
        if (!button || !returnFocus.current) return;
        returnFocus.current = false;
        button.focus();
      }}
      className="ns-editable-text"
      data-variant={variant}
      disabled={readOnly || !onCommit}
      onClick={() => {
        open.current = true;
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
