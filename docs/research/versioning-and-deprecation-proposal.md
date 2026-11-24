# Versioning and deprecation proposal

Status: **proposal**, 2026-11-24. The owner must decide. Nothing here is in force. It implements recommendation 3 and the open part of recommendation 4 of [design system maintenance practices](design-system-maintenance.md).

## Decision needed

| Question                                           | Proposed answer                                   | Door                                            |
| -------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Adopt the public API list and the 0.x rules below? | Yes. Move them to `docs/technical/versioning.md`. | Two-way. A document change.                     |
| Adopt the deprecation path before any removal?     | Yes, for at least one minor.                      | Two-way.                                        |
| Allow committed screenshot baselines?              | Open. See "Screenshot baselines".                 | Two-way, but a baseline set is costly to build. |
| Set 1.0 criteria now?                              | Yes, as a list. No date.                          | Two-way.                                        |

## What is public API

A change to any row below can break a product. The tools in the last column catch some of them today.

| Surface                        | Examples                                                                   | Caught today by            |
| ------------------------------ | -------------------------------------------------------------------------- | -------------------------- |
| Export paths and names         | `components/<name>`, `layout/<name>`, `blocks/<name>`, `provider`, `utils` | `pnpm test:package`        |
| Component and prop names       | `Button`, `tone`, `width`                                                  | TypeScript in consumers    |
| Prop values                    | `variant="soft"`, `size="xs"`                                              | TypeScript in consumers    |
| `data-slot` names              | `data-slot='dialog-overlay'`                                               | Nothing                    |
| Documented attributes          | `data-ns-material`                                                         | Nothing                    |
| Token names                    | `--primary`, `--success-on-tint`, `--glass-surface`                        | `scripts/check-tokens.mjs` |
| Documented product hooks       | `--app-shell-brand-tile`                                                   | Nothing                    |
| CSS classes a consumer targets | Any class a consumer selects in its own CSS                                | Nothing                    |

Not public: token values, internal file paths under `src/`, class names inside components, and anything under `upstream/`.

## Rules in 0.x

| Change                                    | Today                          | Proposed                                                            |
| ----------------------------------------- | ------------------------------ | ------------------------------------------------------------------- |
| Remove or rename an export, prop or token | Allowed in a patch (0.3.1 did) | Minor only, after one minor of deprecation, with an `Upgrade:` line |
| Change a token value                      | Allowed                        | Allowed in a minor. Contrast checks must pass.                      |
| Add a prop value, token or component      | Allowed                        | Allowed in a minor. New tokens go into `tokens.lock.json`.          |
| Fix a bug                                 | Patch                          | Patch. A fix must not remove or rename anything.                    |
| Change `data-slot` names                  | Allowed                        | Treated as API. Minor, with deprecation.                            |

## Criteria for 1.0

1. Every public surface in the table above has an automated check, or a written reason it has none.
2. Both products run the current minor with no copied shadcn component and no `className` on a design-system part.
3. One full deprecation cycle has shipped: a deprecated item, its warning, its removal and its codemod.
4. Contrast and token checks gate CI (`pnpm lint`). Glass contrast gates CI too.
5. A visual baseline exists, or the owner records why not.
6. From 1.0, a breaking change needs a major version.

## Deprecation path

Deprecate for at least one minor before removal.

| Step | Prop or export                                                                             | Token                                              |
| ---- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 1    | JSDoc `@deprecated Use X` on the prop or export                                            | Keep the old name as an alias: `--old: var(--new)` |
| 2    | Dev-only warn-once helper, `src/lib/deprecate.ts`                                          | A comment with the removal version                 |
| 3    | Storybook tag `deprecated` on the story                                                    | CHANGELOG `Deprecated:` line                       |
| 4    | CHANGELOG `Deprecated:` line with the removal version                                      | Remove the alias in the announced minor            |
| 5    | A rename ships a codemod in `scripts/codemods/<version>/`, linked from the `Upgrade:` line | Same, for a rename                                 |

Removing a token also needs `node scripts/check-tokens.mjs --write`, in the same PR as its CHANGELOG line.

## Screenshot baselines

AGENTS.md says screenshots go in `.ui-craft/` and on the PR, never in a commit. Committed baselines need an exception to that rule.

| Option                                             | Cost                                                  | Risk                                         |
| -------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| No baselines (today)                               | None                                                  | No gate sees pixels. Glass regressions slip. |
| Committed baselines in the Dagger Playwright image | Repository grows. A dispatched workflow updates them. | Image or font changes churn every file.      |
| Hosted service such as Chromatic                   | External service and account                          | Baselines leave Git.                         |

**Open decision for the owner.** Pick one. If committed baselines win, amend the Gates section of AGENTS.md in the same PR that adds the `visual` Vitest project.

## Tools in this repository

- `node scripts/check-tokens.mjs` and `tokens.lock.json`: [testing](../development/testing.md#token-and-contrast-checks).
- `node scripts/check-contrast.mjs` and `contrast-pairs.json`: same section.
- `pnpm shadcn:update --check` and the weekly upstream drift workflow: [testing](../development/testing.md#upstream-drift).
