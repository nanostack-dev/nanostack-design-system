import { safeProps, type NoCustomStyle } from '../internal/props.js';
import { tokenizeSourceLine } from './source-tokens.js';
export { tokenizeSourceLine, type SourceToken, type SourceTokenKind } from './source-tokens.js';

export type SourcePaneProps = NoCustomStyle & {
  label: string;
  file?: string | undefined;
  lines: readonly string[];
  lineStart?: number;
  changedLines?: readonly boolean[];
  change?: 'added' | 'removed';
  emptyMessage?: string;
};
/** Line-oriented source context with semantic diff marks and immutable syntax colors. */
export function SourcePane({
  label,
  file,
  lines,
  lineStart = 1,
  changedLines = [],
  change = 'added',
  emptyMessage = 'No source context',
  ...props
}: SourcePaneProps) {
  return (
    <section {...safeProps(props)} aria-label={label} className="ns-source-pane">
      <header className="ns-source-pane-header">
        <span>{label}</span>
        {file ? <code>{file.split('/').pop() ?? file}</code> : null}
      </header>
      {lines.length === 0 ? (
        <p className="ns-source-pane-empty">{emptyMessage}</p>
      ) : (
        <div
          className="ns-source-pane-scroll"
          role="region"
          aria-label={`${label} source`}
          // The horizontal source viewport must be reachable for keyboard scrolling.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <div className="ns-source-pane-lines">
            {lines.map((line, index) => (
              <div
                key={index}
                className="ns-source-line"
                data-change={changedLines[index] ? change : undefined}
              >
                <span className="ns-source-line-number" aria-hidden="true">
                  {lineStart + index}
                </span>
                {changedLines[index] ? (
                  <mark>{line}</mark>
                ) : (
                  <span className="ns-source-line-text">
                    {tokenizeSourceLine(line).map((token, tokenIndex) => (
                      <span key={tokenIndex} data-token={token.kind}>
                        {token.text}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
