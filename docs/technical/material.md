# Material

The design system owns the surface material of a product. A product chooses it once, on the root provider:

```tsx
<DesignSystemProvider linkComponent={RouterLink} material="glass">
  <App />
</DesignSystemProvider>
```

`solid` is the default. `glass` makes the chrome translucent over a brand-hued backdrop. [ADR 0002](../adr/0002-glass-material-through-the-provider.md) records why. Usage and every surface are in the Foundations/Glass material stories.

## How it works

- `DesignSystemProvider` puts the material in a context ([material.tsx](../../src/lib/material.tsx)). A nested provider without `material` inherits it.
- Each surface component spreads `useMaterialAttributes()` on the element that draws the surface: `data-ns-material="glass"`. Portal content keeps the attribute.
- [styles.css](../../src/styles.css) draws glass with unlayered rules keyed on `[data-slot='…'][data-ns-material='glass']`. They replace the solid fill of the Tailwind utilities.
- `Sidebar` without `material` follows the provider. An explicit `material="solid" | "frosted"` still wins.
- `AppShellHeader` measures its height and top gap into `--app-shell-header-offset` on its parent. `AppShellContent` (its start spacer) and `AppShellMain` (its top padding) start below the floating bar, so content scrolls under it.

## Surfaces and tokens

| Surface                                                                                 | Fill                                                     | Why                                   |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------- |
| App frame (`sidebar-wrapper`)                                                           | `--glass-backdrop` over `--background`                   | Glass needs something to show.        |
| Sidebar                                                                                 | `--glass-sheen`, `--glass-surface` (58% light, 62% dark) | Only the backdrop passes under it.    |
| Top bar, popover, menus, select, combobox, hover card, dialogs, sheets, drawers, toasts | `--glass-sheen`, `--glass-surface-overlay` (88% / 86%)   | Any content can pass under them.      |
| Card, stat card, data table frame, table outside a card                                 | `--glass-surface-strong` (84% / 86%)                     | Dense data stays as legible as solid. |
| Soft fields (input, select trigger, textarea, input group)                              | The soft fill made opaque over `--card`                  | The backdrop does not tint them.      |
| Dialog, sheet and drawer overlays                                                       | A lighter scrim with a 6 px blur                         | The glass frame stays visible behind. |

Blur and saturation: `--glass-blur` (24 px), `--glass-saturate` (180% light, 160% dark); data surfaces use two thirds of the blur and 140%. Edges: `--glass-edge`, `--glass-highlight`, `--glass-shadow`.

Each glass surface draws exactly one edge: its 1 px `border` in `--glass-edge`, at the outer edge, plus `--glass-highlight` as an inset light on the top row and `--glass-shadow` outside. Do not add a second line. A lighter border over a translucent fill (the background paints under the border), an `inset 0 0 0 1px` ring inside the border, or an outer `0 0 0 1px` ring beside a component's own border each show as a doubled curve, offset by 1 px, at the rounded corners. In light, `--glass-edge` is `--border-strong` at 75%, because a white edge vanishes on the near-white backdrop and leaves only the inner lines visible. 0.3.0 had that doubled edge; 0.3.1 fixed it, checked at zoom on the corners of the sidebar, top bar, cards and menus in Chromium 157.

## Contrast

Measured on Chromium renders at 1440 × 900, glass material, with the text inside the surface hidden and pixels next to controls excluded (focus rings and button shadows paint outside them). The worst background is the sampled pixel closest in luminance to the text colour. The `WorstCase` story scrolls a `bg-foreground` block (the darkest colour in light, the lightest in dark) under the top bar and opens a popover over it.

| Surface (story)                  | Light muted | Light primary | Dark muted | Dark primary |
| -------------------------------- | ----------- | ------------- | ---------- | ------------ |
| Top bar over content (WorstCase) | 4.74        | 4.64          | 5.00       | 8.27         |
| Popover over content (WorstCase) | 5.08        | 4.97          | 4.86       | 8.03         |
| Sidebar                          | 6.03        | 5.90          | 6.19       | 10.24        |
| Dropdown menu                    | 6.47        | 6.33          | 6.35       | 10.50        |
| Dialog                           | 6.15        | 6.01          | 5.91       | 9.77         |
| Alert dialog                     | 6.19        | 6.06          | 6.34       | 10.49        |
| Sheet                            | 6.13        | 5.99          | 5.95       | 9.84         |
| Toast                            | 6.37        | 6.23          | 6.31       | 10.44        |
| Stat card                        | 6.42        | 6.28          | 7.11       | 11.75        |
| Data table frame                 | 6.47        | 6.33          | 7.16       | 11.84        |
| Card                             | 6.36        | 6.22          | 7.11       | 11.75        |
| Table outside a card             | 6.47        | 6.33          | 7.17       | 11.85        |

The prototype's 58% top bar and 72% popovers measured 2.46 and 3.51 for light muted text over the same content. The `select` popup uses the dropdown-menu token and fill; its options cover the sampled area, so it has no separate row.

Repeat the measurement after a glass token change: start `pnpm storybook`, then run `node scripts/measure-glass-contrast.mjs`. It writes the screenshots and `contrast.json` to `.ui-craft/glass/` and prints one line per surface. `GLASS_CSS` tries other token values without editing `styles.css`. The axe check in `pnpm test` cannot see through `backdrop-filter`.

## Fallbacks

- No `backdrop-filter` support: chrome is `--sidebar` or `--popover`, data surfaces `--card`.
- `prefers-reduced-transparency: reduce`: the same solid fills, no blur. The backdrop tint stays.

## Known limitations

- A component without a stamped surface stays solid under glass: tooltip, navigation menu, menubar triggers. Tooltips are small and stay crisp on purpose.
- The materials do not nest the other way round: a `solid` provider inside a `glass` one changes only the surfaces it renders, not the backdrop of the frame.
- The top-bar offset is measured after layout. Server rendering without JavaScript shows the bar in flow, above the content.
