import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
const scratch = await mkdtemp(join(tmpdir(), 'nanostack-package-consumer-'));
const minimumReact = '19.2.0';

function run(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    env: { ...process.env, npm_config_update_notifier: 'false' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status})\n${result.stdout ?? ''}\n${result.stderr ?? ''}`,
    );
  }
  return result.stdout;
}

const componentNames = (await readdir(join(projectRoot, 'src/components'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name !== 'ui')
  .map((entry) => entry.name);
const blockNames = (await readdir(join(projectRoot, 'src/blocks'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const publicSubpaths = [
  ...componentNames.map((name) => `components/${name}`),
  ...blockNames.map((name) => `blocks/${name}`),
  'utils',
];

try {
  // Build before calling this script. Packing with scripts disabled proves that the
  // published package needs neither a prepare hook nor the source checkout.
  const [packed] = JSON.parse(
    run(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch],
      projectRoot,
      true,
    ),
  );
  assert(packed?.filename, 'npm pack did not produce an archive');
  const digest = createHash('sha256')
    .update(await readFile(join(scratch, packed.filename)))
    .digest('hex');
  console.log(`SHA-256 ${digest}  ${packed.filename}`);

  const paths = packed.files.map((file) => file.path);
  for (const required of [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/styles.css',
    'dist/lib/utils.js',
    ...publicSubpaths
      .filter((subpath) => subpath !== 'utils')
      .flatMap((subpath) => [`dist/${subpath}/index.js`, `dist/${subpath}/index.d.ts`]),
    'README.md',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
  ]) {
    assert(
      paths.includes(required),
      `Packed artifact is missing ${required}; run pnpm build first`,
    );
  }
  assert(
    !paths.some((path) => /^(src|\.storybook|\.claude|site|node_modules|\.ui-craft)\//.test(path)),
    'The artifact includes source, Storybook, agent files, dependencies or screenshots',
  );
  assert(
    !paths.some((path) => /\.stories\.|\.test\./.test(path)),
    'The artifact includes stories or tests',
  );

  await writeFile(
    join(scratch, 'package.json'),
    JSON.stringify(
      {
        name: 'nanostack-artifact-consumer',
        private: true,
        type: 'module',
        dependencies: {
          [manifest.name]: `file:./${packed.filename}`,
          react: minimumReact,
          'react-dom': minimumReact,
          tailwindcss: manifest.devDependencies.tailwindcss,
        },
        devDependencies: {
          '@tailwindcss/vite': manifest.devDependencies['@tailwindcss/vite'],
          vite: manifest.devDependencies.vite,
          typescript: manifest.devDependencies.typescript,
          '@types/react': manifest.devDependencies['@types/react'],
          '@types/react-dom': manifest.devDependencies['@types/react-dom'],
        },
      },
      null,
      2,
    ),
  );
  // A new consumer each run, so workspace node_modules, symlinks and source aliases cannot help it.
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'],
    scratch,
  );

  await writeFile(
    join(scratch, 'smoke.mjs'),
    `
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement as h, version } from 'react';
import { renderToString } from 'react-dom/server';
import * as library from '@nanostackorg/design-system';

const publicSubpaths = ${JSON.stringify(publicSubpaths)};
assert.equal(version, '${minimumReact}', 'The consumer must exercise the minimum React peer version');
const packageRoot = fileURLToPath(new URL('../', import.meta.resolve('@nanostackorg/design-system')));
assert(!existsSync(join(packageRoot, 'src')), 'Source must not be available to the consumer');

const packedManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
assert.deepEqual(packedManifest.sideEffects, ['**/*.css'], 'Bundlers must preserve imported CSS');
for (const peer of ['react', 'react-dom', 'tailwindcss']) {
  assert(packedManifest.peerDependencies[peer], peer + ' must be a peer dependency');
}
for (const [subpath, target] of Object.entries(packedManifest.exports)) {
  if (target === null || typeof target === 'string') continue;
  const conditions = Object.keys(target);
  assert.equal(conditions[0], 'types', subpath + ' must resolve declarations first');
  assert.equal(conditions.at(-1), 'default', subpath + ' needs a default condition');
}

for (const subpath of publicSubpaths) {
  const part = await import('@nanostackorg/design-system/' + subpath);
  assert(Object.keys(part).length > 0, subpath + ' exports nothing');
  if (subpath === 'utils') continue;
  for (const [key, value] of Object.entries(part)) {
    assert.equal(library[key], value, key + ' from ' + subpath + ' is missing or different in the root barrel');
  }
}

for (const hidden of ['components/ui/button', 'components/ui/dialog', 'dist/components/ui/button.js']) {
  await assert.rejects(
    import('@nanostackorg/design-system/' + hidden),
    { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' },
    hidden + ' must not be importable: raw shadcn components are private',
  );
}

const distRoot = join(packageRoot, 'dist');
const distFiles = readdirSync(distRoot, { recursive: true });
assert(!distFiles.some((file) => /stories/.test(file)), 'Stories must not be built into dist');
for (const file of distFiles.filter((file) => file.endsWith('.js') || file.endsWith('.d.ts'))) {
  const content = readFileSync(join(distRoot, file), 'utf8');
  assert(!/from ['"]@\\//.test(content), file + ' still imports the @/ source alias');
  const marker = '//# sourceMappingURL=';
  if (content.includes(marker)) {
    assert(existsSync(join(distRoot, dirname(file), content.split(marker).at(-1).trim())), file + ' references a missing source map');
  }
}

const css = readFileSync(fileURLToPath(import.meta.resolve('@nanostackorg/design-system/styles.css')), 'utf8');
for (const token of ['--background:', '--primary:', '--success-foreground:', '--warning-on-tint:', '--sidebar-ring:', '--chart-5:', '--radius:', '@theme inline', '.dark {', '@custom-variant data-open']) {
  assert(css.includes(token), 'The stylesheet is missing ' + token);
}
assert(!/@import ["']shadcn\\/tailwind\\.css/.test(css), 'The stylesheet must inline shadcn/tailwind.css');
assert(!/@import ["']tailwindcss["']/.test(css), 'The consumer imports Tailwind, not the library stylesheet');

assert.equal(library.cn('px-2 text-sm', 'px-4'), 'text-sm px-4', 'cn must merge Tailwind classes');
const output = renderToString(
  h(library.TooltipProvider, null,
    h('main', null,
      h(library.Button, { variant: 'outline' }, 'Tested button'),
      h(library.Badge, { variant: 'success' }, 'Healthy'),
      h(library.Card, null, h(library.CardHeader, null, h(library.CardTitle, null, 'Card title'))),
      h(library.Field, null, h(library.FieldLabel, { htmlFor: 'name' }, 'Name'), h(library.Input, { id: 'name' })))));
for (const text of ['Tested button', 'Healthy', 'Card title', 'Name']) {
  assert(output.includes(text), 'SSR did not render ' + text);
}
assert(output.includes('text-success-on-tint'), 'SSR lost the library status variant');
console.log('Packed exports, private ui/, stylesheet, declarations and React ' + version + ' SSR passed.');
`,
  );
  run(process.execPath, ['smoke.mjs'], scratch);

  await writeFile(
    join(scratch, 'consumer.tsx'),
    `
import { createRef } from 'react';
import { Badge, Button, Card, CardContent, cn } from '@nanostackorg/design-system';
import { Button as SubpathButton } from '@nanostackorg/design-system/components/button';
import { cn as subpathCn } from '@nanostackorg/design-system/utils';
const ref = createRef<HTMLButtonElement>();
export const valid = (
  <Card className={cn('w-full', subpathCn('max-w-sm'))}>
    <CardContent>
      <Button ref={ref} variant="ghost" size="sm" type="submit">Save</Button>
      <SubpathButton variant="destructive">Delete</SubpathButton>
      <Badge variant="warning">Degraded</Badge>
    </CardContent>
  </Card>
);
// @ts-expect-error Variants are closed unions.
export const invalidVariant = <Button variant="custom" />;
// @ts-expect-error Badge status variants are closed unions too.
export const invalidBadge = <Badge variant="danger" />;
`,
  );
  await writeFile(
    join(scratch, 'private-ui.ts'),
    `// @ts-expect-error Raw shadcn components are not part of the package exports.
import '@nanostackorg/design-system/components/ui/button';
`,
  );
  await writeFile(
    join(scratch, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      },
      include: ['consumer.tsx', 'private-ui.ts'],
    }),
  );
  run(process.execPath, ['node_modules/typescript/bin/tsc'], scratch);
  console.log(
    'Consumer typecheck passed: closed variants and private ui/ hold in the declarations.',
  );

  await mkdir(join(scratch, 'src'));
  await writeFile(
    join(scratch, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Package consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
  );
  await writeFile(
    join(scratch, 'src/index.css'),
    `@import "tailwindcss";
@import "@nanostackorg/design-system/styles.css";
@source "../node_modules/@nanostackorg/design-system/dist";
`,
  );
  await writeFile(
    join(scratch, 'src/main.tsx'),
    `import { createRoot } from 'react-dom/client';
import { Button } from '@nanostackorg/design-system';
import './index.css';
createRoot(document.getElementById('root')!).render(<Button>Ready</Button>);
`,
  );
  await writeFile(
    join(scratch, 'vite.config.mjs'),
    `import tailwindcss from '@tailwindcss/vite';
export default { plugins: [tailwindcss()], build: { rollupOptions: { onwarn(warning, warn) {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
  warn(warning);
} } } };
`,
  );
  run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], scratch);
  const assets = await readdir(join(scratch, 'dist/assets'));
  const builtCss = await readFile(
    join(
      scratch,
      'dist/assets',
      assets.find((file) => file.endsWith('.css')),
    ),
    'utf8',
  );
  for (const utility of [
    '.bg-primary',
    '.text-primary-foreground',
    '.text-success-on-tint',
    '.rounded-4xl',
    '.bg-sidebar',
  ]) {
    assert(
      builtCss.includes(utility),
      `The consumer build did not generate ${utility} from the package @source`,
    );
  }
  assert(builtCss.includes('--primary:'), 'The consumer build lost the design tokens');
  console.log('Consumer Tailwind v4 build generated the package utilities and tokens.');
} finally {
  await rm(scratch, { recursive: true, force: true });
}
