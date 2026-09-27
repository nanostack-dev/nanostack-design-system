import type { Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

export function singleLine(): Extension {
  return [
    keymap.of([
      {
        key: 'Enter',
        run: () => true,
      },
    ]),
    EditorView.inputHandler.of((view, from, to, text) => {
      if (text.includes('\n') || text.includes('\r')) {
        view.dispatch({
          changes: { from, to, insert: text.replace(/[\n\r]/g, '') },
        });
        return true;
      }

      return false;
    }),
    EditorView.domEventHandlers({
      wheel(event) {
        // Prevent vertical wheel/trackpad from causing horizontal scroll
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    }),
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
