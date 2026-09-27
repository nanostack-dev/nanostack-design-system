// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

let checkout: string;

function registryScript(...args: string[]) {
  const result = spawnSync(process.execPath, ['scripts/build-registry.mjs', ...args], {
    cwd: checkout,
    encoding: 'utf8',
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

beforeEach(() => {
  checkout = mkdtempSync(join(tmpdir(), 'nanostack-registry-check-'));
  for (const path of ['package.json', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'src', 'scripts']) {
    cpSync(path, join(checkout, path), { recursive: true });
  }
  symlinkSync(resolve('node_modules'), join(checkout, 'node_modules'), 'dir');
  expect(registryScript().status).toBe(0);
});

afterEach(() => rmSync(checkout, { recursive: true, force: true }));

describe('registry check', { timeout: 20_000 }, () => {
  it('accepts output generated from the current source', () => {
    const { status, output } = registryScript('--check');
    expect(output).toContain('matches the source');
    expect(status).toBe(0);
  });

  it('names changed, added and removed source files', () => {
    appendFileSync(join(checkout, 'src/components/badge.tsx'), '\nexport const edited = true;\n');
    writeFileSync(join(checkout, 'src/components/added.tsx'), 'export const added = true;\n');
    rmSync(join(checkout, 'src/components/skeleton.tsx'));
    const { status, output } = registryScript('--check');
    expect(status).toBe(1);
    expect(output).toContain('Run `pnpm registry:build`');
    expect(output).toContain(
      'public/r/system.json: files[src/components/badge.tsx].content differs',
    );
    expect(output).toContain('public/r/system.json: files[src/components/added.tsx] missing');
    expect(output).toContain(
      'registry.json: items[system].files[src/components/added.tsx] missing',
    );
    expect(output).toContain('public/r/system.json: files[src/components/skeleton.tsx] unexpected');
  });

  it('names missing and extra output files, and a rebuild removes stale ones', () => {
    rmSync(join(checkout, 'registry.json'));
    writeFileSync(join(checkout, 'public/r/stale.json'), '{}\n');
    const { status, output } = registryScript('--check');
    expect(status).toBe(1);
    expect(output).toContain('registry.json: missing file');
    expect(output).toContain('public/r/stale.json: unexpected file');

    expect(registryScript().status).toBe(0);
    expect(registryScript('--check').status).toBe(0);
  });

  it('names dependency drift', () => {
    const manifestPath = join(checkout, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.dependencies.sonner = '^9.0.0';
    writeFileSync(manifestPath, JSON.stringify(manifest));
    const { status, output } = registryScript('--check');
    expect(status).toBe(1);
    expect(output).toContain('public/r/system.json: dependencies["sonner@^9.0.0"] missing');
  });
});
