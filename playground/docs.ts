import agents from '../AGENTS.md?raw';
import changelog from '../CHANGELOG.md?raw';
import componentReference from '../docs/components.md?raw';
import contributing from '../docs/contributing.md?raw';
import design from '../DESIGN.md?raw';

export type MarkdownDocument = { path: string; source: string };

export const repositoryUrl = 'https://github.com/nanostack-dev/nanostack-design-system';
export const siteUrl = 'https://nanostack-dev.github.io/nanostack-design-system/';
export const packageUrl = 'https://www.npmjs.com/package/@nanostackorg/design-system';

const repositoryFiles = 'https://repository.invalid/';
const siteRoutes: Record<string, string> = {
  'README.md': './',
  'AGENTS.md': '?page=guidelines&tab=contract',
  'CLAUDE.md': '?page=guidelines&tab=contract',
  'docs/contributing.md': '?page=guidelines&tab=contributing',
  'DESIGN.md': '?page=guidelines&tab=design',
  'docs/components.md': '?page=guidelines&tab=reference',
  'CHANGELOG.md': '?page=changelog',
};

/** Returns each `## Title` section, heading included, in the requested order. */
export function extractSections(source: string, titles: readonly string[]) {
  const sections = source.split(/^(?=## )/m);
  return titles
    .map((title) => {
      const section = sections.find((part) => part.startsWith(`## ${title}\n`));
      if (!section) throw new Error(`The document has no "## ${title}" section.`);
      return section.trimEnd();
    })
    .join('\n\n');
}

function sectionBody(source: string, title: string) {
  return extractSections(source, [title])
    .replace(/^## .*\n/, '')
    .trim();
}

/**
 * Maps a link written for GitHub to its place on the site.
 * `../AGENTS.md#scope` in docs/contributing.md → `?page=guidelines&tab=contract#scope`;
 * `research.md` → the file on GitHub; `javascript:` → null, so it renders as plain text.
 */
export function resolveDocumentHref(documentPath: string, href: string): string | null {
  if (href.startsWith('#')) return href;
  if (href.startsWith(siteUrl)) return href.slice(siteUrl.length) || './';
  let url: URL;
  try {
    url = new URL(href, repositoryFiles + documentPath);
  } catch {
    return null;
  }
  if (url.href.startsWith(repositoryFiles)) {
    const path = decodeURIComponent(url.pathname.slice(1));
    return (siteRoutes[path] ?? `${repositoryUrl}/blob/main/${path}`) + url.hash;
  }
  return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null;
}

export const guidelineDocuments = [
  {
    id: 'contract',
    label: 'Scope and contract',
    description: 'What the library holds, what stays in a product, and the rules every part keeps.',
    document: { path: 'AGENTS.md', source: extractSections(agents, ['Scope', 'Public contract']) },
  },
  {
    id: 'contributing',
    label: 'Contributing',
    description: 'Choose the correct layer, follow the recipe, and prove the change.',
    document: { path: 'docs/contributing.md', source: contributing },
  },
  {
    id: 'design',
    label: 'Design decisions',
    description: 'The visual language: foundations, spacing, type and composition.',
    document: { path: 'DESIGN.md', source: design },
  },
  {
    id: 'reference',
    label: 'Component reference',
    description: 'Every part, its finite options and its composition rules.',
    document: { path: 'docs/components.md', source: componentReference },
  },
] as const satisfies readonly {
  id: string;
  label: string;
  description: string;
  document: MarkdownDocument;
}[];

export const changelogDocument: MarkdownDocument = { path: 'CHANGELOG.md', source: changelog };
export const scopeRule: MarkdownDocument = {
  path: 'AGENTS.md',
  source: sectionBody(agents, 'Scope'),
};
