'use client';
import type { NoCustomStyle } from '../internal/props.js';
import { PlusIcon, TagIcon, XIcon } from '@phosphor-icons/react';
import * as React from 'react';

import { Badge } from './badge.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandStatus,
} from './command.js';

export interface TagAutocompleteProps extends NoCustomStyle {
  /** Selected tags. Controlled. */
  value: string[];
  onChange: (next: string[]) => void;
  /** Tags to suggest, for example the organization's existing flow tags. */
  suggestions: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  inputId?: string;
  'aria-label'?: string;
  /** Allow entering a tag that is not in suggestions. Defaults to true for editor use. */
  allowCreate?: boolean;
  /** Normalize raw input before adding. Defaults to trim + lowercase. */
  transformTag?: (raw: string) => string;
  /** Return an error message to reject a tag, or null to accept it. */
  validateTag?: (tag: string, existing: readonly string[]) => string | null;
}

const MAX_VISIBLE_SUGGESTIONS = 50;

/**
 * TagAutocomplete is a generic controlled multi-tag picker: removable badges
 * plus a combobox that filters suggestions as you type. Callers can optionally
 * allow creating new tags.
 */
export function TagAutocomplete({
  value,
  onChange,
  suggestions,
  placeholder = 'Add or search a tag...',
  disabled = false,
  loading = false,
  inputId,
  'aria-label': ariaLabel,
  allowCreate = true,
  transformTag = (raw) => raw.trim().toLowerCase(),
  validateTag,
}: TagAutocompleteProps) {
  const [draft, setDraft] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const generatedId = React.useId();
  const errorId = `${inputId ?? generatedId}-error`;

  const selected = React.useMemo(() => new Set(value), [value]);
  const normalizedDraft = transformTag(draft);

  const available = React.useMemo(
    () => suggestions.filter((tag) => !selected.has(tag)),
    [suggestions, selected],
  );
  const filtered = React.useMemo(() => {
    const query = draft.trim().toLowerCase();
    const matches = query
      ? available.filter((tag) => tag.toLowerCase().includes(query))
      : available;
    return matches.slice(0, MAX_VISIBLE_SUGGESTIONS);
  }, [available, draft]);

  const canCreate =
    allowCreate &&
    normalizedDraft.length > 0 &&
    !selected.has(normalizedDraft) &&
    !available.some((tag) => tag.toLowerCase() === normalizedDraft.toLowerCase());

  const addTag = (raw: string) => {
    if (disabled) return;
    const tag = transformTag(raw);
    setDraft('');
    if (!tag || selected.has(tag)) {
      return;
    }
    const validationError = validateTag?.(tag, value) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }
    onChange([...value, tag]);
    setError(null);
  };

  const removeAt = (index: number) => {
    if (disabled) return;
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
    setError(null);
  };

  React.useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const showDropdown = !disabled && open;

  return (
    <div ref={containerRef} className="ns-tags">
      {value.length > 0 ? (
        <div className="ns-tags-selected">
          {value.map((tag, index) => (
            <Badge key={tag} tone="neutral">
              {tag}
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(index)}
                aria-label={`Remove ${tag}`}
                className="ns-tag-remove"
              >
                <XIcon width={12} height={12} aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <Command label={ariaLabel ?? 'Tags'} shouldFilter={false}>
        <CommandInput
          expanded={showDropdown}
          id={inputId}
          value={draft}
          onValueChange={(nextValue) => {
            setDraft(nextValue);
            setOpen(true);
            if (error) {
              setError(null);
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
            }
            if (event.key === 'ArrowDown') {
              setOpen(true);
            }
            if (event.key === 'Backspace' && draft === '' && value.length > 0) {
              removeAt(value.length - 1);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <CommandList hidden={!showDropdown}>
          {loading && filtered.length === 0 && !canCreate ? (
            <CommandStatus>Loading tags...</CommandStatus>
          ) : null}
          {!loading ? <CommandEmpty>No matching tags.</CommandEmpty> : null}
          {filtered.length > 0 ? (
            <CommandGroup heading="Existing tags">
              {filtered.map((tag) => (
                <CommandItem key={tag} value={tag} onSelect={() => addTag(tag)}>
                  <TagIcon />
                  {tag}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {canCreate ? (
            <CommandGroup heading="Create">
              <CommandItem value={`create:${normalizedDraft}`} onSelect={() => addTag(draft)}>
                <PlusIcon />
                Create "{normalizedDraft}"
              </CommandItem>
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
      {error ? (
        <p id={errorId} className="ns-tags-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
