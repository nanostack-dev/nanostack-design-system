import {
  completionStatus,
  selectedCompletion,
  type CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import { type Extension, StateEffect, StateField, type Text } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  EditorView,
  hoverTooltip,
  type Tooltip,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';

import {
  getVariableMatches,
  getCompletionMatch,
  type Variable,
  type VariableMatchOptions,
} from '../../components/editor-variables.js';

export function createVariableDecorations(
  doc: Text,
  resolver?: (name: string) => string | undefined,
  options?: VariableMatchOptions,
): DecorationSet {
  const decorations: { from: number; to: number; decoration: Decoration }[] = [];
  const text = doc.toString();

  for (const match of getVariableMatches(text, options)) {
    const resolved = resolver?.(match.name);

    decorations.push({
      from: match.from,
      to: match.to,
      decoration: Decoration.mark({
        class: resolved !== undefined ? 'cm-variable cm-variable-resolved' : 'cm-variable',
        attributes: { 'data-variable': match.name },
      }),
    });
  }

  return Decoration.set(
    decorations.map((decoration) => decoration.decoration.range(decoration.from, decoration.to)),
    true,
  );
}

export const setResolverEffect = StateEffect.define<(name: string) => string | undefined>();

export const resolverField = StateField.define<((name: string) => string | undefined) | undefined>({
  create: () => undefined,
  update: (value, transaction) => {
    for (const effect of transaction.effects) {
      if (effect.is(setResolverEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

export function variableHighlighting(
  resolver?: (name: string) => string | undefined,
  options?: VariableMatchOptions,
): Extension {
  return [
    resolverField.init(() => resolver),
    ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
          const nextResolver = view.state.field(resolverField, false);
          this.decorations = createVariableDecorations(view.state.doc, nextResolver, options);
        }

        update(update: ViewUpdate) {
          if (
            update.docChanged ||
            update.transactions.some((transaction) =>
              transaction.effects.some((effect) => effect.is(setResolverEffect)),
            )
          ) {
            const nextResolver = update.state.field(resolverField, false);
            this.decorations = createVariableDecorations(update.state.doc, nextResolver, options);
          }
        }
      },
      { decorations: (view) => view.decorations },
    ),
  ];
}

export function variableCompletions(
  variables: readonly Variable[],
  options?: VariableMatchOptions,
) {
  return (context: CompletionContext): CompletionResult | null => {
    const beforeCursor = context.state.sliceDoc(Math.max(0, context.pos - 50), context.pos);
    const completionMatch = getCompletionMatch(beforeCursor, options);

    if (!completionMatch) {
      return null;
    }

    const typed = completionMatch.typedSegment.trim() || '';
    const from = context.pos - typed.length;
    const filtered = variables.filter((variable) =>
      variable.name.toLowerCase().startsWith(typed.toLowerCase()),
    );

    if (filtered.length === 0) {
      return null;
    }

    return {
      from,
      options: filtered.map((variable) => ({
        label: variable.name,
        type: 'variable',
        ...(variable.value !== undefined ? { detail: variable.value } : {}),
        ...(variable.description !== undefined ? { info: variable.description } : {}),
        apply(view, completion, applyFrom, applyTo) {
          const textAfter = view.state.sliceDoc(
            applyTo,
            applyTo + completionMatch.template.close.length + 6,
          );
          const hasClosing = textAfter.trim().startsWith(completionMatch.template.close);
          let insert = completion.label;

          if (!hasClosing) {
            insert += completionMatch.template.close;
          }

          view.dispatch({
            changes: { from: applyFrom, to: applyTo, insert },
            selection: { anchor: applyFrom + insert.length },
          });
        },
      })),
    };
  };
}

// ---------------------------------------------------------------------------
// Inline ghost preview (IntelliJ / Copilot style)
// ---------------------------------------------------------------------------

class GhostCompletionWidget extends WidgetType {
  constructor(private readonly text: string) {
    super();
  }

  eq(other: GhostCompletionWidget) {
    return other.text === this.text;
  }

  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-completion-ghost';
    span.textContent = this.text;
    return span;
  }

  ignoreEvent() {
    return true;
  }
}

/**
 * Renders the currently-selected completion inline as dimmed ghost text right
 * after the cursor (accept with Tab, arrow keys still pick another from the
 * dropdown). Purely visual — the actual insert is done by the completion's
 * `apply`, so this only previews the same result.
 */
export function inlineCompletionPreview(options?: VariableMatchOptions): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet = Decoration.none;

      constructor(view: EditorView) {
        this.decorations = this.build(view);
      }

      update(update: ViewUpdate) {
        this.decorations = this.build(update.view);
      }

      build(view: EditorView): DecorationSet {
        const { state } = view;
        if (completionStatus(state) !== 'active') {
          return Decoration.none;
        }
        const selected = selectedCompletion(state);
        if (!selected) {
          return Decoration.none;
        }

        const cursor = state.selection.main.head;
        if (!state.selection.main.empty) {
          return Decoration.none;
        }

        const before = state.sliceDoc(Math.max(0, cursor - 50), cursor);
        const match = getCompletionMatch(before, options);
        if (!match) {
          return Decoration.none;
        }

        const typed = match.typedSegment.trim();
        const label = selected.label;
        if (!label.toLowerCase().startsWith(typed.toLowerCase())) {
          return Decoration.none;
        }

        let ghost = label.slice(typed.length);
        const after = state.sliceDoc(cursor, cursor + match.template.close.length);
        if (!after.startsWith(match.template.close)) {
          ghost += match.template.close;
        }
        if (!ghost) {
          return Decoration.none;
        }

        return Decoration.set([
          Decoration.widget({
            widget: new GhostCompletionWidget(ghost),
            side: 1,
          }).range(cursor),
        ]);
      }
    },
    { decorations: (plugin) => plugin.decorations },
  );
}

export function variableHoverTooltip(options?: VariableMatchOptions): Extension {
  return hoverTooltip((view, pos) => {
    const resolver = view.state.field(resolverField, false);
    const text = view.state.doc.toString();

    for (const match of getVariableMatches(text, options)) {
      if (pos >= match.from && pos < match.to) {
        const resolved = resolver?.(match.name);

        return {
          pos: match.from,
          end: match.to,
          above: true,
          create(): { dom: HTMLElement } {
            const dom = document.createElement('div');
            dom.className = 'cm-variable-tooltip';

            const nameElement = document.createElement('div');
            nameElement.className = 'cm-variable-tooltip-name';
            nameElement.textContent = match.name;
            dom.appendChild(nameElement);

            const valueElement = document.createElement('div');
            valueElement.className =
              resolved !== undefined
                ? 'cm-variable-tooltip-value'
                : 'cm-variable-tooltip-value cm-variable-tooltip-unresolved';

            if (resolved === undefined) {
              valueElement.textContent = 'Not defined';
            } else if (resolved === '') {
              valueElement.textContent = '(Empty string)';
              valueElement.classList.add('cm-variable-tooltip-empty');
            } else {
              valueElement.textContent = resolved;
            }

            dom.appendChild(valueElement);

            return { dom };
          },
        } satisfies Tooltip;
      }
    }

    return null;
  });
}
