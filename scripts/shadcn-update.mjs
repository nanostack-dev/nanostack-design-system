/**
 * Pulls a new shadcn CLI version of owned components and merges it three ways.
 *
 *   pnpm shadcn:update --check        list components whose upstream changed
 *   pnpm shadcn:update button dialog  merge the upstream change into the owned files
 *   pnpm shadcn:update --add kbd      start owning a new component from the CLI output
 *
 * Example, `pnpm shadcn:update dialog` when upstream dropped its "use client" line:
 *   base   upstream/ui/dialog.tsx               the CLI output we started from
 *   theirs shadcn add dialog --dry-run --view   the CLI output today
 *   ours   src/components/dialog/dialog.tsx      our edited file
 *   git merge-file ours base theirs  ->  ours loses "use client", keeps our variants
 *   upstream/ui/dialog.tsx and upstream/lock.json then record the new base.
 * A conflict leaves <<<<<<< markers in the owned file and exits with code 1.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const lockPath = 'upstream/lock.json';
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const addNew = args.includes('--add');
const requested = args.filter((arg) => !arg.startsWith('--'));
const names = requested.length
  ? requested
  : Object.keys(lock.files)
      .filter((file) => file.endsWith('.tsx'))
      .map((file) => file.replace(/\.tsx$/, ''));

function sha(text) {
  return createHash('sha256').update(text).digest('hex');
}

function fetchUpstream(name) {
  const cliPath = `src/components/ui/${name}.tsx`;
  const output = execFileSync(
    'pnpm',
    ['exec', 'shadcn', 'add', name, '--dry-run', '--view', cliPath, '--yes'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const lines = output.split('\n');
  const header = lines.findIndex((line) => line.includes(cliPath));
  if (header === -1) throw new Error(`shadcn did not print ${cliPath}`);
  const content = [];
  for (const line of lines.slice(header + 2)) {
    if (!line.startsWith('│ │')) break;
    content.push(line.replace(/^│ │ ?/, ''));
  }
  return `${content.join('\n').replace(/\n+$/, '')}\n`;
}

const scratch = mkdtempSync(join(tmpdir(), 'shadcn-update-'));
let conflicts = 0;

for (const name of names) {
  const file = `${name}.tsx`;
  const basePath = `upstream/ui/${file}`;
  const ownedPath = `src/components/${name}/${file}`;
  if (addNew) {
    if (existsSync(basePath) || existsSync(ownedPath)) {
      console.error(`${name}: already owned`);
      process.exitCode = 1;
      continue;
    }
    const upstream = fetchUpstream(name);
    writeFileSync(basePath, upstream);
    mkdirSync(`src/components/${name}`, { recursive: true });
    writeFileSync(ownedPath, upstream);
    writeFileSync(`src/components/${name}/index.ts`, `export * from './${name}';\n`);
    lock.files[file] = sha(upstream);
    console.log(`${name}: added; close its API in ${ownedPath}`);
    continue;
  }
  if (!existsSync(basePath)) {
    console.error(`${name}: no upstream/ui/${file}`);
    process.exitCode = 1;
    continue;
  }

  const theirs = fetchUpstream(name);
  if (sha(theirs) === lock.files[file]) {
    console.log(`${name}: up to date`);
    continue;
  }
  if (checkOnly) {
    console.log(`${name}: upstream changed`);
    continue;
  }

  const theirsPath = join(scratch, file);
  writeFileSync(theirsPath, theirs);
  const merge = spawnSync('git', [
    'merge-file',
    '-L',
    'ours',
    '-L',
    'base',
    '-L',
    'upstream',
    ownedPath,
    basePath,
    theirsPath,
  ]);
  if (merge.status !== 0) {
    conflicts += 1;
    console.log(`${name}: merged with conflicts in ${ownedPath}`);
  } else {
    console.log(`${name}: merged`);
  }
  writeFileSync(basePath, theirs);
  lock.files[file] = sha(theirs);
}

lock.shadcn = execFileSync('pnpm', ['exec', 'shadcn', '--version'], { encoding: 'utf8' }).trim();
if (!checkOnly) writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
if (conflicts) process.exitCode = 1;
