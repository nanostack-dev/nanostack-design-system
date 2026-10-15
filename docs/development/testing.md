# Testing

The [CI verify job](../../.github/workflows/ci.yml) and [release verification](../../.github/workflows/release.yml) run the project gates:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:package
pnpm build-storybook
pnpm test:motion
```

`pnpm test` executes Storybook play and accessibility tests in Chromium, once per light/dark theme. `pnpm test:package` verifies packed exports, the closed API, consumer types and consumer Tailwind output. Pages also requires `pnpm build-storybook`.

During iteration, select the affected component with `pnpm exec vitest run src/components/<name>`. Overlay content renders in portals, so query it through `screen` and async role/name lookups. Cover keyboard, focus return and observable callbacks rather than implementation details. Stories and blocks import public barrels.

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
