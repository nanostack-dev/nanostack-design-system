# Changelog

## 0.2.0-beta.3

- Release under the MIT license and prepare public npm distribution with exact beta installs, public package metadata and a release workflow using npm trusted publishing.
- Keep all component implementations, stylesheet rules, exports and the closed variation contract unchanged from beta.2.

Upgrade: replace the vendored beta.2 dependency with `@nanostack/design-system@0.2.0-beta.3`, commit the regenerated lockfile and remove the unused archive. Existing imports and assemblies remain unchanged.

## 0.2.0-beta.2

- Add neutral graph presentation-store subscriptions and finite family/run-phase variants. Streamed changes update affected elements without rebuilding graph arrays; historical arrivals and reduced motion avoid replaying animations.
- Add compact node presentation parts and numeric timeline ranges for live activity and stored outcomes.
- Add capacity segments and selectable resource tiles. WorkerAvatar gains a liquid Pebble variant with observed heartbeat freshness and activity signals; its robot variant remains available.
- Preserve current Echopoint webhook-wait, choreographed execution and fleet behavior while keeping visual ownership in this library.

Upgrade: replace the beta package and keep existing imports. Use `WorkerAvatar variant="pebble"` for capacity-sensitive resources, compose `ResourceTile` parts around product data, and pass a neutral store through GraphCanvas's `presentation` prop when visual state updates independently of the document. Existing robot avatars and static graph models remain supported.

## 0.2.0-beta.1

- Extend the closed contract to native aliases, provider appearance bags, owned state attributes, typed spreads and untyped runtime callers. Text now uses the finite `display` option; element replacement is unsupported.
- Add named parts for forms, menus, collection rows, tables, inspectors, application shells, responsive panels, dialogs, navigation, notifications and identity widgets.
- Add library-owned code editors, source diffs, resizable workspaces, trees, graph geometry, connection controls, virtualized lists, duration charts and conversation logs. Applications retain domain data and callbacks.
- Publish an interactive catalog at `?catalog`, component recipes, contribution guidance and an Anchor adoption path. Preserve Anchor's light-only preset.
- Migrate Echopoint's full frontend and stories to library assemblies, with an enforced zero-override boundary. Remove local primitives, stylesheets and visual-engine dependencies.
- Expand keyboard, focus, async clipboard, controlled state, scroll anchoring, graph pointer, responsive, accessibility, type and packaged-consumer coverage.

## 0.1.0-beta.1

- Introduce a closed styling contract, scoped light/dark and brand presets, and comfortable/compact density.
- Add accessible Base UI controls, layout primitives and composable application blocks.
- Include a live playground, source research, automated behavior/type/browser/contrast/package checks, and a generated shadcn source registry.
- Prove the package in Echopoint's authenticated `/dashboard-beta` route; Anchor migration remains incremental and light-only.

Beta API changes require a new entry and a consumer upgrade example. No stable compatibility promise is made before 1.0.
