# 0003: Let a product put its own mark in the brand slot

Status: accepted, 2026-11-16. Ships in 0.3.4. Supersedes the brand-slot consequence of [ADR 0002](0002-glass-material-through-the-provider.md).

## Context

0.3.0 made `AppShellBrand` always show the Nanostack mark next to the product name and removed its `icon` and `logo` props, so every product shared one brand slot. Anchor then got its own mark, drawn with the same construction as Echopoint's (rounded squares on a primary tile). Alexis decided that Anchor's sidebar shows the Anchor mark, while the design system's own stories and demos keep the Nanostack mark.

## Decision

`AppShellBrand` takes an optional `mark: ReactNode`: the product's own mark as a bare SVG in `currentColor`, with no tile. The slot treats it exactly like the Nanostack mark it replaces: it sizes the SVG to 32 px, colours it with the sidebar foreground on solid and puts it on the white-on-gradient app-icon tile under glass (0.3.3). Without `mark`, the slot shows the Nanostack mark. The slot keeps its size, link, tooltip and collapsed behavior whatever the mark is.

## Alternatives

- **Keep the Nanostack mark only.** Rejected: Anchor would have no place for its mark inside the app it names.
- **Show both marks.** Rejected: two marks in a 32 px slot read as noise, and the collapsed rail has room for one.
- **Bring back `icon` (a component) and `logo` (a node).** Rejected: one prop covers both, and a product passes a node in either case.
- **Let the product pass its own icon tile.** Rejected: under glass the slot already draws an app-icon tile, so a product tile would sit inside a second tile, and products would each restyle the slot.

## Consequences

- Products upgrading to 0.3.4 keep the Nanostack mark until they pass `mark`. No caller change is needed.
- A product mark is a bare SVG that draws in `currentColor` and reads at 32 px (Anchor passes `AnchorLogo`, not `AnchorIcon`). The glass tile's gradient is the design system's, not the product's primary colour.
- The stories show the default Nanostack mark; `Blocks/App Shell/Product Mark` shows a product mark.
