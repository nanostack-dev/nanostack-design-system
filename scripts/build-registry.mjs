import { readFile, readdir, mkdir, rm, writeFile } from 'node:fs/promises';
import { registrySchema, registryItemSchema } from 'shadcn/schema';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const sourceRoot = new URL('src/', root);
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const hostProvidedPeers = new Set(['react', 'react-dom']);
const requiredPeers = Object.entries(packageJson.peerDependencies).filter(
  ([name]) => !hostProvidedPeers.has(name) && !packageJson.peerDependenciesMeta?.[name]?.optional,
);
const sourceDependencies = [...Object.entries(packageJson.dependencies), ...requiredPeers].sort(
  ([left], [right]) => (left < right ? -1 : 1),
);
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
for (const path of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  files.push({
    path,
    type: 'registry:file',
    target: `~/src/components/nanostack/${path}`,
    content: await readFile(new URL(path, root), 'utf8'),
  });
}
const item = registryItemSchema.parse({
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'system',
  type: 'registry:block',
  title: 'Nanostack design system',
  description:
    'Composable React blocks with finite variants and no consumer CSS overrides. Requires React 19.2+.',
  dependencies: sourceDependencies.map(([name, version]) => `${name}@${version}`),
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
const outputDirectory = 'public/r/';
const outputs = new Map([
  ['registry.json', `${JSON.stringify(manifest, null, 2)}\n`],
  [`${outputDirectory}system.json`, `${JSON.stringify(item, null, 2)}\n`],
]);

async function readCommittedOutputs() {
  const committed = new Map();
  const publishedPaths = await readdir(new URL(outputDirectory, root), {
    recursive: true,
    withFileTypes: true,
  }).catch(() => []);
  const paths = [
    'registry.json',
    ...publishedPaths
      .filter((entry) => entry.isFile())
      .map((entry) =>
        relative(fileURLToPath(root), join(entry.parentPath, entry.name)).split(sep).join('/'),
      ),
  ];
  for (const path of paths) {
    const content = await readFile(new URL(path, root), 'utf8').catch(() => undefined);
    if (content !== undefined) committed.set(path, content);
  }
  return committed;
}

function parseJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
}

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

function identityKey(values) {
  return ['path', 'name'].find((key) =>
    values.every((value) => isRecord(value) && typeof value[key] === 'string'),
  );
}

/**
 * Names what separates generated JSON from the committed copy.
 * Example: expected `{ files: [{ path: 'src/a.tsx', content: 'x' }, { path: 'src/b.tsx' }] }`
 * against committed `{ files: [{ path: 'src/a.tsx', content: 'y' }, { path: 'src/c.tsx' }] }`
 * matches file entries by `path` and yields
 * `files[src/b.tsx] missing`, `files[src/c.tsx] unexpected`, `files[src/a.tsx].content differs`.
 */
function describeDifferences(expected, committed, location) {
  if (JSON.stringify(expected) === JSON.stringify(committed)) return [];
  if (Array.isArray(expected) && Array.isArray(committed)) {
    const key = identityKey([...expected, ...committed]);
    const identify = key ? (value) => value[key] : (value) => JSON.stringify(value);
    const committedById = new Map(committed.map((value) => [identify(value), value]));
    const expectedIds = new Set(expected.map(identify));
    const differences = [
      ...expected
        .filter((value) => !committedById.has(identify(value)))
        .map((value) => `${location}[${identify(value)}] missing`),
      ...committed
        .filter((value) => !expectedIds.has(identify(value)))
        .map((value) => `${location}[${identify(value)}] unexpected`),
      ...(key
        ? expected
            .filter((value) => committedById.has(identify(value)))
            .flatMap((value) =>
              describeDifferences(
                value,
                committedById.get(identify(value)),
                `${location}[${identify(value)}]`,
              ),
            )
        : []),
    ];
    return differences.length > 0 ? differences : [`${location} order differs`];
  }
  if (isRecord(expected) && isRecord(committed)) {
    const keys = [...new Set([...Object.keys(expected), ...Object.keys(committed)])];
    const differences = keys.flatMap((key) =>
      describeDifferences(expected[key], committed[key], location ? `${location}.${key}` : key),
    );
    return differences.length > 0 ? differences : [`${location || 'object'} key order differs`];
  }
  return [`${location || 'value'} differs`];
}

async function findStaleOutputs() {
  const committed = await readCommittedOutputs();
  const problems = [];
  for (const [path, content] of outputs) {
    const committedContent = committed.get(path);
    if (committedContent === undefined) problems.push(`${path}: missing file`);
    else if (committedContent !== content) {
      const committedJson = parseJson(committedContent);
      const differences =
        committedJson === undefined
          ? ['invalid JSON']
          : describeDifferences(JSON.parse(content), committedJson, '');
      problems.push(
        ...(differences.length > 0 ? differences : ['formatting differs']).map(
          (difference) => `${path}: ${difference}`,
        ),
      );
    }
  }
  for (const path of committed.keys()) {
    if (!outputs.has(path)) problems.push(`${path}: unexpected file`);
  }
  return problems;
}

if (process.argv.includes('--check')) {
  const problems = await findStaleOutputs();
  if (problems.length > 0) {
    const shown = problems.slice(0, 40);
    console.error(
      [
        'The committed registry differs from the source. Run `pnpm registry:build` and commit the result.',
        ...shown.map((problem) => `  ${problem}`),
        ...(problems.length > shown.length
          ? [`  and ${problems.length - shown.length} more differences`]
          : []),
      ].join('\n'),
    );
    process.exit(1);
  }
  console.log(`Committed registry matches the source (${files.length} source files).`);
} else {
  await rm(new URL(outputDirectory, root), { recursive: true, force: true });
  await mkdir(new URL(outputDirectory, root), { recursive: true });
  for (const [path, content] of outputs) await writeFile(new URL(path, root), content);
  console.log(
    `Built and schema-validated system registry (${files.length} source files) in ${fileURLToPath(new URL(outputDirectory, root))}`,
  );
}
