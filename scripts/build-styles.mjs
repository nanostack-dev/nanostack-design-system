import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

// The published stylesheet must not need the shadcn CLI package at runtime,
// so its small tailwind.css (custom variants and keyframes) is inlined.
const require = createRequire(import.meta.url);
const shadcnImport = /@import ['"]shadcn\/tailwind\.css['"];/;
const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
if (!shadcnImport.test(source)) throw new Error('src/styles.css must import shadcn/tailwind.css');
const shadcnStyles = await readFile(require.resolve('shadcn/tailwind.css'), 'utf8');
await writeFile(
  new URL('../dist/styles.css', import.meta.url),
  source.replace(shadcnImport, () => `/* shadcn/tailwind.css */\n${shadcnStyles.trim()}\n`),
);
