# Nanostack design system

This library owns presentation; Anchor and Echopoint own routes, permissions, server state, and product concepts. Read `docs/research.md` when changing architecture and `docs/contributing.md` when adding a public API or preparing a release.

## Public contract

- Components **never accept consumer CSS**. Derive DOM props through `ElementProps`, or omit styling keys from Base UI props and intersect `NoCustomStyle`. Use `safeProps` at the DOM boundary for untyped consumers. Keep `className`, `style`, `css`, `classNames`, `unstyled`, `render`, `asChild`, and arbitrary token values out of public APIs. Add negative type tests for every new styling bypass.
- Variations use closed semantic unions. A new variation starts with a real consumer use case, is implemented centrally, and is demonstrated in the playground. Layout comes from Stack, Cluster, Grid, Surface and block parts.
- Compose children and named parts rather than adding page-sized configuration objects. Shared blocks have no API clients, auth providers, router dependencies, domain enums, or application strings.
- React refs are props. Preserve native accessibility attributes and event handlers. Interaction belongs to Base UI; simple semantics belong to native HTML. Each new complex control must preserve keyboard behavior and focus return.
- Theme is a finite combination of brand, color scheme, and density. Overlays must inherit its scope through portals. CSS selectors are namespaced; importing the library must not reset the host app or change its global theme.
- `src/styles.css` is the single visual source. Public source and generated package/registry output share it; publish no alternate component implementation. New source modules use `.js` relative specifiers so emitted ESM runs outside Vite.

## Validation boundaries

`pnpm check` checks lint, types (including rejected props), behavior, package output, and the documentation build. `pnpm test:browser` checks actual CSS, keyboard interactions, accessibility scans and responsive overflow. Packaging or exports changes additionally require `pnpm test:package` against the packed artifact. `pnpm registry:build` regenerates installable recipes; do not hand-edit output.

Test what a person can observe. Include disabled, pending, empty, failed, long-content, touch, keyboard and dark states when applicable. Axe is one check, not a conformance claim. Token changes require contrast checks and both-theme screenshots. Capture images locally in `.ui-craft/` and attach them to PRs, never commit them.

## Evolution

Beta APIs may change only with a changelog entry and an upgrade example. Keep additive changes small; extract a block only after a second composition proves its boundary. A consumer needing a visual exception brings the variant back here. Preserve React peer compatibility with the installed consumer versions; using a newer hook requires raising the peer range and coordinating upgrades.
