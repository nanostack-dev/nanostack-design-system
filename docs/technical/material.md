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
- `AppShellHeader` measures its height and top gap into `--app-shell-header-offset` on its parent. `AppShellContent` (its start spacer) and `AppShellMain` (its top padding) start below the floating bar, so content scrolls under it. A strip of the page backdrop (`::before`, 0.75rem high) fills the gap above the bar, so scrolled content does not show between the bar and the top edge.

## Surfaces and tokens

| Surface                                                                                                                     | Fill                                                                                                                                                                                                    | Why                                               |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| App frame (`sidebar-wrapper`)                                                                                               | `--glass-grain`, `--glass-backdrop` over `--background`                                                                                                                                                 | Glass needs something to show.                    |
| Sidebar                                                                                                                     | `--glass-sidebar-sheen`, `--glass-surface` (34% light, 50% dark), blur `--glass-sidebar-blur`, saturation `--glass-sidebar-saturate`, rim `--glass-sidebar-rim`, inner edge `--glass-sidebar-thickness` | Only the backdrop passes under it.                |
| Top bar, popover, menus and submenus, select, combobox, hover card, navigation menu popup, dialogs, sheets, drawers, toasts | `--glass-sheen`, `--glass-surface-overlay` (88% / 86%)                                                                                                                                                  | Any content can pass under them.                  |
| Card, stat card, data table frame, table outside a card                                                                     | `--glass-surface-strong` (84% / 88%)                                                                                                                                                                    | Dense data stays as legible as solid.             |
| Soft fields (input, select trigger, textarea, input group, native select, OTP slot, questionnaire input)                    | The soft fill made opaque over `--card`                                                                                                                                                                 | The backdrop does not tint them.                  |
| Outline `Empty`                                                                                                             | `--glass-surface-strong` under its dashed edge                                                                                                                                                          | The dashed edge alone disappears on the backdrop. |
| Dialog, sheet and drawer overlays                                                                                           | A lighter scrim with a 6 px blur                                                                                                                                                                        | The glass frame stays visible behind.             |

Control edge under glass: inside a glass surface `--control-edge` is stronger (light `hsl(218 12% 48%)`, dark `hsl(222 20% 54%)`). The solid values reach 3:1 on the opaque tokens (`node scripts/check-contrast.mjs`) but only 2.7:1 (light) and 2.35:1 (dark) against the worst backdrop pixel seen through the sidebar and popups. The glass values give 3.37:1 and 3.13:1 there. `check-contrast` does not cover glass; recheck with a pixel sample when a glass surface token changes.

Blur and saturation: `--glass-blur` (24 px), `--glass-saturate` (180% light, 160% dark); data surfaces use two thirds of the blur and 140%.

The light backdrop is one soft brand-blue wash: a 155° linear gradient from `hsl(214 75% 88%)` at the top left, under the sidebar and the top bar, to a neutral `hsl(220 30% 96.5%)` from 60%, where the data sits. The glass chrome still has colour to refract, and the content area stays quiet so status colours carry the meaning. 0.3.6 replaced the 0.3.3 mesh of four glows (blue, violet, cyan, pink), which competed with dense data and gave the frame a pink cast; [the research note](../research/light-glass-backdrops.md) records the four candidates and why Tide won. The dark backdrop keeps the four-glow mesh at low strength. `--glass-grain` sits on top: an SVG noise tile, neutral grey at about 4.5% in light and white at 5% in dark, that removes gradient banding.

Edges and depth:

- The sidebar, the top bar, cards, stat cards and data table frames have no border. Their edge is the rim: a 1 px `::after` line on the inside edge in `--glass-rim`, bright on top where light catches the pane and fading to a soft shade at the bottom. In dark a data surface stands out by its lighter fill (`--glass-surface-strong`); the rim is 34% white on top and 14% then 12% lower down, about 1.7:1 against the backdrop at the sides and bottom (see Edge visibility). It is the only line, so no doubled curve shows at the rounded corners (0.3.0 drew a border plus an inset ring; 0.3.1 kept only the border; 0.3.3 replaces the border with the rim).
- Shadows are stacked and tinted with the backdrop hue instead of one grey blur: `--glass-shadow` for the chrome (four layers) and `--glass-shadow-raised` for data surfaces (three layers, less spread).
- Popups, dialogs, sheets and toasts keep their 1 px border in `--glass-edge`, `--glass-highlight` as an inset light on the top row and `--glass-shadow`.
- Glass cards, stat cards and data table frames share one radius, `--radius-3xl`, so product panels and cards match.

Brand tile on glass: `AppShellBrand` draws its mark on an app-icon tile. A product tints it by setting `--app-shell-brand-tile` (a colour or gradient) and `--app-shell-brand-tile-foreground` (the mark colour) per theme in its own stylesheet; the shape, the top sheen and the shadow stay shared, and the default is the Nanostack gradient with a white mark. Keep the mark at 3:1 or more against the tile (the `ProductTint` stories check Echopoint's blue with white, 6.38:1, and lime with night, 12.43:1). In the collapsed rail the tile is the whole 32 px button.

Sidebar navigation on glass: a `SidebarMenuButton` label uses the sidebar foreground at 82%; hover fills it with `--glass-item-hover`; the current page sits on a lens (`--glass-item-active`, a bright gradient, and `--glass-item-active-shadow`: lit top edge, inner rim, primary glow) with its icon in `--primary`. A `SidebarMenuSubButton` follows the same rules, so the current sub-page gets the pill. A parent `SidebarMenuButton` marked current because one of its sub-pages is (so the collapsed rail still shows the section) drops its pill while its sub-menu shows and keeps a full-strength label; collapsed to icons, it keeps the pill. Before 0.3.8 the current sub-page fell back to the solid `--sidebar-accent` fill (97% white in light), which did not show on the glass. A product that draws its own navigation link matches these tokens. A control resting on the sidebar glass, such as a scope switcher pill, uses `--glass-chip` and `--glass-chip-shadow` at rest and the lens tokens when open.

The liquid sidebar (0.3.8): the sidebar pane is thinner than the other chrome (34% white in light, 50% night in dark) with 30 px blur, its own rim lit at the top-left corner and an inner edge that gives it thickness. The light `--glass-backdrop` adds blue light behind the sidebar column only (three soft radial glows at the left edge), so the thin glass has colour to carry; the area under the data keeps the neutral Tide ground. The top bar, popups and data surfaces keep the shared tokens.

The `AppShellBrand` mark (the Nanostack mark, or the product mark passed as `mark`) sits on an app-icon tile under glass: a blue-to-violet gradient with a top sheen and a white mark. The solid logo then reads as a different kind of object from the line icons of the navigation.

Do not add a second line to a glass surface. A lighter border over a translucent fill (the background paints under the border), an `inset 0 0 0 1px` ring inside the border, or an outer `0 0 0 1px` ring beside a component's own border each show as a doubled curve, offset by 1 px, at the rounded corners.

## Contrast

Measured on Chromium renders at 1440 × 900, glass material, with the text inside the surface hidden, pixels next to controls excluded (focus rings and button shadows paint outside them) and pixels within 2 px of a separator line excluded (a table row border is not a background text sits on; 0.3.3 removed a frame border, which moved the rows onto the sample grid and read the 1 px row lines as a 4.84 background). The worst background is the sampled pixel closest in luminance to the text colour. The `WorstCase` story scrolls a `bg-foreground` block (the darkest colour in light, the lightest in dark) under the top bar and opens a popover over it.

Tide, 0.4.0:

| Surface (story)                  | Light muted | Light primary | Dark muted | Dark primary |
| -------------------------------- | ----------- | ------------- | ---------- | ------------ |
| Top bar over content (WorstCase) | 5.35        | 4.93          | 5.64       | 8.17         |
| Popover over content (WorstCase) | 5.55        | 5.11          | 5.40       | 7.82         |
| Sidebar                          | 5.24        | 4.83          | 5.43       | 7.87         |
| Dropdown menu                    | 6.63        | 6.11          | 6.67       | 9.66         |
| Dialog                           | 6.47        | 5.96          | 6.56       | 9.50         |
| Alert dialog                     | 6.51        | 6.00          | 6.58       | 9.54         |
| Sheet                            | 6.45        | 5.95          | 6.22       | 9.00         |
| Toast                            | 6.62        | 6.10          | 6.75       | 9.78         |
| Stat card                        | 6.63        | 6.11          | 7.58       | 10.98        |
| Data table frame                 | 6.63        | 6.11          | 7.65       | 11.09        |
| Card                             | 6.68        | 6.15          | 7.64       | 11.08        |
| Table outside a card             | 6.69        | 6.17          | 7.71       | 11.17        |

The lowest reading of each palette ([theming](theming.md)), over every surface above:

| Palette | Light muted  | Light primary | Dark muted   | Dark primary |
| ------- | ------------ | ------------- | ------------ | ------------ |
| Tide    | 5.24 sidebar | 4.83 sidebar  | 5.40 popover | 7.82 popover |
| Lagoon  | 5.31 top bar | 5.14 top bar  | 5.39 sidebar | 6.84 sidebar |
| Aurora  | 5.21 sidebar | 4.96 sidebar  | 5.40 popover | 5.93 popover |
| Ember   | 5.06 sidebar | 4.71 sidebar  | 5.41 popover | 5.89 popover |

0.4.0 tints the neutrals with the palette hue and lifts the dark card and muted steps, so most readings rose from 0.3.8. The light sidebar stays the tightest surface: its worst pixel sits over the brightest backdrop glow. Keep every palette at 4.5 or more when tuning the sidebar surface, the backdrop glows or a palette's accent.

The prototype's 58% top bar and 72% popovers measured 2.46 and 3.51 for light muted text over the same content. The `select` popup uses the dropdown-menu token and fill; its options cover the sampled area, so it has no separate row.

Repeat the measurement after a glass token or palette change: start `pnpm storybook`, then run `node scripts/measure-glass-contrast.mjs`. It measures every palette (`PALETTES=tide,ember` limits them), writes the screenshots and `contrast.json` to `.ui-craft/glass/` and prints one line per palette, mode and surface. `GLASS_CSS` tries other token values without editing `styles.css`. The axe check in `pnpm test` cannot see through `backdrop-filter`.

## Edge visibility

`node scripts/measure-glass-edge.mjs` (Storybook running) compares the rim pixel of each data surface with the backdrop 3 px outside it and the surface 4 px inside, at the top middle, both sides near the bottom and the bottom near the left corner. The aim in dark is a boundary that is seen but does not read as an outline: about 3:1 on top, where light catches the pane, and 1.6 to 1.8:1 at the sides and bottom, with the lighter fill doing the rest. A card is not a control, so WCAG 1.4.11 does not require 3:1 on its edge; 0.3.5 used that target and drew a white outline around every surface. Light mode separates its cards from the backdrop with the white surface and the tinted shadow instead, so its rim stays soft.

| Data surface, dark (rim : outside) | Top  | Right | Left | Bottom |
| ---------------------------------- | ---- | ----- | ---- | ------ |
| 0.3.4 stat card                    | 1.94 | 1.14  | 1.12 | 1.11   |
| 0.3.4 data table frame             | 1.94 | 1.15  | 1.15 | 1.11   |
| 0.3.4 card                         | 1.98 | 1.16  | 1.16 | 1.14   |
| 0.3.5 stat card                    | 5.09 | 3.47  | 3.32 | 3.43   |
| 0.3.5 data table frame             | 5.17 | 3.51  | 3.40 | 3.44   |
| 0.3.5 card                         | 5.26 | 3.55  | 3.57 | 3.56   |
| 0.3.7 stat card                    | 3.32 | 1.70  | 1.64 | 1.68   |
| 0.3.7 data table frame             | 3.38 | 1.70  | 1.68 | 1.67   |
| 0.3.7 card                         | 3.40 | 1.72  | 1.73 | 1.72   |

In 0.3.4 the dark rim faded to 7% and then 3% white, so the lower half of every dark card vanished against the backdrop: the bottom-left corner of an empty table could not be seen. 0.3.5 raised the rim to 36% white (3.3 to 3.6:1), which fixed that but read as a bright white border on every card, table and the sidebar. 0.3.7 lightens the dark fill and lowers the rim to 14% and 12%. The light rows stay soft by design: about 1.0 to 1.1 at the sides and bottom and 1.1 to 1.2 on top with the 0.3.6 backdrop, as with the 0.3.5 mesh.

## Fallbacks

- No `backdrop-filter` support: chrome is `--sidebar` or `--popover`; data surfaces (card, stat card, outline empty state, data table frame, table) are `--card`.
- `prefers-reduced-transparency: reduce`: the same solid fills, no blur. The backdrop tint stays.
- `prefers-contrast: more`: the rim is one solid line in `--border-strong`.

## Known limitations

- A component without a stamped surface stays solid under glass: tooltip, menubar triggers. Tooltips are small and stay crisp on purpose.
- The materials do not nest the other way round: a `solid` provider inside a `glass` one changes only the surfaces it renders, not the backdrop of the frame.
- The top-bar offset is measured after layout. Server rendering without JavaScript shows the bar in flow, above the content.
