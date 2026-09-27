import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { registryItemSchema } from 'shadcn/schema';

describe('source registry', () => {
  it('contains current canonical sources, with preserved module paths and styles', () => {
    const item = registryItemSchema.parse(JSON.parse(readFileSync('public/r/system.json', 'utf8')));
    expect(item.files?.some((file) => file.path === 'src/styles.css')).toBe(true);
    // The optional Clerk peer must not become mandatory for source consumers.
    expect(item.files?.some((file) => file.path.startsWith('src/adapters/'))).toBe(false);
    expect(item.dependencies?.some((dependency) => dependency.startsWith('@clerk/'))).toBe(false);
    expect(item.files?.some((file) => file.path === 'THIRD_PARTY_NOTICES.md')).toBe(true);
    expect(item.files?.some((file) => file.path === 'LICENSE')).toBe(true);
    for (const file of item.files ?? []) {
      expect(file.content, file.path).toBe(readFileSync(file.path, 'utf8'));
      const target = file.path.startsWith('src/') ? file.path.slice(4) : file.path;
      expect(file.target).toBe(`~/src/components/nanostack/${target}`);
    }
  });
});
