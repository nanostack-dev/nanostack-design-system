'use client';

import { useState, type FocusEvent } from 'react';
import type { NoCustomStyle } from '../internal/props.js';
import { VariableText } from './variable-text.js';
import type { VariableAwareInputVariable } from './variable-aware-input.js';

export type KeyValueRowProps = NoCustomStyle & {
  keyValue: string;
  value: string;
  variables?: readonly VariableAwareInputVariable[];
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  lockedNote?: string;
  reservedKeys?: readonly string[];
  readOnly?: boolean;
  highlighted?: boolean;
  onKeyChange?: (next: string) => void;
  onValueChange?: (next: string) => void;
  onRemove?: () => void;
  onFocusChange?: (focused: boolean) => void;
};

/** Buffer a rename until blur so derived row IDs never unmount the active input. */
export function KeyValueRow({
  keyValue,
  value,
  variables,
  keyPlaceholder = 'name',
  valuePlaceholder = 'value',
  lockedNote,
  reservedKeys,
  readOnly,
  highlighted,
  onKeyChange,
  onValueChange,
  onRemove,
  onFocusChange,
}: KeyValueRowProps) {
  const [editing, setEditing] = useState<'key' | 'value' | null>(null);
  const [draft, setDraft] = useState('');
  const [rejected, setRejected] = useState(false);
  const open = (field: 'key' | 'value') => {
    setDraft(field === 'key' ? keyValue : value);
    setRejected(false);
    setEditing(field);
    onFocusChange?.(true);
  };
  const close = () => {
    setEditing(null);
    setRejected(false);
    onFocusChange?.(false);
  };
  const commitKey = () => {
    const next = draft.trim();
    if (!next || next === keyValue) return close();
    if (reservedKeys?.includes(next)) {
      setRejected(true);
      return;
    }
    onKeyChange?.(next);
    close();
  };
  const commitValue = () => {
    if (draft !== value) onValueChange?.(draft);
    close();
  };
  if (lockedNote || readOnly)
    return (
      <div className="ns-key-value-row">
        <span className="ns-key-value-note">{keyValue || keyPlaceholder}</span>
        <VariableText
          value={value}
          variables={variables}
          placeholder={valuePlaceholder}
          tone="muted"
        />
        <span className="ns-key-value-note">{lockedNote}</span>
      </div>
    );
  return (
    <div className="ns-key-value-row" data-ns-highlighted={highlighted}>
      {editing === 'key' ? (
        <input
          ref={focusInput}
          className="ns-key-value-field"
          value={draft}
          spellCheck={false}
          placeholder={keyPlaceholder}
          aria-label={`${keyPlaceholder} name`}
          aria-invalid={rejected || undefined}
          title={
            rejected ? `There is already a ${keyPlaceholder} called ${draft.trim()}.` : undefined
          }
          onChange={(event) => {
            setDraft(event.target.value);
            setRejected(false);
          }}
          onBlur={commitKey}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') close();
          }}
        />
      ) : (
        <button
          type="button"
          className="ns-key-value-field"
          onClick={() => open('key')}
          onFocus={() => open('key')}
        >
          {keyValue || keyPlaceholder}
        </button>
      )}
      {editing === 'value' ? (
        <input
          ref={focusInput}
          className="ns-key-value-field"
          value={draft}
          spellCheck={false}
          placeholder={valuePlaceholder}
          aria-label={`${keyValue || keyPlaceholder} value`}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') close();
          }}
        />
      ) : (
        <button
          type="button"
          className="ns-key-value-field"
          onClick={() => open('value')}
          onFocus={() => open('value')}
        >
          <VariableText value={value} variables={variables} placeholder={valuePlaceholder} />
        </button>
      )}
      {onRemove ? (
        <button
          type="button"
          className="ns-key-value-remove"
          onClick={onRemove}
          aria-label={`Remove ${keyValue || 'row'}`}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="m4 4 8 8m0-8-8 8" />
          </svg>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

export type KeyValueDraftRowProps = NoCustomStyle & {
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  reservedKeys?: readonly string[];
  disabled?: boolean;
  onCommit: (key: string, value: string) => void;
};

/** Commit only after leaving both fields; Tab between them must keep the draft. */
export function KeyValueDraftRow({
  keyPlaceholder = 'name',
  valuePlaceholder = 'value',
  reservedKeys,
  disabled,
  onCommit,
}: KeyValueDraftRowProps) {
  const [draftKey, setDraftKey] = useState('');
  const [draftValue, setDraftValue] = useState('');
  const [rejected, setRejected] = useState(false);
  const commit = (event: FocusEvent<HTMLDivElement>) => {
    if (
      disabled ||
      (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
    )
      return;
    const key = draftKey.trim();
    if (!key) return;
    if (reservedKeys?.includes(key)) {
      setRejected(true);
      return;
    }
    onCommit(key, draftValue);
    setDraftKey('');
    setDraftValue('');
    setRejected(false);
  };
  return (
    <div className="ns-key-value-row" onBlur={commit}>
      <input
        className="ns-key-value-field"
        value={draftKey}
        spellCheck={false}
        placeholder={keyPlaceholder}
        aria-label={`New ${keyPlaceholder}`}
        aria-invalid={rejected || undefined}
        disabled={disabled}
        title={
          rejected ? `There is already a ${keyPlaceholder} called ${draftKey.trim()}.` : undefined
        }
        onChange={(event) => {
          setDraftKey(event.target.value);
          setRejected(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
        }}
      />
      <input
        className="ns-key-value-field"
        value={draftValue}
        spellCheck={false}
        placeholder={valuePlaceholder}
        aria-label={`New ${keyPlaceholder} value`}
        disabled={disabled}
        onChange={(event) => setDraftValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
        }}
      />
      <span />
    </div>
  );
}

function focusInput(input: HTMLInputElement | null) {
  input?.focus();
}
