# Nanostack design system

This library holds the UI that any Nanostack product can use unchanged. Anchor and Echopoint own routes, permissions, server state, product copy, assemblies of library parts, and the product-specific visuals that carry their meaning. Read [the catalog](docs/components.md) before assembling a surface or adding a visual capability; [contributing](docs/contributing.md) when changing an API, moving UI between an app and the library, or releasing; [research](docs/research.md) when changing architecture.

## Scope

- **Library:** primitives, layout, forms, overlays, navigation and shell, collections and tables, generic data display, a plain code editor and viewer, and theming.
- **Product:** a visual that only one product's meaning explains stays in that product, built from `--ns-*` tokens and library primitives, with CSS the product owns. Echopoint keeps its flow canvas and node parts, runner avatars (Pebble), fleet capacity tiles, request editors with `{{variables}}`, workbench panes and trees, run-history strips and timelines, the assistant conversation, and HTTP method badges.
- **Test before adding a part:** a second Nanostack product would use it unchanged, and its names, props and variants carry no product vocabulary (flow, node, run, runner, worker, request, HTTP method, variable template). A part that fails either test stays in its app. Promote a part from an app only when a second product needs it, renamed to neutral vocabulary.
- The public contract below binds library components; a product visual follows its app's rules. A library part that wraps an engine (Base UI, CodeMirror, TanStack Table and Virtual, cmdk) exposes neutral data and behavior types; apps own fetching, permissions, pagination and mutation success, and the library owns rendered anatomy, keyboard interaction, measurement, theme portals and CSS.

## Public contract

- Components **never accept consumer CSS**. Derive DOM props through `ElementProps`, or omit `keyof NoCustomStyle` from Base UI props and intersect `NoCustomStyle`. Use `safeProps` at every DOM/Base UI forwarding boundary for untyped consumers. Styling aliases, replacement/slot objects and internal CSS state attributes stay private; the authoritative forbidden keys live in `src/internal/props.ts`. Add negative type tests for new bypasses.
- Variations use closed semantic unions. A new variation starts with a real consumer use case, is implemented centrally, and is demonstrated in the playground. Layout comes from Stack, Cluster, Grid, Surface and block parts.
- Compose children and named parts rather than adding page-sized configuration objects. Shared blocks have no API clients, auth providers, router dependencies, domain enums, or application strings.
- Applications assemble exported library parts. A missing common element becomes a primitive or block here; a product visual or arrangement stays in the application. Applications never restyle a library component: no class, selector or token override reaches library markup, including child and named-part content that a library part renders.
- React refs are props. Preserve native accessibility attributes and event handlers. Interaction belongs to Base UI; simple semantics belong to native HTML. Each new complex control must preserve keyboard behavior and focus return.
- Theme is a finite combination of brand, color scheme, and density. Overlays must inherit its scope through portals. CSS selectors are namespaced; importing the library must not reset the host app or change its global theme.
- `src/styles.css` is the shared stylesheet entry; tokens and imported style modules stay in this repository. Package and generated registry output share the canonical implementation. Export every public component subpath from `src/index.ts` so the complete catalog passes the automatic prop contract. New source modules use `.js` relative specifiers so emitted ESM runs outside Vite.

## Validation boundaries

`pnpm check` fails when the committed registry differs from the source, then checks lint, types (including rejected props), behavior, package build, and documentation build. `pnpm test:browser` checks actual CSS, keyboard interactions, accessibility scans and responsive overflow. Packaging or exports changes additionally require `pnpm test:package` against the packed artifact and a consumer build. Consumer assembly checks include production code and stories. `pnpm registry:build` regenerates installable recipes; commit its output and do not hand-edit it.

Test what a person can observe. Include disabled, pending, empty, failed, long-content, touch, keyboard and dark states when applicable. Axe is one check, not a conformance claim. Token changes require contrast checks and both-theme screenshots. Capture images locally in `.ui-craft/` and attach them to PRs, never commit them.

## Evolution

Beta APIs may change only with a changelog entry and an upgrade example. Keep additive changes small; extract a block only after a second product's composition proves its boundary. A consumer needing a visual exception brings the variant back here. Preserve React peer compatibility with the installed consumer versions; using a newer hook requires raising the peer range and coordinating upgrades. Follow [the release procedure](docs/releasing.md) for public packages; applications pin exact versions and never carry patched copies.
