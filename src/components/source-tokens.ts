export type SourceTokenKind =
  | 'key'
  | 'string'
  | 'number'
  | 'keyword'
  | 'comment'
  | 'punctuation'
  | 'plain';

export interface SourceToken {
  kind: SourceTokenKind;
  text: string;
}

const KEY_PATTERN = /^(\s*(?:-\s+)?)("[^"]*"|'[^']*'|[^\s#:{}[\],]+)(:)(\s|$)/;
const KEYWORD_PATTERN = /^(true|false|null|yes|no|~)$/i;
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;

/**
 * Line tokenizer for YAML and JSON spec source.
 *
 * Example: "    maximum: 100" tokenizes as
 * [plain "    "] [key "maximum"] [punctuation ":"] [plain " "] [number "100"].
 * A JSON line like "  \"maximum\": 100," keys on the same pattern because the
 * key match accepts a quoted form, and the trailing comma falls out of the
 * value walk as punctuation.
 */
export function tokenizeSourceLine(line: string): SourceToken[] {
  const commentStart = findCommentStart(line);
  const code = commentStart === -1 ? line : line.slice(0, commentStart);
  const tokens: SourceToken[] = [];

  const keyMatch = KEY_PATTERN.exec(code);
  let rest = code;
  if (keyMatch?.[2] && keyMatch[3] && keyMatch[4] !== undefined) {
    if (keyMatch[1]) tokens.push({ kind: 'plain', text: keyMatch[1] });
    tokens.push({ kind: 'key', text: keyMatch[2] });
    tokens.push({ kind: 'punctuation', text: keyMatch[3] });
    rest = code.slice(keyMatch[0].length - keyMatch[4].length);
  }

  tokens.push(...tokenizeValue(rest));
  if (commentStart !== -1) {
    tokens.push({ kind: 'comment', text: line.slice(commentStart) });
  }
  return tokens.filter((token) => token.text !== '');
}

function findCommentStart(line: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === "'" && !inDouble) inSingle = !inSingle;
    else if (char === '"' && !inSingle) inDouble = !inDouble;
    else if (char === '#' && !inSingle && !inDouble && (i === 0 || line[i - 1] === ' ')) {
      return i;
    }
  }
  return -1;
}

function tokenizeValue(text: string): SourceToken[] {
  const tokens: SourceToken[] = [];
  let plain = '';

  const flushPlain = () => {
    if (plain !== '') {
      tokens.push(...classifyWords(plain));
      plain = '';
    }
  };

  let i = 0;
  while (i < text.length) {
    const char = text.charAt(i);
    if (char === '"' || char === "'") {
      const end = text.indexOf(char, i + 1);
      const stringEnd = end === -1 ? text.length : end + 1;
      flushPlain();
      tokens.push({ kind: 'string', text: text.slice(i, stringEnd) });
      i = stringEnd;
    } else if ('{}[],:'.includes(char)) {
      flushPlain();
      tokens.push({ kind: 'punctuation', text: char });
      i++;
    } else {
      plain += char;
      i++;
    }
  }
  flushPlain();
  return tokens;
}

function classifyWords(text: string): SourceToken[] {
  const tokens: SourceToken[] = [];
  for (const part of text.split(/(\s+)/)) {
    if (part === '') continue;
    if (KEYWORD_PATTERN.test(part)) {
      tokens.push({ kind: 'keyword', text: part });
    } else if (NUMBER_PATTERN.test(part)) {
      tokens.push({ kind: 'number', text: part });
    } else {
      tokens.push({ kind: 'plain', text: part });
    }
  }
  return tokens;
}
