# Nanostack design system

`@nanostackorg/design-system` is shadcn/ui, wrapped. It holds every shadcn component, the blocks any Nanostack product can use unchanged, and the design tokens. Products (Echopoint, Anchor) own routes, data, copy and the visuals that only their meaning explains.

## Layout

| Path                                            | What                                           | Who edits                               |
| ----------------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| `src/components/ui/`, `src/hooks/use-mobile.ts` | Raw shadcn CLI output                          | Only the shadcn CLI                     |
| `src/components/<name>/`                        | Wrapper, `index.ts`, story                     | Hand-written                            |
| `src/blocks/<name>/`                            | Custom components built from wrappers          | Hand-written                            |
| `src/styles.css`                                | Tokens, `@theme inline` mapping, base layer    | Hand-written                            |
| `src/index.ts`                                  | Root barrel of wrappers and blocks             | Hand-written                            |
| `.claude/skills/shadcn/`                        | Official shadcn skill, installed with `skills` | `npx skills@latest update shadcn -p -y` |

## Rules

1. Components come from https://ui.shadcn.com through the latest shadcn CLI and Tailwind v4. `components.json` matches Echopoint: `base-luma`, `neutral`, CSS variables, `phosphor`, no RSC, TSX. The CLI now merges classes with the `cn` package, and `src/lib/utils.ts` re-exports it.
2. Tokens keep the shadcn names (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1..5`, `--sidebar-*`, `--radius`). Extensions add, never rename: `--success`, `--warning`, `--info` with `-foreground` and `-on-tint`, `--destructive-on-tint`, `--chart-N-on-tint`, `--border-strong`, `--surface-subtle`, `--surface-elevated`, the font and easing tokens. Values follow Echopoint `apps/frontend/src/styles/globals.css`, without its app-only tokens. A token change needs contrast checks and light and dark screenshots. `Foundations/Tokens` fails when a text pair drops below WCAG AA or when the Storybook theme in `.storybook/nanostack-theme.ts` no longer matches the tokens. Dark `--destructive` is lighter than Echopoint's (`0 84% 70%`) so error text passes AA.
3. `src/components/ui/` is never edited by hand and never exported. `package.json` maps `./components/ui/*` to `null`. ESLint allows an `@/components/ui/*` import only in a wrapper file (`src/components/<name>/<name>.tsx`). A fix goes in the wrapper.
4. Every shadcn component has a wrapper that the package exports. Wrappers expose typed cva variant props and are the only styling surface. Each wrapper has a story file with `play` tests that the Storybook Vitest addon runs. Procedure: `.claude/skills/wrap-shadcn-component/SKILL.md`.
5. A block is a component that does not come from shadcn and that a second product would use unchanged (app shell, data table, page header, empty state). It imports wrappers and tokens only, with no API client, router, auth or product vocabulary. Its stories cover light and dark.
6. Styles use tokens only. ESLint rejects palette colors (`bg-blue-500`) and arbitrary colors (`bg-[#fff]`) in `src/`. `className` on a wrapper is for layout, as in the shadcn skill rules.
7. Follow the official shadcn skill in `.claude/skills/shadcn/` (source https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md, pinned in `skills-lock.json`). This project uses the Base UI flavor: `render`, not `asChild`.
8. Token layers follow https://shadisbaih.medium.com/building-a-scalable-design-system-with-shadcn-ui-tailwind-css-and-design-tokens-031474b03690: semantic tokens, then the Tailwind mapping, then cva variants in wrappers.

## Consumer rule

Copy this section into each product guide.

- Import UI only from `@nanostackorg/design-system` (root or `components/<name>`, `blocks/<name>`). Never copy a shadcn component into the app, and never import `components/ui`.
- Wire Tailwind v4 in the main CSS file: `@import "tailwindcss";`, `@import "@nanostackorg/design-system/styles.css";`, `@source "../node_modules/@nanostackorg/design-system/dist";` (path relative to that CSS file). Load the fonts with `@fontsource-variable/plus-jakarta-sans`, `outfit` and `geist-mono`.
- An app-specific component lives in one scoped folder (for example `src/features/<feature>/components/`), composes the package wrappers, and follows the shadcn conventions (variants through props, `data-slot`, `render` for custom elements).
- Style only with the design tokens (`bg-primary`, `text-muted-foreground`, `border-border-strong`). No palette or arbitrary colors, no `dark:` color overrides, no CSS that targets library markup, no token overrides. `className` on a library component is for layout.
- A missing variant or a component a second product needs goes back to this repository.

## Gates

Before a PR: `pnpm lint`, `pnpm typecheck`, `pnpm test` (every story in Chromium, once light and once dark, a11y violations fail), `pnpm build`, `pnpm test:package` (packed tarball, private `ui/`, consumer typecheck, consumer Tailwind build). CI and the release `verify` job run the same steps. Pages publishes `pnpm build-storybook`. Screenshots go in `.ui-craft/` and on the PR with `gh pr create --attach`, never in a commit.

## Release

Beta APIs change only with a `CHANGELOG.md` entry: a `## <version>` heading and an `Upgrade:` line. The user approves each npm publish. After approval: `git tag v<version>` on `origin/main`, push the tag, `gh workflow run release.yml --ref v<version>`. npm trusted publishing is configured for that workflow.
