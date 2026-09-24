import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { registryItemSchema } from 'shadcn/schema';

describe('source registry', () => {
  it('contains current canonical sources, with preserved module paths and styles', () => {
    const item = registryItemSchema.parse(JSON.parse(readFileSync('public/r/system.json', 'utf8')));
    expect(item.files?.some((file) => file.path === 'src/styles.css')).toBe(true);
    for (const file of item.files ?? []) {
      expect(file.content, file.path).toBe(readFileSync(file.path, 'utf8'));
      expect(file.target).toBe(`~/src/components/nanostack/${file.path.slice(4)}`);
    }
  });
});
