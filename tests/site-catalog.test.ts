import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import * as UI from '../src/index.js';

function renderedTagNames() {
  const files = readdirSync('playground', { recursive: true })
    .filter((path): path is string => typeof path === 'string' && path.endsWith('.tsx'))
    .map((path) => resolve('playground', path));
  const names = new Set<string>();
  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    const visit = (node: ts.Node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName;
        names.add(ts.isPropertyAccessExpression(tag) ? tag.name.text : tag.getText(source));
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return names;
}

describe('documentation site catalog', () => {
  it('renders an example of every exported component', () => {
    const rendered = renderedTagNames();
    const components = Object.entries(UI)
      .filter(([name, value]) => /^[A-Z]/.test(name) && value !== undefined)
      .map(([name]) => name);
    expect(components.length).toBeGreaterThan(100);
    expect(components.filter((name) => !rendered.has(name))).toEqual([]);
  });
});
