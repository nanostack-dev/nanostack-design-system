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

const DEFAULT_VARIABLE_PATTERN = /\{\{\{?\s*([^}]+?)\s*\}\}\}?/g;

const DEFAULT_VARIABLE_TEMPLATES: VariableTemplate[] = [
  { open: '{{{', close: '}}}' },
  { open: '{{', close: '}}' },
];

export interface VariableMatch {
  from: number;
  to: number;
  name: string;
}

function getVariablePattern(pattern?: RegExp | undefined): RegExp {
  const source = pattern ?? DEFAULT_VARIABLE_PATTERN;
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

export function getVariableMatches(text: string, options?: VariableMatchOptions): VariableMatch[] {
  const matches: VariableMatch[] = [];
  const pattern = getVariablePattern(options?.pattern);
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
