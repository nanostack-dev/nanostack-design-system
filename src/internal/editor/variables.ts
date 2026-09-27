import {
  completionStatus,
  selectedCompletion,
  type CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import {
  type Extension,
  type Range,
  RangeSetBuilder,
  StateEffect,
  StateField,
  type Text,
} from '@codemirror/state';
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

const scanMargin = 1000;

type AddVariableMark = (from: number, to: number, mark: Decoration) => void;

function variableMark(name: string, resolved: boolean) {
  return Decoration.mark({
    class: resolved ? 'cm-variable cm-variable-resolved' : 'cm-variable',
    attributes: { 'data-variable': name },
  });
}

function markVariables(
  doc: Text,
  from: number,
  to: number,
  resolver: ((name: string) => string | undefined) | undefined,
  options: VariableMatchOptions | undefined,
  add: AddVariableMark,
) {
  for (let position = from; position <= to; ) {
    const line = doc.lineAt(position);
    const start = Math.max(line.from, from);
    const end = Math.min(line.to, to);
    for (const match of getVariableMatches(doc.sliceString(start, end), options)) {
      add(
        start + match.from,
        start + match.to,
        variableMark(match.name, resolver?.(match.name) !== undefined),
      );
    }
    position = line.to + 1;
  }
}

function visibleScanRanges(view: EditorView) {
  const { doc } = view.state;
  const ranges: { from: number; to: number }[] = [];
  for (const { from, to } of view.visibleRanges) {
    const start = Math.max(doc.lineAt(from).from, from - scanMargin);
    const end = Math.min(doc.lineAt(to).to, to + scanMargin);
    const previous = ranges.at(-1);
    if (previous && previous.to >= start) previous.to = Math.max(previous.to, end);
    else ranges.push({ from: start, to: end });
  }
  return ranges;
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

/** Marks variables in the visible ranges only and rescans just the lines an edit touches. */
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
          this.decorations = this.build(view);
        }

        update(update: ViewUpdate) {
          const resolverChanged = update.transactions.some((transaction) =>
            transaction.effects.some((effect) => effect.is(setResolverEffect)),
          );
          if (resolverChanged || update.viewportMoved) {
            this.decorations = this.build(update.view);
            return;
          }
          if (!update.docChanged) return;
          let changedFrom = update.state.doc.length;
          let changedTo = 0;
          update.changes.iterChangedRanges((_fromA, _toA, fromB, toB) => {
            changedFrom = Math.min(changedFrom, fromB);
            changedTo = Math.max(changedTo, toB);
          });
          if (changedTo - changedFrom > scanMargin) {
            this.decorations = this.build(update.view);
            return;
          }
          const { doc } = update.state;
          const from = Math.max(doc.lineAt(changedFrom).from, changedFrom - scanMargin);
          const to = Math.min(doc.lineAt(changedTo).to, changedTo + scanMargin);
          const added: Range<Decoration>[] = [];
          markVariables(
            doc,
            from,
            to,
            update.state.field(resolverField, false),
            options,
            (markFrom, markTo, mark) => added.push(mark.range(markFrom, markTo)),
          );
          this.decorations = this.decorations.map(update.changes).update({
            filterFrom: from,
            filterTo: to,
            filter: (markFrom, markTo) => markFrom < from || markTo > to,
            add: added,
          });
        }

        build(view: EditorView) {
          const builder = new RangeSetBuilder<Decoration>();
          const resolve = view.state.field(resolverField, false);
          for (const range of visibleScanRanges(view)) {
            markVariables(
              view.state.doc,
              range.from,
              range.to,
              resolve,
              options,
              (from, to, mark) => builder.add(from, to, mark),
            );
          }
          return builder.finish();
        }
      },
      { decorations: (plugin) => plugin.decorations },
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
      validFor: /^[\w.-]*$/,
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
    const line = view.state.doc.lineAt(pos);
    const start = Math.max(line.from, pos - scanMargin);
    const end = Math.min(line.to, pos + scanMargin);

    for (const found of getVariableMatches(view.state.doc.sliceString(start, end), options)) {
      const match = { name: found.name, from: start + found.from, to: start + found.to };
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
