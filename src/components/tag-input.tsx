'use client';
import type { NoCustomStyle } from '../internal/props.js';
import * as React from 'react';
import { XIcon } from '@phosphor-icons/react';

import { Badge } from './badge.js';
import { Input } from './input.js';

export interface TagInputProps extends NoCustomStyle {
  /** Current tags. Controlled. */
  value: string[];
  /** Called with the next tag list on add or remove. */
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  inputId?: string;
  'aria-label'?: string;
  /** Transform raw input before validation (e.g. trim + lowercase). Defaults to trim. */
  transformTag?: (raw: string) => string;
  /** Return an error message to reject a tag, or null to accept it. */
  validateTag?: (tag: string, existing: readonly string[]) => string | null;
}

/**
 * TagInput is a generic controlled multi-tag editor: removable badges plus a
 * text field that commits on Enter or comma. Validation/normalization are
 * injected so callers (e.g. flow tags) can enforce their own rules.
 */
export function TagInput({
  value,
  onChange,
  placeholder = 'Add a tag…',
  disabled = false,
  inputId,
  'aria-label': ariaLabel,
  transformTag = (raw) => raw.trim(),
  validateTag,
}: TagInputProps) {
  const [draft, setDraft] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const generatedId = React.useId();
  const errorId = `${inputId ?? generatedId}-error`;

  const commit = (raw: string) => {
    if (disabled) return;
    const tag = transformTag(raw);
    if (!tag) {
      setDraft('');
      return;
    }
    const validationError = validateTag?.(tag, value) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }
    onChange([...value, tag]);
    setDraft('');
    setError(null);
  };

  const removeAt = (index: number) => {
    if (disabled) return;
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
    setError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit(draft);
      return;
    }
    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      removeAt(value.length - 1);
    }
  };

  return (
    <div className="ns-tags">
      {value.length > 0 ? (
        <div className="ns-tags-selected">
          {value.map((tag, index) => (
            <Badge key={`${tag}-${index}`} tone="neutral">
              <span className="ns-tags-label">{tag}</span>
              {!disabled ? (
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  // Prevent the click from blurring the input first, which would
                  // commit a pending draft and race with this removal.
                  onMouseDown={(event) => event.preventDefault()}
                  disabled={disabled}
                  onClick={() => removeAt(index)}
                  className="ns-tag-remove"
                >
                  <XIcon width={12} height={12} aria-hidden="true" />
                </button>
              ) : null}
            </Badge>
          ))}
        </div>
      ) : null}
      <Input
        id={inputId}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => {
          setDraft(event.target.value);
          if (error) {
            setError(null);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (draft.trim()) {
            commit(draft);
          }
        }}
      />
      {error ? (
        <p id={errorId} className="ns-tags-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
