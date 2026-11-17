# 0002: Ship glass as an opt-in material, set on the provider

Status: accepted, 2026-11-16. Ships in 0.3.0.

## Context

Alexis approved a "liquid glass" look for Anchor after a prototype of the Product API keys screen: translucent, blurred chrome over a soft brand-hued backdrop, built on the design-system light tokens. Echopoint, which uses dark mode, should carry the same look, and both products should look like one family.

[ADR 0001](0001-own-shadcn-with-a-closed-api.md) closes the component API: a product passes no `className` or `style`, and Anchor's `check:ui` rejects restyling. A product cannot add glass to a sidebar or a popover itself. If glass exists, the design system draws it.

Glass also has a legibility cost. The prototype estimated 5.3:1 for muted text on its lightest glass, over the backdrop alone. In a real admin screen, tables, solid buttons and charts pass under a floating top bar and under popups, and a 58% white surface over dark content measured 2.5:1 for muted text.

## Decision

1. **Glass is a material of the whole product, chosen once.** `DesignSystemProvider material="glass" | "solid"`, default `solid`. A nested provider without `material` inherits it. There is no per-component glass prop.
2. **Each surface carries the material on its own element.** Components read the provider context and stamp `data-ns-material` on the element that draws the surface. Popups rendered in a portal keep the material, and a nested provider is exact. The glass rules live in `src/styles.css`, unlayered, keyed on `[data-slot][data-ns-material='glass']`, and use tokens only.
3. **Glass goes on chrome; data surfaces stay near-opaque.** Chrome: the sidebar, the `AppShellHeader` top bar, the popover, menu, select, combobox, hover-card and command popups, dialogs, alert dialogs, sheets, drawers and toasts. Data surfaces (`Card`, `StatCard`, `DataTable`, a `Table` outside a card, the form fields) take `--glass-surface-strong` (84%).
4. **Opacity follows what can pass under a surface.** The sidebar sees only the backdrop and keeps 58%. The top bar, popups, dialogs, sheets and toasts can sit over any content, so they take `--glass-surface-overlay`, set to the lowest opacity that keeps muted and primary text at 4.5:1 or more over the worst-case content: 88% in light, 86% in dark. The numbers come from real Chromium renders of the `WorstCase` story; [material](../technical/material.md) lists them.
5. **The frame paints the backdrop.** `AppShell` draws `--glass-backdrop` (primary blue, teal and violet radial tints) behind the app. Without it, glass is invisible.
6. **The top bar floats and the content scrolls under it.** `AppShellHeader` measures itself into `--app-shell-header-offset`; `AppShellContent` and `AppShellMain` start below it.
7. **Fallbacks are solid.** Without `backdrop-filter` support, or with `prefers-reduced-transparency: reduce`, every glass surface is the solid token colour. No SVG displacement or refraction.
8. **Tokens are additive.** Eleven `--glass-*` tokens, in light and dark. Nothing is renamed. The radii stay on the existing scale.

## Alternatives

- **A `glass` variant on each component.** Rejected: a product could mix materials on one screen, and every component would grow a prop that means the same thing.
- **A root attribute on `<html>`, set by the provider.** No per-component change, but a second provider (a Storybook comparison, an embedded preview) would overwrite the first. The per-element attribute costs one hook call per surface and stays exact.
- **Keep the prototype's 58% top bar and 72% popups.** Rejected on measurement: muted text fell to 2.5:1 and 3.5:1 over dark content.
- **A transparent top bar with a scroll-edge fade over the content.** It keeps more translucency but adds a mask that every scrolling region must carry. A later version can revisit it if 88% reads too solid.
- **The SVG-displacement "liquid" refraction.** Rejected: it is costly to render, it bends text behind it, and Safari and Firefox support differs.

## Consequences

- Products opt in with one prop. A product that does not opt in sees no change.
- `AppShellBrand` now always shows the Nanostack mark next to the product name; its `icon` and `logo` props are gone. This is the breaking part of 0.3.0. Superseded in 0.3.2 by [ADR 0003](0003-product-mark-in-the-brand-slot.md): a product may pass its own `mark`.
- A new surface component must stamp `data-ns-material` and add its selector to the glass rules, or it stays solid under glass.
- The top bar is close to opaque in practice. The glass reads mostly in the sidebar, the floating shapes, the sheen and the backdrop.
- Contrast on glass depends on what is behind it, so the axe check in the story suite does not prove it. A change to a glass token needs the real-render measurement again.
