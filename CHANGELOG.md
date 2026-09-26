# Changelog

## 0.2.0-beta.2

- Add capacity segments and selectable resource tiles with named parts and finite health states.
- WorkerAvatar gains a liquid Pebble variant with observed heartbeat freshness and activity signals; its robot variant remains available.

Upgrade: existing imports keep working. Choose `WorkerAvatar variant="pebble"` for capacity-sensitive resources and compose `ResourceTile` parts around product data. The Collections catalog demonstrates keyboard selection and resource health.

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
