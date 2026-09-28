import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import manifest from './package.json' with { type: 'json' };

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));

function publicEntries(folder: 'components' | 'blocks') {
  const directory = `${sourceRoot}/${folder}`;
  if (!existsSync(directory)) return {};
  return Object.fromEntries(
    readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== 'ui')
      .map((entry) => [`${folder}/${entry.name}/index`, `${directory}/${entry.name}/index.ts`]),
  );
}

const externalPackages = [
  ...Object.keys(manifest.dependencies),
  ...Object.keys(manifest.peerDependencies),
];

function isExternal(id: string) {
  return externalPackages.some((name) => id === name || id.startsWith(`${name}/`));
}

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': sourceRoot } },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    lib: {
      formats: ['es'],
      entry: {
        index: `${sourceRoot}/index.ts`,
        'lib/utils': `${sourceRoot}/lib/utils.ts`,
        ...publicEntries('components'),
        ...publicEntries('blocks'),
      },
    },
    rollupOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
