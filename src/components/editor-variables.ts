export interface Variable {
  name: string;
  value?: string | undefined;
  description?: string | undefined;
}

export interface VariableTemplate {
  open: string;
  close: string;
}

export interface VariableMatchOptions {
  pattern?: RegExp | undefined;
  templates?: readonly VariableTemplate[] | undefined;
}

const DEFAULT_VARIABLE_PATTERN = /\{\{(\{?)([^{}]*)\}\}/g;

const DEFAULT_VARIABLE_TEMPLATES: VariableTemplate[] = [
  { open: '{{{', close: '}}}' },
  { open: '{{', close: '}}' },
];

export interface VariableMatch {
  from: number;
  to: number;
  name: string;
}

function getVariablePattern(source: RegExp): RegExp {
  const flags = source.flags.includes('g') ? source.flags : `${source.flags}g`;

  return new RegExp(source.source, flags);
}

function getVariableTemplates(
  templates?: readonly VariableTemplate[] | undefined,
): VariableTemplate[] {
  return [...(templates?.length ? templates : DEFAULT_VARIABLE_TEMPLATES)].sort(
    (left, right) => right.open.length - left.open.length,
  );
}

/**
 * Matches `{{name}}` and `{{{name}}}` in linear time. The body cannot contain a brace, and a
 * third closing brace belongs to the variable only when it also opened with three braces.
 *
 * `{"id":{{userId}}}`: the pattern finds `{{userId}}` at 6..16. It opened with two braces, so
 * the JSON `}` at 16 stays outside: `{ from: 6, to: 16, name: 'userId' }`.
 * `{{{token}}}`: the pattern finds `{{{token}}` at 0..10. It opened with three braces and
 * `text[10]` is `}`, so the match ends at 11: `{ from: 0, to: 11, name: 'token' }`.
 */
function getDefaultVariableMatches(text: string): VariableMatch[] {
  const matches: VariableMatch[] = [];
  for (const match of text.matchAll(DEFAULT_VARIABLE_PATTERN)) {
    const name = match[2]?.trim();
    if (!name) continue;
    const opensWithThreeBraces = match[1] === '{';
    let to = match.index + match[0].length;
    if (opensWithThreeBraces && text[to] === '}') to += 1;
    matches.push({ from: match.index, to, name });
  }
  return matches;
}

export function getVariableMatches(text: string, options?: VariableMatchOptions): VariableMatch[] {
  if (!options?.pattern) return getDefaultVariableMatches(text);
  const matches: VariableMatch[] = [];
  const pattern = getVariablePattern(options.pattern);
  let match = pattern.exec(text);

  while (match !== null) {
    const fullMatch = match[0] ?? '';
    const name = match[1]?.trim();

    if (fullMatch.length === 0) {
      const codePoint = text.codePointAt(pattern.lastIndex);
      pattern.lastIndex += pattern.unicode && codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
      match = pattern.exec(text);
      continue;
    }

    if (name) {
      matches.push({
        from: match.index,
        to: match.index + fullMatch.length,
        name,
      });
    }

    match = pattern.exec(text);
  }

  return matches;
}

export function getCompletionMatch(text: string, options?: VariableMatchOptions) {
  const templates = getVariableTemplates(options?.templates);

  for (const template of templates) {
    const openIndex = text.lastIndexOf(template.open);

    if (openIndex < 0) {
      continue;
    }

    const typedSegment = text.slice(openIndex + template.open.length);
    if (typedSegment.includes(template.close)) {
      continue;
    }

    return { template, typedSegment };
  }

  return null;
}
