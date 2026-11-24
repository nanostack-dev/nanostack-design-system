/**
 * Guards the token set of src/styles.css.
 *
 *   node scripts/check-tokens.mjs           check; exit 1 on a failure
 *   node scripts/check-tokens.mjs --write   record new tokens in tokens.lock.json
 *
 * Fails when:
 *   1. a `:root` token has no `.dark` value and is not in THEME_INDEPENDENT;
 *   2. a token in tokens.lock.json is gone from styles.css (a removal is a breaking change);
 *   3. a token is new and not yet in the lock (run with --write).
 * The lock stores sorted names only, so a value change never touches it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readThemes } from './lib/css-tokens.mjs';

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
