import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { registrySchema, registryItemSchema } from 'shadcn/schema';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const sourceRoot = new URL('src/', root);
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const sourcePaths = (await readdir(sourceRoot, { recursive: true }))
  .filter((path) => /\.(tsx?|css)$/.test(path) && !path.startsWith('adapters/'))
  .sort();
const files = await Promise.all(
  sourcePaths.map(async (path) => ({
    path: `src/${path}`,
    type: 'registry:file',
    target: `~/src/components/nanostack/${path}`,
    content: await readFile(new URL(path, sourceRoot), 'utf8'),
  })),
);
files.push({
  path: 'THIRD_PARTY_NOTICES.md',
  type: 'registry:file',
  target: '~/src/components/nanostack/THIRD_PARTY_NOTICES.md',
  content: await readFile(new URL('THIRD_PARTY_NOTICES.md', root), 'utf8'),
});
const item = registryItemSchema.parse({
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'system',
  type: 'registry:block',
  title: 'Nanostack design system',
  description:
    'Composable React blocks with finite variants and no consumer CSS overrides. Requires React 19.2+.',
  dependencies: Object.entries(packageJson.dependencies).map(
    ([name, version]) => `${name}@${version}`,
  ),
  files,
  docs: 'Import src/components/nanostack/styles.css once; wrap your composition in Theme. All public APIs forbid custom CSS. Keep modifications in the library; regenerate the registry from source.',
});
const { files: itemFiles, ...metadata } = item;
const manifest = registrySchema.parse({
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'nanostack-design-system',
  homepage: 'https://github.com/nanostack-dev/nanostack-design-system',
  items: [
    {
      ...metadata,
      files: itemFiles.map(({ content, ...file }) => {
        void content;
        return file;
      }),
    },
  ],
});
await mkdir(new URL('public/r/', root), { recursive: true });
await writeFile(new URL('registry.json', root), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(new URL('public/r/system.json', root), `${JSON.stringify(item, null, 2)}\n`);
console.log(
  `Built and schema-validated system registry (${files.length} source files) in ${fileURLToPath(new URL('public/r/', root))}`,
);
