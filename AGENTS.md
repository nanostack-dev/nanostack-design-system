# Nanostack design system

`@nanostackorg/design-system` owns its shadcn/ui code and gives products a closed, typed API: components, layout blocks, blocks and design tokens. Products (Echopoint, Anchor) own routes, data, copy and the visuals that only their meaning explains. The decision and its reasons: `docs/adr/0001-own-shadcn-with-a-closed-api.md`.

## Layout

| Path                                 | What                                                             | Who edits                               |
| ------------------------------------ | ---------------------------------------------------------------- | --------------------------------------- |
| `src/components/<name>/`             | Owned component (shadcn code edited in place), `index.ts`, story | Hand-written                            |
| `src/layout/<name>/`                 | `Box`, `Stack`, `Inline`, `Columns`, `Spread`                    | Hand-written                            |
| `src/blocks/<name>/`                 | Product-agnostic compositions of the public components           | Hand-written                            |
| `src/provider/`                      | `DesignSystemProvider` (router link, tooltip provider)           | Hand-written                            |
| `src/styles.css`                     | Tokens, `@theme inline` mapping, base layer                      | Hand-written                            |
| `upstream/ui/`, `upstream/lock.json` | Untouched shadcn CLI output, the merge base                      | Only `pnpm shadcn:update`               |
| `.claude/skills/shadcn/`             | Official shadcn skill, installed with `skills`                   | `npx skills@latest update shadcn -p -y` |

## Rules

1. Components start from the latest shadcn CLI output (`base-luma`, `neutral`, CSS variables, `phosphor`, Base UI, Tailwind v4) and are then owned: edited in place in `src/components/<name>/<name>.tsx`. Procedure: `.claude/skills/own-shadcn-component/SKILL.md`. An upstream update goes through `pnpm shadcn:update`, a three-way merge against `upstream/`.
2. Every exported part is closed: typed props only, no `className`, no `style`. `pnpm test:package` checks every export.
3. Variants use one vocabulary: `variant` (`solid`, `soft`, `outline`, `ghost`), `tone` (`neutral`, `brand`, `critical`, `success`, `warning`, `info`), `size` (`xs`, `sm`, `md`, `lg`), `width` (`auto`, `fill`). No shape, radius, colour or margin props. A new value needs two real product uses and a story.
4. Components have no outer margin. Layout blocks own spacing on the scale `none`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`.
5. `Box` is the only open export. It is for product component files that build a look no component gives, with tokens only.
6. Tokens keep the shadcn names (`--background`, `--primary`, `--destructive`, `--sidebar-*`, `--chart-1..5`, `--radius`). Extensions add, never rename: `--success`, `--warning`, `--info` with `-foreground` and `-on-tint`, `--destructive-foreground`, `--destructive-on-tint`, `--chart-N-on-tint`, `--border-strong`, `--surface-subtle`, `--surface-elevated`, the font and easing tokens. A token change needs contrast checks and light and dark screenshots.
7. Styles use tokens only. ESLint rejects palette colours (`bg-blue-500`) and arbitrary colours (`bg-[#fff]`) in `src/`.
8. Owned files may import each other's internal parts by path (`@/components/button/button`). Blocks, layout and stories import only the public barrels (`@/components/<name>`), like a product.
9. Every component story documents how to use each variant: a table per prop in `parameters.docs.description.component`, and a `Do not` list.
10. Follow the official shadcn skill in `.claude/skills/shadcn/` for composition and accessibility. This project uses the Base UI flavour: `render`, not `asChild`.
11. Creating or changing a component or block: run the `break-ui` skill on it (not in your skills? WebFetch `https://raw.githubusercontent.com/emilkowalski/skills/main/skills/break-ui/SKILL.md`). Its worst-case data lands as stories beside the demo story (`WorstCase`, plus `Empty` and `One` where they apply) in place of the skill's dev toggle, so the story suite guards it. Fix every Broken and Ugly finding in the same PR; list the Fragile rows and open decisions in the PR body.

## Consumer rule

Copy this section into each product guide.

- Import UI only from `@nanostackorg/design-system` (root, `components/<name>`, `layout/<name>`, `blocks/<name>`, `provider`). Never copy a shadcn component into the product.
- Wire Tailwind v4 in the main CSS file: `@import "tailwindcss";`, `@import "@nanostackorg/design-system/styles.css";`, `@source "../node_modules/@nanostackorg/design-system/dist";` (path relative to that CSS file). Load the fonts with `@fontsource-variable/plus-jakarta-sans`, `outfit` and `geist-mono`.
- Wrap the app in `DesignSystemProvider linkComponent={RouterLink}` so `ButtonLink` and `TextLink` use the product router.
- Pages and routes compose components, blocks and layout blocks with props only. They pass no `className`.
- Before a new component, ask: is it the same use case as an existing component with another look? Then use or request a variant. Is the meaning product-specific (a flow step, an HTTP method)? Then make a product component: `src/features/<feature>/components/` for one feature, `src/components/<domain>/` for several. Would a second product use it unchanged? Then it belongs here.
- A product component is closed too: it exposes typed variants. Inside its own file it composes design-system components by their props, or builds on `Box` with design tokens. It never restyles a design-system component.
- A missing variant or a component a second product needs goes back to this repository.

## Gates

Before a PR: `pnpm lint`, `pnpm typecheck`, `pnpm test` (every story in Chromium, once light and once dark, a11y violations fail), `pnpm build`, `pnpm test:package` (packed tarball, private `ui/`, closed-API check of every export, consumer typecheck, consumer Tailwind build). CI and the release `verify` job run the same steps. Pages publishes `pnpm build-storybook`. Screenshots go in `.ui-craft/` and on the PR with `gh pr create --attach`, never in a commit.

## Release

Beta APIs change only with a `CHANGELOG.md` entry: a `## <version>` heading and an `Upgrade:` line. The user approves each npm publish. After approval: `git tag v<version>` on `origin/main`, push the tag, `gh workflow run release.yml --ref v<version>`. npm trusted publishing is configured for that workflow.
