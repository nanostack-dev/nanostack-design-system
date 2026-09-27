import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('changelog', () => {
  it('gives every release after the initial beta an upgrade note', () => {
    const [, ...releases] = readFileSync('CHANGELOG.md', 'utf8').split('\n## ');
    const upgradable = releases.slice(0, -1);
    const missingUpgrade = upgradable
      .filter((release) => !/^Upgrade: /m.test(release))
      .map((release) => release.split('\n')[0]);
    expect(upgradable.length).toBeGreaterThan(0);
    expect(missingUpgrade).toEqual([]);
  });
});
