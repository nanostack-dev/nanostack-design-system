# 0004: Generate colour themes from palette inputs on one lightness ladder

Status: accepted, 2026-11-26. Ships in 0.4.0.

## Context

Alexis asked for a refreshed look that keeps the liquid glass and the shapes, with more themes that people choose themselves. A first proposal ("Deep Tide") set `--background` to the mid-tone page ground. Products read `bg-background` as the lightest control surface, so selected segments, outline buttons and table headers turned grey, and Alexis rejected it.

The tokens were hand-written per mode: about 80 values in `:root` and 80 in `.dark`. Adding four palettes with a high-contrast level each would mean 16 hand-written blocks, each needing its own contrast tuning, and a later change to one step (say, the border) would need 16 edits that stay in step.

## Decision

1. **A palette is a set of inputs.** Neutral hue and chroma, an accent per mode, three glow hues. `src/blocks/theme/palettes.json` holds them.
2. **One OKLCH lightness ladder per mode, plus a high-contrast delta.** `scripts/generate-themes.mjs` combines the ladder with each palette's inputs and writes literal `hsl()` values into a generated region of `src/styles.css`. The generated tokens ship as literal values: no runtime colour maths and no `oklch()` in consumers.
3. **The choices are attributes on `<html>`.** `data-ns-palette` and `data-ns-contrast`, written by `ThemeProvider` next to the existing `dark` class and stored under the provider's key. A palette attribute on any element re-themes its subtree.
4. **`--ground` is separate from `--background`.** The backdrop paints the ground; `--background` stays the lightest control surface, so fields and selected segments stand out from the page.
5. **The segmented control is a track and a thumb.** `ToggleGroup variant="outline"` and `TabsList` draw a translucent `--segment` track with a solid raised `--segment-thumb`. This changes the look of an existing variant, not the API.
6. **The picker is a block.** `ThemePicker` (popover) and `ThemeSettings` (inline) compose public components; the palette thumbnails are drawn with tokens.
7. **Tide is the default** and also answers to `:root` and `.dark`, so a product that sets no attribute keeps working.

## Alternatives

- **Hand-written blocks per palette.** Rejected: 16 blocks drift apart, and every ladder change becomes 16 edits.
- **`oklch()` and `color-mix()` at runtime from a few custom properties.** Fewer bytes, but the token and contrast checks would have to evaluate CSS colour functions, and `color-mix()` results differ slightly between engines. Literal values keep the checks exact.
- **A palette prop on each component.** Rejected for the same reason as a per-component glass prop ([ADR 0002](0002-glass-material-through-the-provider.md)): one screen could mix palettes.
- **A fifth "Porcelain" palette** (near-white, low chroma). Prototyped and left out at Alexis's request.

## Consequences

- `pnpm lint` fails when the generated region is stale, and the contrast check runs every pair in each palette, mode and contrast level.
- Status colours, info and `--chart-1..5` stay hand-written and shared by every palette, so their meaning does not change with the accent.
- A product that paints before React mounts reads the two new storage keys too.
- Products that styled against the old joined-border segmented look see the new track. The product API does not change.
