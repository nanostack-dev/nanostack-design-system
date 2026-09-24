import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import { Button, type ButtonProps } from '../src/components/button.js';
import { Surface, type SurfaceProps } from '../src/components/layout.js';

describe('presentation ownership', () => {
  it('strips styling aliases, slot bags and owned CSS attributes from untyped props', () => {
    const unsafe = {
      class: 'consumer-css',
      STYLE: 'display:none',
      styles: { root: { display: 'none' } },
      sx: { display: 'none' },
      tw: 'hidden',
      color: 'red',
      component: 'a',
      components: { root: 'a' },
      componentsProps: { root: { style: { display: 'none' } } },
      slots: { root: 'a' },
      slotProps: { root: { style: { display: 'none' } } },
      'data-size': '99px',
      'data-tone': 'warning',
      'data-disabled': '',
      'data-ns-theme': 'dark',
      'data-ns-custom-token': 'red',
    } as unknown as ButtonProps;

    render(
      <Button {...unsafe} variant="secondary" size="sm" data-testid="action" data-analytics="save">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toBe('ns-button');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-analytics', 'save');
    expect(screen.getByTestId('action')).toBe(button);
    for (const key of Object.keys(unsafe)) {
      if (key !== 'class' && key !== 'data-size') expect(button).not.toHaveAttribute(key);
    }
  });

  it('keeps an untyped host from selecting a nested theme through internal attributes', () => {
    const unsafe = {
      'data-ns-theme': 'dark',
      'DATA-NS-BRAND': 'anchor',
      'data-padding': 'none',
      style: { '--ns-accent': 'red' },
    } as unknown as SurfaceProps;
    render(<Surface {...unsafe} aria-label="Summary" padding="lg" />);
    const surface = screen.getByLabelText('Summary');
    expect(surface).toHaveAttribute('data-padding', 'lg');
    expect(surface).not.toHaveAttribute('data-ns-theme');
    expect(surface).not.toHaveAttribute('data-ns-brand');
    expect(surface).not.toHaveAttribute('style');
  });
});

describe('public module ownership', () => {
  it('covers every component subpath with the root entry point type contract', () => {
    const sourcePaths = readdirSync('src', { recursive: true })
      .filter((path): path is string => typeof path === 'string')
      .filter((path) => /^(components|blocks)\/.*\.tsx$/.test(path) || path === 'theme.tsx')
      .map((path) => resolve('src', path));
    const entryPath = resolve('src/index.ts');
    const program = ts.createProgram([entryPath, ...sourcePaths], {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      skipLibCheck: true,
    });
    const checker = program.getTypeChecker();
    const exportsAt = (path: string) => {
      const source = program.getSourceFile(path);
      if (!source) throw new Error(`Missing public source ${path}`);
      const module = checker.getSymbolAtLocation(source);
      if (!module) throw new Error(`Missing public module ${path}`);
      return checker.getExportsOfModule(module);
    };
    const declarationOf = (symbol: ts.Symbol) =>
      symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const rootExports = new Map(
      exportsAt(entryPath).map((symbol) => [symbol.name, declarationOf(symbol)]),
    );

    for (const path of sourcePaths) {
      for (const symbol of exportsAt(path)) {
        expect(rootExports.get(symbol.name), `${path}: ${symbol.name}`).toBe(declarationOf(symbol));
      }
    }
    for (const [name, symbol] of rootExports) {
      for (const declaration of symbol.declarations ?? []) {
        const path = declaration.getSourceFile().fileName;
        expect(
          path.startsWith(`${resolve('src')}/`),
          `Public export ${name} must be library-owned`,
        ).toBe(true);
        expect(path, `Internal helper ${name} must stay private`).not.toMatch(/\/internal\//);
      }
    }
  });

  it('keeps implementation helpers outside package export paths', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
      exports: Record<string, unknown>;
    };
    expect(Object.keys(manifest.exports)).not.toContain('./*');
    expect(JSON.stringify(manifest.exports)).not.toMatch(/internal/);
  });
});
