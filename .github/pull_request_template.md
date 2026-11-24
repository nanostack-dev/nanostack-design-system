## What and why

<!-- One or two short sentences. Link the issue. -->

## Gates

Run before review (see AGENTS.md, Gates).

- [ ] `pnpm lint` (ESLint, Prettier, token lock and contrast pairs)
- [ ] `pnpm typecheck`
- [ ] `pnpm test` (every story, light and dark)
- [ ] `pnpm build`
- [ ] `pnpm test:package`

## Evidence

- [ ] Before and after screenshots attached to this PR (same viewport, theme and data, light and dark). Never committed. Write "n/a" for a change with no rendered UI.
- [ ] Token change: contrast checked, `node scripts/check-tokens.mjs --write` run for a new token, glass token change measured with `node scripts/measure-glass-contrast.mjs`.
- [ ] New or changed component or block: hostile-data stories (`WorstCase`, `Empty`, `One`) added. Broken and Ugly findings fixed.

## API and release

- [ ] No API or token change, or `CHANGELOG.md` has a `## <version>` heading with an `Upgrade:` line.
- [ ] A removed or renamed export, prop, value or token follows the deprecation path, or is recorded in CHANGELOG as breaking.
- [ ] Docs updated where behavior, vocabulary or an architectural choice changed.

## Fragile rows and open decisions

<!-- List remaining Fragile findings from the hostile-data review, and any decision for the owner. -->
