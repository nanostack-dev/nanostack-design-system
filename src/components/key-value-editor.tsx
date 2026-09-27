'use client';

import { useEffect, useId, useRef, useState, type FocusEvent } from 'react';
import type { NoCustomStyle } from '../internal/props.js';
import { VisuallyHidden } from './layout.js';
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

/**
 * Buffer a rename until it is committed so derived row IDs never unmount the active input.
 * Enter commits and Escape cancels, returning focus to the field's button; a reserved name stays
 * in its input, marked invalid, until the person changes or cancels it.
 */
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
  const [keyDraft, setKeyDraft] = useState<string | null>(null);
  const [keyRejected, setKeyRejected] = useState(false);
  const [valueDraft, setValueDraft] = useState<string | null>(null);
  const openFields = useRef({ key: false, value: false });
  const focusAfterClose = useRef<'key' | 'value' | null>(null);
  const reportedEditing = useRef(false);
  const errorId = useId();
  const editing = keyDraft !== null || valueDraft !== null;
  useEffect(() => {
    if (reportedEditing.current === editing) return;
    reportedEditing.current = editing;
    onFocusChange?.(editing);
  }, [editing, onFocusChange]);
  const triggerRef = (field: 'key' | 'value') => (button: HTMLButtonElement | null) => {
    if (!button || focusAfterClose.current !== field) return;
    focusAfterClose.current = null;
    button.focus();
  };
  const openKey = () => {
    openFields.current.key = true;
    setKeyDraft(keyValue);
    setKeyRejected(false);
  };
  const openValue = () => {
    openFields.current.value = true;
    setValueDraft(value);
  };
  const closeKey = (returnFocus: boolean) => {
    openFields.current.key = false;
    if (returnFocus) focusAfterClose.current = 'key';
    setKeyDraft(null);
    setKeyRejected(false);
  };
  const closeValue = (returnFocus: boolean) => {
    openFields.current.value = false;
    if (returnFocus) focusAfterClose.current = 'value';
    setValueDraft(null);
  };
  const commitKey = (returnFocus: boolean) => {
    if (!openFields.current.key) return;
    const next = (keyDraft ?? '').trim();
    if (!next || next === keyValue) return closeKey(returnFocus);
    if (reservedKeys?.includes(next)) {
      setKeyRejected(true);
      return;
    }
    onKeyChange?.(next);
    closeKey(returnFocus);
  };
  const commitValue = (returnFocus: boolean) => {
    if (!openFields.current.value) return;
    if (valueDraft !== null && valueDraft !== value) onValueChange?.(valueDraft);
    closeValue(returnFocus);
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
      {keyDraft !== null ? (
        <>
          <input
            ref={focusInput}
            className="ns-key-value-field"
            value={keyDraft}
            spellCheck={false}
            placeholder={keyPlaceholder}
            aria-label={`${keyPlaceholder} name`}
            aria-invalid={keyRejected || undefined}
            aria-describedby={keyRejected ? errorId : undefined}
            title={
              keyRejected
                ? `There is already a ${keyPlaceholder} called ${keyDraft.trim()}.`
                : undefined
            }
            onChange={(event) => {
              setKeyDraft(event.target.value);
              setKeyRejected(false);
            }}
            onBlur={() => commitKey(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitKey(true);
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                closeKey(true);
              }
            }}
          />
          {keyRejected ? (
            <VisuallyHidden id={errorId} role="alert">
              There is already a {keyPlaceholder} called {keyDraft.trim()}.
            </VisuallyHidden>
          ) : null}
        </>
      ) : (
        <button
          ref={triggerRef('key')}
          type="button"
          className="ns-key-value-field"
          onClick={openKey}
        >
          {keyValue || keyPlaceholder}
        </button>
      )}
      {valueDraft !== null ? (
        <input
          ref={focusInput}
          className="ns-key-value-field"
          value={valueDraft}
          spellCheck={false}
          placeholder={valuePlaceholder}
          aria-label={`${keyValue || keyPlaceholder} value`}
          onChange={(event) => setValueDraft(event.target.value)}
          onBlur={() => commitValue(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitValue(true);
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              closeValue(true);
            }
          }}
        />
      ) : (
        <button
          ref={triggerRef('value')}
          type="button"
          className="ns-key-value-field"
          onClick={openValue}
        >
          <VariableText
            value={value}
            variables={variables}
            placeholder={valuePlaceholder}
            interactive={false}
          />
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
