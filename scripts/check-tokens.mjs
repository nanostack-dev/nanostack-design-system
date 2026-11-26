/**
 * Guards the token set of src/styles.css.
 *
 *   node scripts/check-tokens.mjs           check; exit 1 on a failure
 *   node scripts/check-tokens.mjs --write   record new tokens in tokens.lock.json
 *
 * Fails when:
 *   1. a `:root` token has no `.dark` value and is not in THEME_INDEPENDENT;
 *   2. a token in tokens.lock.json is gone from styles.css (a removal is a breaking change);
 *   3. a token is new and not yet in the lock (run with --write);
 *   4. a generated palette block sets a different token set from the default
 *      palette's, or a high-contrast block sets a token its base block does
 *      not (a partial block leaks another theme's colours).
 * The lock stores sorted names only, so a value change never touches it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readPaletteThemes, readThemes } from './lib/css-tokens.mjs';

const lockPath = 'tokens.lock.json';

// Tokens that may exist in `:root` only, because their value does not depend on the theme.
const THEME_INDEPENDENT = new Map([
  ['--radius', 'Corner size is geometry, not colour.'],
  [
    '--app-shell-header-offset',
    'A layout length that the app shell sets at runtime; no theme changes it.',
  ],
  ['--motion-duration-micro', 'Timing is the same in both themes (docs/technical/motion.md).'],
  ['--motion-duration-ui', 'Timing is the same in both themes.'],
  ['--motion-duration-modal', 'Timing is the same in both themes.'],
  ['--motion-duration-page', 'Timing is the same in both themes.'],
  ['--motion-duration-reduced', 'Timing is the same in both themes.'],
]);
// Font and easing tokens live in `@theme inline`, which this script does not read.

const write = process.argv.includes('--write');
const { light, dark } = readThemes();
const current = [...new Set([...light.keys(), ...dark.keys()])].sort();
const problems = [];

for (const name of light.keys()) {
  if (!dark.has(name) && !THEME_INDEPENDENT.has(name)) {
    problems.push(
      `${name} has a :root value but no .dark value. Add it to .dark, or add it to THEME_INDEPENDENT in scripts/check-tokens.mjs with a reason.`,
    );
  }
}
for (const name of THEME_INDEPENDENT.keys()) {
  if (!light.has(name)) {
    problems.push(`${name} is in THEME_INDEPENDENT but not in :root. Remove the stale entry.`);
  }
  if (dark.has(name)) {
    problems.push(`${name} is in THEME_INDEPENDENT but .dark sets it. Remove the entry.`);
  }
}

const paletteThemes = readPaletteThemes();
const reference = paletteThemes.find((theme) => theme.contrast === 'standard');
const referenceNames = [...reference.block.keys()].sort().join(' ');
for (const theme of paletteThemes) {
  const label = `${theme.palette} ${theme.mode} ${theme.contrast}`;
  const names = [...theme.block.keys()];
  if (theme.contrast === 'standard' && names.sort().join(' ') !== referenceNames) {
    problems.push(
      `The generated ${label} block sets a different token set from ${reference.palette} ${reference.mode}. Regenerate with scripts/generate-themes.mjs.`,
    );
  }
  if (theme.contrast === 'standard' && names.length === 0) {
    problems.push(`The generated ${label} block is missing.`);
  }
  const unknown = names.filter((name) => !reference.block.has(name));
  if (theme.contrast === 'high' && unknown.length) {
    problems.push(`The ${label} block sets tokens no base block sets: ${unknown.join(', ')}.`);
  }
}

// The theme block's palette list and the generator's inputs name the same themes.
const tsIds = [
  ...readFileSync('src/blocks/theme/palettes.ts', 'utf8').matchAll(/\bid: '([\w-]+)'/g),
].map((match) => match[1]);
const jsonIds = paletteThemes
  .filter((theme) => theme.mode === 'light' && theme.contrast === 'standard')
  .map((theme) => theme.palette);
if (tsIds.join(' ') !== jsonIds.join(' ')) {
  problems.push(
    `src/blocks/theme/palettes.ts lists ${tsIds.join(', ')} but palettes.json generates ${jsonIds.join(', ')}. Keep them in the same order.`,
  );
}

const locked = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, 'utf8')).tokens : [];
const removed = locked.filter((name) => !current.includes(name));
const added = current.filter((name) => !locked.includes(name));

if (removed.length) {
  problems.push(
    `Removed from styles.css: ${removed.join(', ')}. A token removal is a breaking change. Follow the deprecation path (keep an alias, record it in CHANGELOG), and run --write only for an intended removal that CHANGELOG records.`,
  );
}

if (write) {
  if (problems.some((problem) => !problem.startsWith('Removed from'))) {
    console.error(problems.filter((problem) => !problem.startsWith('Removed from')).join('\n'));
    process.exit(1);
  }
  writeFileSync(lockPath, `${JSON.stringify({ tokens: current }, null, 2)}\n`);
  console.log(
    `${lockPath}: ${current.length} tokens (${added.length} added, ${removed.length} removed)`,
  );
  process.exit(0);
}

if (added.length) {
  console.log(
    `New tokens: ${added.join(', ')}. Run \`node scripts/check-tokens.mjs --write\` and commit tokens.lock.json.`,
  );
  problems.push('tokens.lock.json is out of date.');
}

if (problems.length) {
  console.error(problems.map((problem) => `check-tokens: ${problem}`).join('\n'));
  process.exit(1);
}
console.log(`check-tokens: ${current.length} tokens, all themed or allowed, none removed`);
