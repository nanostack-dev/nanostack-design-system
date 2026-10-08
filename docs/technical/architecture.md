# Architecture

This repository publishes a React library and a Storybook site. Applications own routing, data, copy and product-specific visuals; the library owns reusable UI, layout and tokens. [ADR 0001](../adr/0001-own-shadcn-with-a-closed-api.md) records the trade-off behind the current closed API.

| Area                                | Responsibility                                                        |
| ----------------------------------- | --------------------------------------------------------------------- |
| `src/components/<name>`             | Owned shadcn-origin component, closed public barrel and usage stories |
| `src/layout`                        | Box and spacing/layout primitives                                     |
| `src/blocks`                        | Product-independent compositions of public components                 |
| `src/provider`                      | Router link adapter and tooltip provider                              |
| `src/styles.css`                    | Semantic tokens, Tailwind mapping and base styles                     |
| `upstream/ui`, `upstream/lock.json` | Untouched shadcn snapshots used as three-way merge bases              |
| `scripts`                           | Library packaging, styles, consumer verification and upstream updates |

## Public boundary

Public components accept typed variants, content, behavior, accessibility attributes and refs. They reject `className` and `style`; the packed-package test checks every export. Box is the open building primitive for a product component's implementation. Pages compose the public API and request missing reusable variations here.

Owned components can import internal parts by their source path. Blocks, layout and stories consume public barrels as products do. [package.json](../../package.json) owns exported paths, peer versions and packed files; upstream snapshots are neither built nor exported.

The [DesignSystemProvider](../../src/provider/design-system-provider.tsx) supplies a router link adapter and tooltip context. It defaults to ordinary anchors, allowing consumers without a router. ThemeProvider supplies theme selection separately; the `dark` class selects dark tokens. Consumers import library CSS after Tailwind and point Tailwind's `@source` at the installed `dist` output.

## Build and verification

The library build emits JavaScript, declarations and CSS under `dist`. Package verification installs the packed output into a consumer fixture, checks exported APIs and builds consumer Tailwind output. [Vitest](../../vitest.config.ts) runs every Storybook story in Chromium for both light and dark themes; accessibility violations fail.

Storybook Pages is a separate publication triggered from `main`. npm release requires an explicit tag, workflow dispatch, matching package version, changelog and trusted publishing. See [publishing](../runbooks/deployment.md).
