---
name: own-shadcn-component
description: Convert, add, update or change a component in @nanostackorg/design-system under the owned, closed API of ADR 0001. Use when a file in src/components/<name>/ changes, when a shadcn component is added or updated (pnpm shadcn:update), when a variant is added, or when a component story and its usage docs are written.
---

# Own a shadcn component

Read `docs/adr/0001-own-shadcn-with-a-closed-api.md` first. `src/components/button/` is the reference: copy its shape.

## Files

```
src/components/<name>/<name>.tsx          the owned component: shadcn code, edited in place
src/components/<name>/index.ts            explicit named exports of the public parts and types
src/components/<name>/<name>.stories.tsx  usage docs and play tests
upstream/ui/<name>.tsx                    the untouched CLI output, merge base only
```

`src/components/<name>/.open-api` marks a folder whose parts still accept `className`. Delete it when the folder is closed. `pnpm test:package` then checks every export of the folder.

## 1. Start from the upstream code

1. Copy `src/components/ui/<name>.tsx` over `src/components/<name>/<name>.tsx` and merge in what the old wrapper added (extra variants, fixes, defaults).
2. Match the repo style: single quotes, semicolons, trailing commas, width 100, `cn` from `@/lib/utils`. Drop `"use client"`.
3. Import other design-system parts by their owned file (`@/components/button/button`), never through `@/components/ui/*`.
4. Do not delete `src/components/ui/<name>.tsx` while another `src/components/ui/*` file imports it. The last group removes the folder.

## 2. Close every exported part

- The public prop type is `ClosedProps<…>` (from `@/lib/closed-props`) plus the variant props. No `className`, no `style`.
- Keep `render` only on parts that must render another component: triggers and close parts (`DialogTrigger render={<Button>…</Button>}`). Drop it elsewhere.
- Keep `aria-*`, `data-*`, handlers, `ref`, `id`, `children`, and the Base UI behaviour props.
- A part that another owned file needs with extra classes stays available inside the package: export an internal style function (`buttonStyles`) or an internal part from `<name>.tsx`, and leave it out of `index.ts`.
- Sizing that a product used to set with `className` becomes a prop: `width` (`auto` | `fill`), `size`, `maxHeight` on a popup, `side` and `align` on a positioned part.

## 3. Choose the variants

Use the shared vocabulary. Offer only the values the component needs.

| Prop      | Values                                                       | Meaning                                                        |
| --------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| `variant` | `solid`, `soft`, `outline`, `ghost`                          | Visual weight.                                                 |
| `tone`    | `neutral`, `brand`, `critical`, `success`, `warning`, `info` | Meaning. Text on a tint uses the `-on-tint` token.             |
| `size`    | `xs`, `sm`, `md`, `lg`                                       | `md` is the default. Heights follow Button: 24, 32, 36, 40 px. |
| `width`   | `auto`, `fill`                                               | For controls that can stretch.                                 |

- No shape, radius, colour or margin props.
- A value needs two real product uses. The Echopoint audit is the evidence for 0.2.0: `Input` `font-mono` ×17 (so `Input` gets a `font` prop), `Badge` pill padding ×12, three `SelectTrigger` heights.
- Replace a shadcn variant name with the vocabulary (`destructive` → `tone="critical"`, `secondary` → `variant="soft"`, `default` → `variant="solid" tone="brand"` or the component's neutral default).

## 4. Write the usage docs

The story meta carries the docs in `parameters.docs.description.component`, as Markdown:

1. One or two sentences: what the component is for, and which component to use instead in the near cases.
2. One table per prop that changes the look: `| Value | Use it for |`. Say when to choose each value, not what it looks like.
3. `## Do not`: the misuses that the Echopoint audit or review found.

Give a notable story a `parameters.docs.description.story`. Write in short sentences, one idea each, active voice.

## 5. Test

- One story per variant group and per state that applies: disabled, invalid, loading, empty, long content, keyboard.
- A `play` test for what a person observes: role and name, open and close, keyboard, focus return, callbacks with `fn()`.
- Overlay content renders in a portal: query it with `screen` and `findBy*` or `waitFor`.
- The a11y addon fails a story on any violation, in light and dark.
- Stories, blocks and layout import the public barrel (`@/components/<name>`), like a product. ESLint enforces it.

## 6. Update the callers

Search `src/` for the component. Update stories, blocks and other owned files that pass a removed prop or `className`. Record every API change in the PR as a migration table: `| 0.1.0 | 0.2.0 |`.

## 7. Check

1. `pnpm lint && pnpm typecheck`
2. `pnpm exec vitest run src/components/<name>`
3. `pnpm build && pnpm test:package`: the closed-API check covers the folder once `.open-api` is gone.

## Update from upstream

`pnpm shadcn:update --check` lists components whose shadcn output changed. `pnpm shadcn:update <name>` merges the change three ways into the owned file and records the new base in `upstream/`. Resolve any conflict markers, run the checks, and say in the PR which upstream change came in.
