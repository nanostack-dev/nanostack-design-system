import { existsSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { Lexer, type Token } from 'marked';
import { describe, expect, it } from 'vitest';
import {
  changelogDocument,
  extractSections,
  guidelineDocuments,
  repositoryUrl,
  resolveDocumentHref,
} from '../playground/docs.js';
import { MarkdownArticle, prepareMarkdown } from '../playground/markdown.js';

function links(tokens: readonly Token[]): string[] {
  return tokens.flatMap((token) => {
    const own = token.type === 'link' ? [token.href as string] : [];
    const nested = [
      ...('tokens' in token && token.tokens ? token.tokens : []),
      ...(token.type === 'list' ? token.items : []),
      ...(token.type === 'table'
        ? [...token.header, ...token.rows.flat()].flatMap((cell) => cell.tokens)
        : []),
    ];
    return [...own, ...links(nested)];
  });
}

describe('documentation site guidelines', () => {
  it('renders markdown HTML as text and drops unsafe links', () => {
    const { container } = render(
      <MarkdownArticle
        markdown={prepareMarkdown({
          path: 'docs/example.md',
          source: [
            '# Dropped title',
            '## Menus, dialogs, and navigation',
            '<script>alert(1)</script>',
            '',
            'Inline <img src=x onerror=alert(1)> and [unsafe](javascript:alert(1)).',
            '',
            '| Parts | Rules |',
            '| --- | --- |',
            '| `Menu` | **Bold** rule |',
          ].join('\n'),
        })}
      />,
    );
    expect(container.querySelector('script, img, h1')).toBeNull();
    expect(screen.getByText('<script>alert(1)</script>')).toBeVisible();
    expect(screen.getByText(/<img src=x onerror=alert\(1\)>/)).toBeVisible();
    expect(screen.queryByRole('link', { name: 'unsafe' })).toBeNull();
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute(
      'id',
      'menus-dialogs-and-navigation',
    );
    const table = screen.getByRole('table', { name: 'Menus, dialogs, and navigation' });
    expect(within(table).getByText('Bold').tagName).toBe('STRONG');
  });

  it('keeps document links on the site or points them at the repository', () => {
    expect(resolveDocumentHref('docs/contributing.md', '../AGENTS.md#scope')).toBe(
      '?page=guidelines&tab=contract#scope',
    );
    expect(resolveDocumentHref('docs/contributing.md', 'components.md')).toBe(
      '?page=guidelines&tab=reference',
    );
    expect(resolveDocumentHref('docs/contributing.md', '#library-scope')).toBe('#library-scope');
    expect(resolveDocumentHref('README.md', 'LICENSE')).toBe(`${repositoryUrl}/blob/main/LICENSE`);
    expect(
      resolveDocumentHref(
        'docs/components.md',
        'https://nanostack-dev.github.io/nanostack-design-system/?page=components',
      ),
    ).toBe('?page=components');
    expect(resolveDocumentHref('README.md', 'javascript:alert(1)')).toBeNull();
  });

  it('resolves every link in the rendered documents to a page or an existing file', () => {
    const documents = [...guidelineDocuments.map((guide) => guide.document), changelogDocument];
    for (const document of documents) {
      for (const href of links(Lexer.lex(document.source))) {
        const resolved = resolveDocumentHref(document.path, href);
        expect(resolved, `${document.path}: ${href}`).not.toBeNull();
        if (resolved!.startsWith(`${repositoryUrl}/blob/main/`)) {
          const path = resolved!.slice(`${repositoryUrl}/blob/main/`.length).split('#')[0]!;
          expect(existsSync(path), `${document.path}: ${href}`).toBe(true);
        }
      }
    }
  });

  it('renders the scope and public contract sections of AGENTS.md', () => {
    const contract = guidelineDocuments.find((guide) => guide.id === 'contract')!.document.source;
    expect(contract).toMatch(/^## Scope\n/);
    expect(contract).toMatch(/^## Public contract\n/m);
    expect(() => extractSections('## Other\ntext', ['Scope'])).toThrow('no "## Scope" section');
  });
});
