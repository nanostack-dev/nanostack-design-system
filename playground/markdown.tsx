import { Lexer, type Token, type Tokens } from 'marked';
import type { ReactNode } from 'react';
import * as UI from '../src/index.js';
import { resolveDocumentHref, type MarkdownDocument } from './docs.js';

export type MarkdownHeading = { id: string; text: string; depth: number };
export type PreparedMarkdown = {
  path: string;
  tokens: Token[];
  headings: Map<Token, MarkdownHeading>;
  outline: MarkdownHeading[];
};

function plainText(tokens: readonly Token[]): string {
  return tokens
    .map((token) => {
      if ('tokens' in token && token.tokens) return plainText(token.tokens);
      return 'text' in token && typeof token.text === 'string' ? token.text : '';
    })
    .join('');
}

/** GitHub's anchor rule: `Menus, dialogs, and navigation` → `menus-dialogs-and-navigation`. */
export function headingSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

/** Parses once so the outline and the article share heading ids. Level-1 titles are dropped. */
export function prepareMarkdown(document: MarkdownDocument): PreparedMarkdown {
  const tokens = Lexer.lex(document.source).filter(
    (token) => !(token.type === 'heading' && token.depth === 1),
  );
  const headings = new Map<Token, MarkdownHeading>();
  const used = new Map<string, number>();
  for (const token of tokens) {
    if (token.type !== 'heading') continue;
    const text = plainText(token.tokens ?? []);
    const slug = headingSlug(text);
    const count = used.get(slug) ?? 0;
    used.set(slug, count + 1);
    headings.set(token, { id: count ? `${slug}-${count}` : slug, text, depth: token.depth });
  }
  return {
    path: document.path,
    tokens,
    headings,
    outline: [...headings.values()].filter((heading) => heading.depth === 2),
  };
}

type RenderContext = { path: string; headings: Map<Token, MarkdownHeading>; table: string };

function renderInline(tokens: readonly Token[], context: RenderContext): ReactNode[] {
  return tokens.map((token, index) => {
    switch (token.type) {
      case 'strong':
        return <strong key={index}>{renderInline(token.tokens ?? [], context)}</strong>;
      case 'em':
        return <em key={index}>{renderInline(token.tokens ?? [], context)}</em>;
      case 'del':
        return <del key={index}>{renderInline(token.tokens ?? [], context)}</del>;
      case 'codespan':
        return <UI.Code key={index}>{token.text}</UI.Code>;
      case 'br':
        return <br key={index} />;
      case 'link': {
        const href = resolveDocumentHref(context.path, token.href);
        const content = renderInline(token.tokens ?? [], context);
        return href ? (
          <UI.Link key={index} href={href}>
            {content}
          </UI.Link>
        ) : (
          <span key={index}>{content}</span>
        );
      }
      case 'image':
        return <span key={index}>{token.text}</span>;
      case 'html':
      case 'escape':
        return token.text;
      default:
        if ('tokens' in token && token.tokens) return renderInline(token.tokens, context);
        return 'text' in token ? token.text : null;
    }
  });
}

const headingLevels = { 2: [2, 'xl'], 3: [3, 'lg'] } as const;
const codeLanguages: Record<string, 'json' | 'xml' | 'html'> = {
  json: 'json',
  xml: 'xml',
  html: 'html',
};

function renderBlock(token: Token, index: number, context: RenderContext): ReactNode {
  switch (token.type) {
    case 'heading': {
      const heading = context.headings.get(token)!;
      context.table = heading.text;
      const [level, size] = headingLevels[heading.depth as 2 | 3] ?? [4, 'lg'];
      return (
        <UI.Heading key={index} id={heading.id} level={level} size={size}>
          {renderInline(token.tokens ?? [], context)}
        </UI.Heading>
      );
    }
    case 'paragraph':
      return <UI.Text key={index}>{renderInline(token.tokens ?? [], context)}</UI.Text>;
    case 'text':
      return token.tokens ? renderInline(token.tokens, context) : token.text;
    case 'list': {
      const list = token as Tokens.List;
      const items = list.items.map((item, itemIndex) => (
        <UI.ListItem key={itemIndex}>{renderBlocks(item.tokens, context)}</UI.ListItem>
      ));
      return list.ordered ? (
        <UI.OrderedList key={index}>{items}</UI.OrderedList>
      ) : (
        <UI.List key={index}>{items}</UI.List>
      );
    }
    case 'code':
      return (
        <UI.Surface key={index} tone="subtle" padding="sm">
          <UI.CodeViewer
            label={token.lang ? `${token.lang} example` : 'Code example'}
            language={codeLanguages[token.lang ?? ''] ?? 'text'}
            height="content"
            value={token.text}
          />
        </UI.Surface>
      );
    case 'blockquote':
      return (
        <UI.Callout key={index}>
          <UI.Stack gap="sm">{renderBlocks(token.tokens ?? [], context)}</UI.Stack>
        </UI.Callout>
      );
    case 'hr':
      return <UI.Divider key={index} />;
    case 'table': {
      const table = token as Tokens.Table;
      const align = (cell: Tokens.TableCell) =>
        cell.align === 'right' ? 'end' : cell.align === 'center' ? 'center' : 'start';
      return (
        <UI.Table key={index} label={context.table || 'Reference table'}>
          <UI.TableHeader>
            <UI.TableRow>
              {table.header.map((cell, cellIndex) => (
                <UI.TableHead key={cellIndex} align={align(cell)}>
                  {renderInline(cell.tokens, context)}
                </UI.TableHead>
              ))}
            </UI.TableRow>
          </UI.TableHeader>
          <UI.TableBody>
            {table.rows.map((row, rowIndex) => (
              <UI.TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <UI.TableCell key={cellIndex} align={align(cell)}>
                    {renderInline(cell.tokens, context)}
                  </UI.TableCell>
                ))}
              </UI.TableRow>
            ))}
          </UI.TableBody>
        </UI.Table>
      );
    }
    case 'html':
      return token.text.trimStart().startsWith('<!--') ? null : (
        <UI.Text key={index}>{token.text}</UI.Text>
      );
    default:
      return null;
  }
}

function renderBlocks(tokens: readonly Token[], context: RenderContext): ReactNode[] {
  return tokens.map((token, index) => renderBlock(token, index, context));
}

/** Groups blocks under each level-2 heading so sections get more space than paragraphs. */
export function MarkdownArticle({ markdown }: { markdown: PreparedMarkdown }) {
  const context: RenderContext = { path: markdown.path, headings: markdown.headings, table: '' };
  const sections: Token[][] = [[]];
  for (const token of markdown.tokens) {
    if (token.type === 'heading' && token.depth === 2) sections.push([]);
    sections.at(-1)!.push(token);
  }
  return (
    <UI.Stack gap="xl">
      {sections
        .filter((section) => section.some((token) => token.type !== 'space'))
        .map((section, index) => (
          <UI.Stack key={index} gap="md">
            {renderBlocks(section, context)}
          </UI.Stack>
        ))}
    </UI.Stack>
  );
}

export function MarkdownOutline({
  markdown,
  label,
}: {
  markdown: PreparedMarkdown;
  label: string;
}) {
  if (markdown.outline.length < 2) return null;
  return (
    <nav aria-label={label}>
      <UI.Stack gap="sm">
        <UI.Text size="xs" weight="semibold" tone="muted">
          {label}
        </UI.Text>
        <UI.List marker="none" gap="xs">
          {markdown.outline.map((heading) => (
            <UI.ListItem key={heading.id}>
              <UI.Link href={`#${heading.id}`} variant="muted" size="sm">
                {heading.text}
              </UI.Link>
            </UI.ListItem>
          ))}
        </UI.List>
      </UI.Stack>
    </nav>
  );
}
