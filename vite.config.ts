import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import manifest from './package.json' with { type: 'json' };

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));

// Vite discovers deep entries such as @base-ui/react/menu lazily, then reloads the
// page mid-test. Listing every runtime import that the sources use up front stops it.
function runtimeImports() {
  const packages = Object.keys(manifest.dependencies);
  const specifiers = new Set<string>();
  for (const file of readdirSync(sourceRoot, { recursive: true, encoding: 'utf8' })) {
    if (!/\.tsx?$/.test(file)) continue;
    const source = readFileSync(`${sourceRoot}/${file}`, 'utf8');
    for (const [, specifier] of source.matchAll(/from ['"]([^'".][^'"]*)['"]/g)) {
      if (packages.some((name) => specifier === name || specifier.startsWith(`${name}/`))) {
        specifiers.add(specifier);
      }
    }
  }
  return [...specifiers].sort();
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': sourceRoot } },
  optimizeDeps: { include: runtimeImports() },
});
