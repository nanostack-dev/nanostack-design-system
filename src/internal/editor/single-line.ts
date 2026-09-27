import { pickedCompletion } from '@codemirror/autocomplete';
import { isolateHistory } from '@codemirror/commands';
import {
  type AnnotationType,
  ChangeSet,
  type ChangeSpec,
  EditorState,
  type Extension,
  StateEffect,
  Transaction,
} from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

/** Removes every inserted line break, whether a command, paste, drop or completion added it. */
const withoutLineBreaks = EditorState.transactionFilter.of((transaction) => {
  const lineBreaks: ChangeSpec[] = [];
  transaction.changes.iterChanges((_fromA, _toA, fromB, _toB, inserted) => {
    for (let line = 1; line < inserted.lines; line++) {
      const lineBreak = fromB + inserted.line(line).to;
      lineBreaks.push({ from: lineBreak, to: lineBreak + 1 });
    }
  });
  if (!lineBreaks.length) return transaction;
  const removal = ChangeSet.of(lineBreaks, transaction.newDoc.length);
  const keep = <T>(type: AnnotationType<T>) => {
    const value = transaction.annotation(type);
    return value === undefined ? [] : [type.of(value)];
  };
  return {
    changes: transaction.changes.compose(removal),
    selection: transaction.newSelection.map(removal),
    effects: StateEffect.mapEffects(transaction.effects, removal),
    scrollIntoView: transaction.scrollIntoView,
    annotations: [
      ...keep(Transaction.userEvent),
      ...keep(Transaction.addToHistory),
      ...keep(Transaction.remote),
      ...keep(isolateHistory),
      ...keep(pickedCompletion),
    ],
  };
});

export function singleLine(): Extension {
  return [
    keymap.of([
      { key: 'Enter', run: () => true, shift: () => true },
      { key: 'Mod-Enter', run: () => true },
    ]),
    withoutLineBreaks,
    EditorView.theme({
      '&': {
        height: '100%',
      },
      '.cm-scroller': {
        overflow: 'hidden !important',
        scrollbarWidth: 'none',
      },
      '.cm-scroller::-webkit-scrollbar': {
        display: 'none',
      },
      '.cm-content': {
        whiteSpace: 'nowrap',
      },
      '.cm-line': {
        padding: '0',
      },
    }),
  ];
}
