'use client';

import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
  type CompletionContext,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import {
  Annotation,
  Compartment,
  EditorState,
  type Extension,
  Text,
  Transaction,
} from '@codemirror/state';
import {
  lineNumbers as cmLineNumbers,
  placeholder as cmPlaceholder,
  drawSelection,
  EditorView,
  keymap,
  tooltips,
} from '@codemirror/view';
import { classHighlighter } from '@lezer/highlight';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AriaAttributes,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { singleLine } from '../internal/editor/single-line.js';
import {
  inlineCompletionPreview,
  refreshVariables,
  variableCompletions,
  variableHighlighting,
  variableHoverTooltip,
} from '../internal/editor/variables.js';
import { safeProps, type NoCustomStyle } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import type { Variable, VariableMatchOptions, VariableTemplate } from './editor-variables.js';

export type CodeLanguage = 'text' | 'json' | 'xml' | 'html';
export type EditorHeight = 'content' | 'compact' | 'standard' | 'fill';
export type EditorVariant = 'input' | 'editor' | 'viewer';

/** Behavior-only ref: CodeMirror configuration and DOM styling remain private. */
export interface CodeEditorHandle {
  focus(): void;
  selectAll(): void;
  getValue(): string;
}

export type CodeEditorProps = NoCustomStyle &
  AriaAttributes & {
    ref?: Ref<CodeEditorHandle> | undefined;
    id?: string | undefined;
    title?: string | undefined;
    'data-testid'?: string | undefined;
    value?: string | undefined;
    defaultValue?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    onFocus?: ((event: FocusEvent) => void) | undefined;
    onBlur?: ((event: FocusEvent) => void) | undefined;
    onKeyDown?: ((event: KeyboardEvent) => void) | undefined;
    onKeyUp?: ((event: KeyboardEvent) => void) | undefined;
    language?: CodeLanguage | undefined;
    variables?: readonly Variable[] | undefined;
    variablesEnabled?: boolean | undefined;
    variablePattern?: RegExp | undefined;
    variableTemplates?: readonly VariableTemplate[] | undefined;
    variableResolver?: ((name: string) => string | undefined) | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    disabled?: boolean | undefined;
    height?: EditorHeight | undefined;
    lineNumbers?: boolean | undefined;
    autoDetectLanguage?: boolean | undefined;
    variant?: EditorVariant | undefined;
    /** Identity of the edited document; a new key starts a fresh selection and undo history. */
    documentKey?: string | number | undefined;
  };

function detectLanguage(doc: Text): CodeLanguage {
  const trimmed = doc.sliceString(0, 4096).trimStart();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (/^<!DOCTYPE\s+html|^<html/i.test(trimmed)) return 'html';
  if (/^<\?xml|^<[a-zA-Z]/.test(trimmed)) return 'xml';
  return 'text';
}

function languageExtension(language: CodeLanguage): Extension {
  switch (language) {
    case 'json':
      return json();
    case 'xml':
      return xml();
    case 'html':
      return html();
    default:
      return [];
  }
}

/** Follows the document's content: each edit re-detects and swaps the language when it changes. */
function detectedLanguage(compartment: Compartment, language: CodeLanguage): Extension {
  return [
    languageExtension(language),
    EditorState.transactionExtender.of((transaction) => {
      if (!transaction.docChanged) return null;
      const next = detectLanguage(transaction.newDoc);
      return next === language
        ? null
        : { effects: compartment.reconfigure(detectedLanguage(compartment, next)) };
    }),
  ];
}

const emptyVariables: readonly Variable[] = [];
const externalValue = Annotation.define<boolean>();

/**
 * The smallest single replacement that turns `current` into `next`, so an external value keeps
 * the selection and the undo history mapped around the region that actually changed.
 *
 * `current = 'GET /users'`, `next = 'GET /users/1'`: the common prefix is 10 characters and no
 * suffix remains after it, so the result is `{ from: 10, to: 10, insert: '/1' }`.
 */
function replacementChange(current: string, next: string) {
  if (current === next) return null;
  const shorter = Math.min(current.length, next.length);
  let prefix = 0;
  while (prefix < shorter && current.charCodeAt(prefix) === next.charCodeAt(prefix)) prefix++;
  let suffix = 0;
  while (
    suffix < shorter - prefix &&
    current.charCodeAt(current.length - 1 - suffix) === next.charCodeAt(next.length - 1 - suffix)
  )
    suffix++;
  return {
    from: prefix,
    to: current.length - suffix,
    insert: next.slice(prefix, next.length - suffix),
  };
}

function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

function authoringExtensions(variant: EditorVariant): Extension {
  const viewer = variant === 'viewer';
  return [
    drawSelection(),
    bracketMatching(),
    highlightSelectionMatches(),
    viewer ? EditorView.lineWrapping : [history(), indentOnInput(), closeBrackets()],
    variant === 'input' ? singleLine() : viewer ? [] : foldGutter(),
    keymap.of(
      viewer
        ? [...defaultKeymap, ...searchKeymap]
        : [
            { key: 'Tab', run: acceptCompletion },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
          ],
    ),
  ];
}

/** Accessible, themed editor with a closed presentation API and live configuration. */
export function CodeEditor({
  ref,
  id,
  title,
  'data-testid': testId,
  value,
  defaultValue = '',
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  language = 'text',
  variables = emptyVariables,
  variablesEnabled = true,
  variablePattern,
  variableTemplates,
  variableResolver,
  placeholder = '',
  readOnly: requestedReadOnly = false,
  disabled = false,
  height = 'standard',
  lineNumbers = false,
  autoDetectLanguage = false,
  variant = 'editor',
  documentKey,
  ...attributes
}: CodeEditorProps) {
  const theme = useThemeSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [tooltipHost, setTooltipHost] = useState<HTMLDivElement | null>(null);
  const compartments = useRef({
    language: new Compartment(),
    authoring: new Compartment(),
    editable: new Compartment(),
    lineNumbers: new Compartment(),
    theme: new Compartment(),
    completion: new Compartment(),
    variables: new Compartment(),
    attributes: new Compartment(),
    placeholder: new Compartment(),
  });
  const baseExtensions = useRef<Extension>([]);
  const documentKeyRef = useRef(documentKey);
  const readOnly = requestedReadOnly || disabled || variant === 'viewer';
  const variablesActive = variablesEnabled && variant !== 'viewer';
  const patternSource = variablePattern?.source;
  const patternFlags = variablePattern?.flags;
  const templatesKey = variableTemplates ? JSON.stringify(variableTemplates) : undefined;
  const options = useMemo<VariableMatchOptions>(
    () => ({
      pattern: patternSource === undefined ? undefined : new RegExp(patternSource, patternFlags),
      templates:
        templatesKey === undefined ? undefined : (JSON.parse(templatesKey) as VariableTemplate[]),
    }),
    [patternSource, patternFlags, templatesKey],
  );
  const variableContext = useLatestRef({ variables, variableResolver, variablesEnabled });
  const resolver = useCallback(
    (name: string) => {
      const current = variableContext.current;
      if (!current.variablesEnabled) return undefined;
      const normalized = name.trim();
      return (
        current.variableResolver?.(normalized) ??
        current.variables.find((variable) => variable.name.trim() === normalized)?.value
      );
    },
    [variableContext],
  );
  const completionSource = useMemo(() => {
    return (context: CompletionContext) =>
      variableCompletions(variableContext.current.variables, options)(context);
  }, [options, variableContext]);
  const resolutionKey = JSON.stringify(
    variables.map((variable) => [variable.name.trim(), variable.value ?? null]),
  );
  const onChangeRef = useLatestRef(onChange);
  const eventsRef = useLatestRef({ onFocus, onBlur, onKeyDown, onKeyUp });

  // Attribute values land on the actual textbox, not an inaccessible outer wrapper.
  const contentAttributes: Record<string, string> = {
    role: 'textbox',
    'aria-label': variant === 'viewer' ? 'Code preview' : 'Code editor',
    'aria-multiline': String(variant !== 'input'),
    'aria-readonly': String(readOnly),
    'aria-disabled': String(disabled),
    spellcheck: 'false',
    autocorrect: 'off',
    autocapitalize: 'off',
    tabindex: disabled ? '-1' : '0',
  };
  for (const [key, attributeValue] of Object.entries(safeProps(attributes))) {
    if (key.startsWith('aria-') && attributeValue !== undefined) {
      contentAttributes[key] = String(attributeValue);
    }
  }
  // The variant and disabled state cannot be overridden with conflicting ARIA.
  contentAttributes['aria-readonly'] = String(readOnly);
  contentAttributes['aria-disabled'] = String(disabled);
  contentAttributes['aria-multiline'] = String(variant !== 'input');
  if (id) contentAttributes.id = id;
  if (contentAttributes['aria-labelledby']) delete contentAttributes['aria-label'];
  const attributesKey = JSON.stringify(contentAttributes);
  const initial = useLatestRef({ value, defaultValue, autoDetectLanguage });

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        if (!disabled) viewRef.current?.focus();
      },
      selectAll() {
        const view = viewRef.current;
        if (!view || disabled) return;
        view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } });
      },
      getValue() {
        return viewRef.current?.state.doc.toString() ?? '';
      },
    }),
    [disabled],
  );

  useEffect(() => {
    if (!containerRef.current || !tooltipHost) return;
    const c = compartments.current;
    baseExtensions.current = [
      syntaxHighlighting(classHighlighter),
      EditorView.domEventHandlers({
        focus(event) {
          eventsRef.current.onFocus?.(event);
        },
        blur(event) {
          eventsRef.current.onBlur?.(event);
        },
        keydown(event) {
          eventsRef.current.onKeyDown?.(event);
          return event.defaultPrevented;
        },
        keyup(event) {
          eventsRef.current.onKeyUp?.(event);
          return event.defaultPrevented;
        },
      }),
      tooltips({ parent: tooltipHost }),
      EditorView.updateListener.of((update) => {
        const edited = update.transactions.some(
          (transaction) => transaction.docChanged && !transaction.annotation(externalValue),
        );
        if (edited) onChangeRef.current?.(update.state.doc.toString());
      }),
    ];
    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: initial.current.value ?? initial.current.defaultValue,
        extensions: [
          baseExtensions.current,
          Object.values(c).map((compartment) => compartment.of([])),
        ],
      }),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [eventsRef, initial, onChangeRef, tooltipHost]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (documentKeyRef.current !== documentKey) {
      documentKeyRef.current = documentKey;
      const c = compartments.current;
      const doc = Text.of(
        (initial.current.value ?? initial.current.defaultValue).split(/\r\n?|\n/),
      );
      view.setState(
        EditorState.create({
          doc,
          extensions: [
            baseExtensions.current,
            Object.values(c).map((compartment) =>
              compartment === c.language && initial.current.autoDetectLanguage
                ? compartment.of(detectedLanguage(compartment, detectLanguage(doc)))
                : compartment.of(compartment.get(view.state) ?? []),
            ),
          ],
        }),
      );
      return;
    }
    if (value === undefined) return;
    const change = replacementChange(view.state.doc.toString(), value);
    if (!change) return;
    view.dispatch({
      changes: change,
      annotations: [externalValue.of(true), Transaction.addToHistory.of(false)],
      filter: false,
    });
  }, [value, documentKey, initial, tooltipHost]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const compartment = compartments.current.language;
    view.dispatch({
      effects: compartment.reconfigure(
        autoDetectLanguage
          ? detectedLanguage(compartment, detectLanguage(view.state.doc))
          : languageExtension(language),
      ),
    });
  }, [language, autoDetectLanguage, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.authoring.reconfigure(authoringExtensions(variant)),
    });
  }, [variant, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.editable.reconfigure([
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
      ]),
    });
  }, [readOnly, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.lineNumbers.reconfigure(
        lineNumbers && variant !== 'input' ? cmLineNumbers() : [],
      ),
    });
  }, [lineNumbers, variant, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.variables.reconfigure(
        variablesActive
          ? [
              variableHighlighting(resolver, options),
              variableHoverTooltip(resolver, options),
              inlineCompletionPreview(options),
            ]
          : [],
      ),
    });
  }, [resolver, options, variablesActive, tooltipHost]);

  const resolutionMounted = useRef(false);
  useEffect(() => {
    if (!resolutionMounted.current) {
      resolutionMounted.current = true;
      return;
    }
    viewRef.current?.dispatch({ effects: refreshVariables.of(null) });
  }, [resolutionKey, variableResolver, variablesEnabled]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.completion.reconfigure(
        variant === 'viewer' || readOnly
          ? []
          : autocompletion({
              override: variablesActive ? [completionSource] : [],
              activateOnTyping: true,
              selectOnOpen: true,
              interactionDelay: 0,
            }),
      ),
    });
  }, [completionSource, readOnly, variablesActive, variant, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.theme.reconfigure(
        EditorView.theme({}, { dark: theme.colorScheme === 'dark' }),
      ),
    });
  }, [theme.colorScheme, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.attributes.reconfigure(
        EditorView.contentAttributes.of(JSON.parse(attributesKey) as Record<string, string>),
      ),
    });
  }, [attributesKey, tooltipHost]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: compartments.current.placeholder.reconfigure(
        placeholder ? cmPlaceholder(placeholder) : [],
      ),
    });
  }, [placeholder, tooltipHost]);

  return (
    <>
      <div
        className="ns-code-editor"
        data-slot="code-editor"
        data-ns-editor-variant={variant}
        data-ns-editor-height={height}
        data-ns-editor-disabled={disabled || undefined}
        data-testid={testId}
        title={title}
      >
        <div className="ns-code-editor-mount" ref={containerRef} />
      </div>
      {typeof document !== 'undefined'
        ? createPortal(
            <Theme {...theme}>
              <div className="ns-editor-popovers" ref={setTooltipHost} />
            </Theme>,
            document.body,
          )
        : null}
    </>
  );
}

export type CodeViewerProps = Omit<
  CodeEditorProps,
  | 'variant'
  | 'readOnly'
  | 'onChange'
  | 'defaultValue'
  | 'placeholder'
  | 'variables'
  | 'variablesEnabled'
  | 'variableTemplates'
  | 'variableResolver'
  | 'variablePattern'
>;

export function CodeViewer(props: CodeViewerProps) {
  return <CodeEditor {...props} variant="viewer" />;
}

export type { Variable, VariableTemplate } from './editor-variables.js';
