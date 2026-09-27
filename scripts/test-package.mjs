import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
const scratch = await mkdtemp(join(tmpdir(), 'nanostack-package-consumer-'));

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

try {
  // Build before calling this script. Packing with scripts disabled proves that the
  // published package needs neither a prepare hook nor the source checkout.
  const packResult = JSON.parse(
    run(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch],
      projectRoot,
      true,
    ),
  );
  const packed = packResult[0];
  assert(packed?.filename, 'npm pack did not produce an archive');
  const paths = packed.files.map((file) => file.path);
  for (const required of [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/styles.css',
    'dist/theme.js',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
  ]) {
    assert(
      paths.includes(required),
      `Packed artifact is missing ${required}; run pnpm build first`,
    );
  }
  assert(
    !paths.some((path) => /^(src|tests|playground|node_modules|\.ui-craft)\//.test(path)),
    'The artifact includes source, tests, dependencies or screenshots',
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
          react: '19.2.0',
          'react-dom': '19.2.0',
          '@base-ui/react': manifest.dependencies['@base-ui/react'],
          '@phosphor-icons/react': manifest.peerDependencies['@phosphor-icons/react'],
        },
        devDependencies: {
          vite: manifest.devDependencies.vite,
          typescript: manifest.devDependencies.typescript,
          '@types/react': '19.2.14',
          '@types/react-dom': '19.2.3',
        },
      },
      null,
      2,
    ),
  );

  // npm reuses its download cache across runs; this consumer is intentionally new
  // each time so workspace node_modules, symlinks and source aliases cannot help it.
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--package-lock=false',
      '--prefer-offline',
    ],
    scratch,
  );

  await writeFile(
    join(scratch, 'smoke.mjs'),
    `
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement as h, version } from 'react';
import { renderToString } from 'react-dom/server';
import * as library from '@nanostackorg/design-system';
import { GearIcon } from '@phosphor-icons/react';

assert.equal(version, '19.2.0', 'The consumer must exercise the minimum React peer version');
const packageRoot = fileURLToPath(new URL('../', import.meta.resolve('@nanostackorg/design-system')));
assert(!existsSync(join(packageRoot, 'src')), 'Source must not be available to the consumer');
const packedManifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
assert.deepEqual(packedManifest.sideEffects, ['**/*.css'], 'Bundlers must preserve imported CSS');
assert(packedManifest.peerDependencies['@phosphor-icons/react'] && !packedManifest.dependencies['@phosphor-icons/react'], 'Icon glyphs are public props, so Phosphor must be a peer');
assert.equal(
  createRequire(join(packageRoot, 'dist', 'index.js')).resolve('@phosphor-icons/react'),
  createRequire(import.meta.url).resolve('@phosphor-icons/react'),
  'The library and the consumer must share one Phosphor copy',
);
const cssPath = fileURLToPath(import.meta.resolve('@nanostackorg/design-system/styles.css'));
assert(readFileSync(cssPath, 'utf8').includes('.ns-theme'), 'The stylesheet export must contain compiled visual rules');

for (const folder of ['components', 'blocks']) {
  for (const file of readdirSync(join(packageRoot, 'dist', folder)).filter((file) => file.endsWith('.js'))) {
    const name = file.slice(0, -3);
    assert(existsSync(join(packageRoot, 'dist', folder, name + '.d.ts')), 'Missing declarations for ' + folder + '/' + name);
    const part = await import('@nanostackorg/design-system/' + folder + '/' + name);
    for (const [key, value] of Object.entries(part)) assert.equal(library[key], value, key + ' differs between barrel and subpath exports');
  }
}
const theme = await import('@nanostackorg/design-system/theme');
assert.equal(theme.Theme, library.Theme);
for (const path of ['theme.js', 'components/button.js', 'components/input.js', 'components/field.js', 'components/tabs.js', 'components/dialog.js', 'blocks/app-shell.js', 'blocks/graph-node.js', 'blocks/node-presentation.js', 'components/motion-preference.js']) {
  assert(/^['"]use client['"];/.test(readFileSync(join(packageRoot, 'dist', path), 'utf8')), path + ' lost its React client boundary');
}

const output = renderToString(h(library.Theme, { brand: 'anchor' },
  h(library.Stack, null,
    h(library.Heading, { level: 1 }, 'Artifact consumer'),
    h(library.Button, { variant: 'secondary' }, 'Tested button'),
    h(library.Field, null, h(library.FieldLabel, null, 'Name'), h(library.Input, { name: 'name' })),
    h(library.Metric, { label: 'Requests', value: '42' }),
    h(library.Icon, { glyph: GearIcon, label: 'Consumer glyph' }),
    h(library.AppShell, null,
      h(library.AppShellSidebar, null, h(library.AppShellNav, { label: 'Workspace' }, h(library.AppShellNavLink, { href: '/', active: true }, 'Home'))),
      h(library.AppShellHeader, null, 'Workspace'),
      h(library.AppShellMain, null, 'Consumer content')))));
assert(output.includes('Tested button') && output.includes('Consumer content'), 'SSR did not render composed public components');
assert(/aria-label="Consumer glyph"[^>]*><svg/.test(output), 'SSR did not render a consumer-supplied glyph');
assert(output.includes('ns-button') && output.includes('data-ns-brand="anchor"'), 'SSR lost owned style hooks');
const graphOutput = renderToString(h(library.Theme, null,
  h(library.GraphNodeFrame, { family: 'logic', phase: 'running' },
    h(library.GraphNodeBody, null, 'Server-rendered node'),
    h(library.NodeTelemetry, { phase: 'running' }, 'Live annotation')),
  h(library.NodeElapsedTime, { elapsedMs: 1000, format: value => String(value) })));
assert(graphOutput.includes('Server-rendered node'), 'SSR lost graph content');
assert(!graphOutput.includes('Live annotation'), 'A portal must wait for its browser host');

console.log('Packed ESM exports, stylesheet, declarations, client boundaries and React ' + version + ' SSR passed.');
`,
  );
  run(process.execPath, ['smoke.mjs'], scratch);

  await writeFile(
    join(scratch, 'consumer.tsx'),
    `
import { createRef } from 'react';
import { GearIcon } from '@phosphor-icons/react';
import { Theme, Button, Icon, Input, AppShell, AppShellMain, Grid } from '@nanostackorg/design-system';
import { Button as SubpathButton } from '@nanostackorg/design-system/components/button';
import { Metric } from '@nanostackorg/design-system/blocks/metric';
import { Theme as SubpathTheme } from '@nanostackorg/design-system/theme';
const ref = createRef<HTMLButtonElement>();
export const valid = <Theme><AppShell><AppShellMain><Grid layout="sidebar"><Button ref={ref} variant="ghost" type="submit">Save</Button><Input required autoComplete="email" /></Grid><Metric label="Requests" value={42} /><SubpathButton>Subpath</SubpathButton><SubpathTheme /><Icon glyph={GearIcon} label="Settings" /></AppShellMain></AppShell></Theme>;
// @ts-expect-error Icon glyphs are Phosphor components, not names.
export const invalidGlyph = <Icon glyph="gear" />;
// @ts-expect-error Built declarations preserve the closed CSS contract.
export const invalidStyle = <Button style={{ color: 'red' }} />;
// @ts-expect-error Built declarations preserve finite variants.
export const invalidVariant = <Button variant="custom" />;
const escaped = { className: 'custom' };
// @ts-expect-error Spread objects must not reopen CSS customization.
export const invalidSpread = <Button {...escaped} />;
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
        exactOptionalPropertyTypes: true,
        noEmit: true,
        skipLibCheck: false,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      },
      include: ['consumer.tsx'],
    }),
  );
  run(process.execPath, ['node_modules/typescript/bin/tsc'], scratch);

  await writeFile(
    join(scratch, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Package consumer</title></head><body><div id="root"></div><script type="module" src="/main.mjs"></script></body></html>',
  );
  await writeFile(
    join(scratch, 'main.mjs'),
    `
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { GearIcon } from '@phosphor-icons/react';
import { Theme, Button, Stack, Heading, Icon } from '@nanostackorg/design-system';
import '@nanostackorg/design-system/styles.css';
createRoot(document.getElementById('root')).render(h(Theme, null, h(Stack, null, h(Heading, { level: 1 }, 'Package consumer'), h(Icon, { glyph: GearIcon, label: 'Settings' }), h(Button, null, 'Ready'))));
`,
  );
  // This is a browser-only consumer, so Rollup legitimately removes client
  // directives. Their preservation in the published ESM was asserted above.
  await writeFile(
    join(scratch, 'vite.config.mjs'),
    `export default { build: { rollupOptions: { onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
    warn(warning);
  } } } };`,
  );
  run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], scratch);
  console.log('Clean consumer typecheck and production CSS/JavaScript bundle passed.');
} finally {
  await rm(scratch, { recursive: true, force: true });
}
