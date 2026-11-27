# Effect UI entry (experimental)

Status: experiment on the `effect` branch. It is not released and is not part of the stable public API.

[Effect UI](https://ui.effect.website/) (`@effect/ui`, public preview, not on npm) is an Elm-architecture framework built on Effect. It renders views with `h` builders instead of React. Its kit (`@effect/ui-kit`) is headless and ships no styles. This branch lets a non-React app use the design system's look.

## Shape

- `src/recipes/`: the class recipes (cva variants and class strings) for button, card, dialog, heading, input, label, menu, sidebar menu button, table and text link. They import no React. The React components import them, so React and Effect UI share one source of class strings. Exported as `@nanostackorg/design-system/recipes`.
- `src/effect/`: Effect UI view functions (`Button`, `ButtonLink`, `Input`, `Label`, `FieldError`, `Heading`, `Text`, `TextLink`, `Card*`, `Table*`, `SidebarNavItem`, `AppShell`, `PageHeader`) and the dialog and menu recipes for styling `@effect/ui-kit` parts. Exported as `@nanostackorg/design-system/effect`. Each one returns the builder, so the caller chains `.on(...)`, `.attr(...)` and `.children(...)`.
- `@effect/ui` and `effect` are optional peer dependencies. `react` and `react-dom` became optional too, because an Effect UI consumer has neither.

There is no React context in Effect UI, so the material (`solid` or `glass`) is an option on each surface function, not provider state.

## Known limits

- `AppShell` is a fixed desktop sidebar. It has no collapse, rail, mobile sheet or keyboard shortcut.
- No icons: the Phosphor icons are React components.
- Only the components the Anchor spike needed exist. Overlays (dialog, menu) are styled kit parts, not closed components.
- `@effect/ui` and `@effect/ui-kit` are pinned to pkg.pr.new snapshot builds, so this entry cannot be published until Effect UI is on npm.

The consumer experiment and its findings are in Anchor's `anchor-ui-effect/README.md` on the `feat/effect-ui-spike` branch.
