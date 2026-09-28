---
name: wrap-shadcn-component
description: Add, update or wrap a shadcn/ui component in @nanostackorg/design-system. Use when running `shadcn add`, when a file in src/components/ui/ changes, when creating or editing a wrapper in src/components/<name>/, when adding a variant, or when writing its Storybook story and play tests.
---

# Wrap a shadcn component

Three files per component. `<name>` is the kebab-case file name of the raw component in `src/components/ui/`.

```
src/components/ui/<name>.tsx            raw shadcn output, never edited
src/components/<name>/<name>.tsx        wrapper, the only file that imports ui/<name>
src/components/<name>/index.ts          export * from './<name>';
src/components/<name>/<name>.stories.tsx
```

## 1. Add or update the raw component

1. `pnpm dlx shadcn@latest add <name>` (new) or `pnpm dlx shadcn@latest add <name> --diff` (update check).
2. To take an upstream update, run `pnpm dlx shadcn@latest add <name> --overwrite`. The file has no local edits, so the overwrite loses nothing.
3. Never hand-edit a file in `src/components/ui/` or `src/hooks/use-mobile.ts`. A fix goes in the wrapper (a class through `className`, a default prop, or a composition).

## 2. Write the wrapper

- Import the raw parts from `@/components/ui/<name>`. Import other components through their wrappers (`@/components/button`), never through `ui/`. ESLint enforces both.
- Export every public part of the raw file under the same name, and a `<Part>Props` type for each part (`ComponentProps<typeof Part>`). Re-export a `<name>Variants` cva function if the raw file exports one.
- A part that the library does not change is a re-export. A part that gains a variant or a default becomes a function. See `src/components/badge/badge.tsx`: a library cva adds `success`, `warning` and `info`, and the union type widens `variant`.
- Variants use tokens only (`bg-success/10 text-success-on-tint`). No palette colors, no arbitrary colors, no `dark:` color overrides. The tokens change with the theme.
- Add a variant only for a real consumer need. Say which one in the PR.
- Style: single quotes, semicolons, trailing commas, width 100. No comments.

Minimal pass-through wrapper:

```tsx
import type { ComponentProps } from 'react';

import { Separator } from '@/components/ui/separator';

export type SeparatorProps = ComponentProps<typeof Separator>;

export { Separator };
```

## 3. Write the story

- `title: 'Components/<Title Case Name>'` (blocks: `'Blocks/<Name>'`), `component`, `args`, `satisfies Meta<typeof X>`. Import `expect`, `fn`, `screen`, `waitFor`, `within` from `storybook/test`. Use `canvas` and `userEvent` from the play context.
- One story per variant group (`Variants`, `Sizes`) and per state that applies: disabled, invalid, loading, empty, long content, keyboard.
- Every story with behavior has a `play` test of what a person observes: role and name, open and close, keyboard (Tab, Enter, Space, Escape, arrows), focus return to the trigger, callbacks called with `fn()`.
- Overlay content renders in a portal. Query it with `screen` or `within(document.body)` and `findBy*` or `waitFor`.
- The a11y addon fails a test on any violation. Give every control a name. If a violation comes from the untouched raw component and composition cannot fix it, set `parameters: { a11y: { test: 'todo' } }` on that story only and name the rule in the PR.
- Blocks (components that do not come from shadcn) also get a `Dark` story: `globals: { theme: 'dark' }`.

## 4. Export and check

1. Add `export * from './components/<name>';` to `src/index.ts`.
2. `pnpm exec vitest run --project storybook src/components/<name>`
3. `pnpm lint && pnpm typecheck && pnpm build`
4. For a new public entry or a changed export, `pnpm test:package`.
