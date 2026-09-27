// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve('scripts/release-identity.mjs');
const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, unknown>;
let directory: string;

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'ns-release-'));
});
afterEach(() => rmSync(directory, { recursive: true, force: true }));

function checkRelease(version: string, tag = `v${version}`, overrides = {}) {
  writeFileSync(
    join(directory, 'package.json'),
    JSON.stringify({ ...manifest, version, ...overrides }),
  );
  const output = join(directory, 'github-output');
  writeFileSync(output, '');
  const result = spawnSync(process.execPath, [script], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...process.env, GITHUB_REF_NAME: tag, GITHUB_OUTPUT: output },
  });
  return { status: result.status, stderr: result.stderr, outputs: readFileSync(output, 'utf8') };
}

describe('release identity', () => {
  it('publishes the committed manifest version', () => {
    expect(checkRelease(manifest.version as string).status).toBe(0);
  });

  it('publishes a stable version under latest as a full GitHub release', () => {
    const release = checkRelease('0.0.1');
    expect(release.status).toBe(0);
    expect(release.outputs).toBe('version=0.0.1\ndist_tag=latest\nprerelease=false\n');
  });

  it('publishes a beta under the beta tag as a GitHub prerelease', () => {
    const release = checkRelease('1.2.0-beta.3');
    expect(release.status).toBe(0);
    expect(release.outputs).toBe('version=1.2.0-beta.3\ndist_tag=beta\nprerelease=true\n');
  });

  it.each(['0.0.1-rc.1', '1.0', '01.0.0', '1.0.0-beta', '1.0.0-beta.01', '1.0.0+build.1'])(
    'refuses the unsupported version %s',
    (version) => {
      const release = checkRelease(version);
      expect(release.status).not.toBe(0);
      expect(release.outputs).toBe('');
    },
  );

  it('refuses a tag that differs from the manifest version', () => {
    const release = checkRelease('0.0.2', 'v0.0.1');
    expect(release.status).not.toBe(0);
    expect(release.outputs).toBe('');
  });

  it('refuses a manifest that pins its own npm tag', () => {
    const release = checkRelease('0.0.1', 'v0.0.1', {
      publishConfig: { access: 'public', tag: 'beta' },
    });
    expect(release.status).not.toBe(0);
    expect(release.stderr).toMatch(/release workflow chooses the npm tag/);
  });
});
