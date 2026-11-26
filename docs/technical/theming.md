# Theming

A screen's colours come from three choices, each stored by `ThemeProvider` and written to `<html>`:

| Choice                 | Values                                        | Where it lives             |
| ---------------------- | --------------------------------------------- | -------------------------- |
| Mode                   | `light`, `dark`, `system`                     | `class="dark"` on `<html>` |
| Palette (colour theme) | `tide` (default), `lagoon`, `aurora`, `ember` | `data-ns-palette`          |
| Contrast level         | `standard` (default), `high`                  | `data-ns-contrast`         |

Every token follows them, so components need no theme prop. `ThemePicker` is the icon button that opens all three choices in a popover; `ThemeSettings` renders the same controls inline for a settings page. The decision and the alternatives: [ADR 0004](../adr/0004-themes-generated-from-palette-inputs.md).

## Palettes

| Palette | Neutrals             | Accent in light | Accent in dark |
| ------- | -------------------- | --------------- | -------------- |
| Tide    | slate blue           | cobalt          | lime           |
| Lagoon  | blue-green sea glass | teal            | aqua           |
| Aurora  | mauve                | violet          | lavender       |
| Ember   | warm sand            | burnt orange    | amber          |

A palette is a set of inputs, not a list of colours: the neutral hue and chroma, the accent per mode, and three glow hues for the glass backdrop. [`src/blocks/theme/palettes.json`](../../src/blocks/theme/palettes.json) holds them; [`palettes.ts`](../../src/blocks/theme/palettes.ts) holds the ids, labels and descriptions the picker shows.

## How the tokens are made

[`scripts/generate-themes.mjs`](../../scripts/generate-themes.mjs) applies one OKLCH lightness ladder per mode to each palette's inputs and writes literal `hsl()` values into the region of `src/styles.css` between `/* @generated themes:start */` and `/* @generated themes:end */`. One ladder means every palette has the same lightness steps, so a contrast ratio that passes in one palette is close in every other. Out-of-gamut colours keep their lightness and hue and lose chroma until they fit ([`scripts/lib/oklch.mjs`](../../scripts/lib/oklch.mjs)).

Each palette gets one block per mode and contrast level. A high-contrast block lists only the tokens the high ladder changes (more contrast for text, stronger borders and control edges, a deeper ground). The selectors live in [`scripts/lib/theme-selectors.mjs`](../../scripts/lib/theme-selectors.mjs), shared by the generator and the token checks:

- The default palette also answers to `:root` and `.dark`, so a page with no attribute is Tide.
- A palette set on any element re-themes its subtree in the current mode. The picker's previews use this.
- Status tokens (`--success`, `--warning`, `--destructive`, `--info`, with their foregrounds and tints), `--chart-1..5`, the radius and the glass blur, sheen and grain stay hand-written, shared by every palette. Info and chart colours carry meaning of their own: if they followed the accent, info would look like success in Tide dark and chart-1 would match chart-3 or chart-4 in Lagoon and Aurora.

Never edit the generated region by hand. Change the inputs or the ladder, then run `node scripts/generate-themes.mjs`. `pnpm lint` runs it with `--check` and fails when the region is stale.

## Tokens added with palettes

| Token                                                                      | Role                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--ground`                                                                 | The page ground the glass backdrop paints. It sits below `--background`, which stays the lightest control surface. A field or a selected segment on `bg-background` therefore stands out from the page, instead of turning grey. |
| `--segment`, `--segment-thumb`, `--segment-edge`, `--segment-thumb-shadow` | The segmented control: a translucent track, a solid raised thumb for the pressed item, the track's inner edge and the thumb's shadow. `ToggleGroup variant="outline"` and `TabsList` use them.                                   |
| `--control-edge-glass`                                                     | `--control-edge` inside a glass surface, where the backdrop shows through.                                                                                                                                                       |

## Adding a palette

1. Add its inputs to `palettes.json` and its id, label and description to `palettes.ts`, in the same order (`scripts/check-tokens.mjs` checks).
2. Run `node scripts/generate-themes.mjs`, then `pnpm lint`. `scripts/check-contrast.mjs` checks every pair in `contrast-pairs.json` in each palette, mode and contrast level.
3. Start `pnpm storybook` and run `PALETTES=<id> node scripts/measure-glass-contrast.mjs` for the glass surfaces.
4. Look at `Blocks/Theme/Palettes` and the picker stories in light and dark, and add the screenshots to the PR.

## Before the first paint

`ThemeProvider` applies the choices after React mounts. A product that should paint the first frame in the person's theme runs a small script in `index.html` that reads the same keys and sets the same class and attributes. The keys are the provider's `storageKey` (default `nanostack-theme`) plus `-palette` and `-contrast`.

## Contrast

`pnpm lint` checks 41 token pairs in 4 palettes × 2 modes × 2 contrast levels. Text pairs need 4.5:1 and edge pairs 3:1. Glass surfaces are measured from real renders per palette ([material](material.md#contrast)).

### Edges on the ground

In light, `--ground` sits just below `--border` on the ladder: `--border` is about 1.06:1 against `--ground` in every palette (1.45:1 in dark). An edge with nothing inside it disappears on the page ground. Two rules follow:

- A container on the ground draws a surface: a `Card`, an outline `Item` (it takes `--card`, or `--glass-surface-strong` under glass, since 0.4.1) or an outline `Empty`. A product does not draw a bordered list or card without a fill on the page.
- A divider on the ground uses `--border-strong` (about 1.29:1 in light, 1.86:1 in dark). The pair `border-strong on ground` (minimum 1.2) guards it. `--border` stays the divider inside a surface (1.32:1 on `--card`).

Raising `--border` instead would make every divider inside a card as heavy as the high-contrast level (about 1.5:1 on `--card`).

## Known limitations

- The operating system's "increase contrast" setting (`prefers-contrast: more`) makes the glass rims solid, but it does not switch to the high ladder. The high ladder is the person's choice in the picker.
- Product visuals with their own colours (a brand tile, a canvas, illustrations) do not follow the palette unless the product builds them from tokens.
