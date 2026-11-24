# Testing

[CI](../../.github/workflows/ci.yml) and [release verification](../../.github/workflows/release.yml) run the project gates:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:package
pnpm build-storybook
pnpm test:motion
```

CI runs them as Dagger checks (`dagger check`, [dagger.toml](../../dagger.toml)) in the Playwright image the checks pin: `lint`, `typecheck`, `test-light` and `test-dark` (`pnpm test`, one Vitest project each), `package` (build and `test:package`) and `storybook-motion` (`build-storybook` and `test:motion`). Each check job gets its own runner, because the browser suites time out when they share 4 vCPUs with the builds; the `verify` job is green only when all of them are. Run one with `dagger check --check=test-dark`. Run `dagger check` locally for exactly that; install the pinned CLI with `curl -fsSL https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=1.0.0-beta.24 BIN_DIR=~/.local/bin sh`. Release verification still runs the pnpm commands.

`pnpm test` executes Storybook play and accessibility tests in Chromium, once per light/dark theme. `pnpm test:package` verifies packed exports, the closed API, consumer types and consumer Tailwind output. Pages also requires `pnpm build-storybook`.

During iteration, select the affected component with `pnpm exec vitest run src/components/<name>`. Overlay content renders in portals, so query it through `screen` and async role/name lookups. Cover keyboard, focus return and observable callbacks rather than implementation details. Stories and blocks import public barrels.

## Token and contrast checks

`pnpm lint` also runs two scripts, so CI and release verification run them too.

| Script                            | Data file             | Fails when                                                                                                                              |
| --------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `node scripts/check-tokens.mjs`   | `tokens.lock.json`    | A `:root` token has no `.dark` value (theme-independent ones are listed in the script); a locked token is gone; a new token is unlocked |
| `node scripts/check-contrast.mjs` | `contrast-pairs.json` | A named token pair is below its minimum in light or dark                                                                                |

- A new token: run `node scripts/check-tokens.mjs --write` and commit the lock. The lock holds sorted names, so a value change does not touch it.
- A removed token is a breaking change. Follow the [deprecation path](../research/versioning-and-deprecation-proposal.md). Run `--write` only for a removal that `CHANGELOG.md` records.
- A contrast pair has `fg`, `bg`, `min` (4.5 for text, 3 for large text and non-text) and `reason`. A tint pair adds `bgAlpha` and `over`. Add a pair when you add a text or control token. Fix a failing pair in `src/styles.css`, never by lowering `min`.

## Upstream drift

`pnpm shadcn:update --check` compares each owned component with the current shadcn output and changes no file.

| Exit code | Meaning                                 |
| --------- | --------------------------------------- |
| 0         | Every component matches upstream        |
| 2         | At least one component changed upstream |
| 1         | An error (for example a failed fetch)   |

It prints one summary line. The [upstream drift workflow](../../.github/workflows/upstream-drift.yml) runs it every week, keeps one open issue titled "shadcn upstream changed" while the exit code is 2, and closes the issue on exit 0. Merge a change with `pnpm shadcn:update <name>`.

## Hostile-data review

For a new or changed component/block, use the installed `break-ui` skill when available. The standalone procedure is:

1. Exercise long labels, unbreakable text, empty/missing optional values, one item and large collections where applicable.
2. Exercise relevant disabled, invalid, loading, overflow and narrow-viewport states in both themes. Check keyboard access, focus, accessible names and contrast.
3. Persist representative cases as `WorstCase`, `Empty` and `One` stories beside normal demos; add play assertions for meaningful behavior.
4. Fix broken behavior and unusable presentation in the same PR. Record remaining fragile cases and open product decisions in the PR body.

Rendered UI changes need before/after image pairs with the same viewport, theme and data. Keep files in ignored `.ui-craft/` and attach them to the PR. Token changes also need contrast checks and light/dark evidence. Story usage docs must explain when to select each variation and include known misuses.

Documentation-only changes need formatting, local link validation and `git diff --check`; runtime tests are the existing project gates, rather than newly invented tests for prose.

## Motion regression

`pnpm test:motion` serves the built Storybook on an owned ephemeral port and verifies pointer, keyboard, focus return, rapid disclosure reversal, disabled controls, live tabs/progress, toast dismissal, immediate palettes, sidebar/backdrop frequency policy, select feedback and direct drawer dragging on mobile (392×850), tablet (768×1024) and desktop (1440×900) Chromium. Each profile runs both themes and both device motion preferences: 12 journeys, no retries or skips. `pnpm test` also runs Foundations/Motion play and accessibility tests in both themes.

Use `pnpm test:motion -- --review` for native-size videos and screenshots in ignored `.ui-craft/motion-review/`. Review-only reading holds do not change correctness waits. Before/after evidence uses identical fixtures, themes and viewports against the PR base and feature source. The built-storybook command closes its browser and HTTP server in `finally`; a failed run writes a screenshot and partial result manifest.
