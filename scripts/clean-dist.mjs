import { rm } from 'node:fs/promises';

// A removed source file must not survive in the next published archive.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
