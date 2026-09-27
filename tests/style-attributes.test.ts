import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { safeProps } from '../src/internal/props.js';

const stylesheets = [
  'src/styles.css',
  ...readdirSync('src/styles', { recursive: true, encoding: 'utf8' })
    .filter((path) => path.endsWith('.css'))
    .map((path) => `src/styles/${path}`),
];

describe('stylesheet attribute selectors', () => {
  it('only select data attributes that consumers cannot forward', () => {
    const selected = new Set(
      stylesheets.flatMap((path) =>
        [...readFileSync(path, 'utf8').matchAll(/\[\s*(data-[\w-]+)/g)].map(([, name]) => name!),
      ),
    );
    const forwarded = [...selected].filter((name) => name in safeProps({ [name]: '' }));
    expect(selected).toContain('data-tone');
    expect(selected).toContain('data-ns-brand');
    expect(forwarded).toEqual([]);
  });
});
