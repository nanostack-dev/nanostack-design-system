# Light glass backdrops

Status: **decided**. Alexis picked C · Tide on 2026-11-17 after comparing the four options on localhost (Storybook, Echopoint and Anchor). 0.3.6 ships it as the light `--glass-backdrop` with the neutral grain; the other options and the preview switcher were removed. [Material](../technical/material.md) holds the current tokens and measurements.

## Problem

On the 0.3.5 glass preview, the light backdrop behind the floating sidebar, top bar and cards reads as a pastel mesh: blue and cyan glows top left and right, a violet and pink wash bottom left, faint blue grain. On a data-dense screen (Echopoint Home: 65 failing flows in red) the pastel competes with the data and gives the frame a pink cast.

## What well-regarded sources do

- **Apple, HIG Materials** ([materials](https://developer.apple.com/design/human-interface-guidelines/materials)). Liquid Glass is a layer for controls and navigation that floats above content; do not use it in the content layer, and use it sparingly. Use the _regular_ variant (blur plus luminosity adjustment) for components with a lot of text, such as sidebars and popovers; _clear_ glass only over visually rich media. Thicker, more opaque materials give better contrast for fine text. Our split (translucent chrome, near-opaque data surfaces) already follows this; the backdrop only has to give the chrome something to refract, not be decoration.
- **Nielsen Norman Group** ([Glassmorphism](https://www.nngroup.com/articles/glassmorphism/)). When you control what is behind a translucent component, use simple or single-colour backgrounds; busy backgrounds hurt readability. Check contrast against the real background, not a swatch. More blur helps.
- **Linear** ([Behind the latest design refresh](https://linear.app/now/behind-the-latest-design-refresh), [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)). Moved the default palettes away from a cool, blue-ish tint toward a less saturated, slightly warmer grey (too warm looks muddy), dimmed the sidebar so content leads, and limited how much accent colour enters the generated surfaces. "Structure should be felt not seen."
- **Vercel Geist** ([colors](https://vercel.com/geist/colors)). Background 1 is the default, "especially when color is being placed on top"; Background 2 is for subtle differentiation only. Neutral grounds, colour reserved for meaning.
- **shadcn-style glass kits** ([shadcn.io glass button](https://www.shadcn.io/button/glass-button), [glasscn-ui](https://github.com/itsjavi/glasscn-ui)). Light glass is milky white over the page; the colourful mesh is a marketing-page pattern, not a dashboard one.
- Stripe, Raycast and Arc have no primary-source write-up on their light backdrops. Stripe keeps its colourful mesh on marketing pages and a plain light grey in the Dashboard; Raycast and Arc let the user pick a theme or tint instead of shipping a busy default. These are observations, not sourced rules.

Common thread: in a work tool the light ground is near-neutral and low in chroma. Colour, if any, is one hue placed where the chrome sits, and the data area stays quiet so status colours (red, amber, green) carry the meaning.

## Options (light only, dark unchanged)

Each option was a token set under `:root:not(.dark)[data-ns-backdrop='…']` in the exploration build, switched by a floating preview control (both removed in 0.3.6). The options get a neutral grain; Mist and Paper also tint their shadows with their own hue instead of blue.

| Option           | Idea                                                                                | Backdrop                                                         |
| ---------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Current (0.3.5)  | Four-glow mesh: blue, violet, cyan, pink                                            | as released                                                      |
| A · Mist         | Cool neutral grey, one restrained blue light behind the page header (Linear, Geist) | grey 96.5% → 94%, one blue glow at 16%, top centre-left          |
| B · Paper        | Warm off-white, no hue, soft light from above                                       | warm grey 95% → 91.5%, white top highlight, warm shadows and rim |
| C · Tide         | One soft brand-blue wash from the top left, fading to neutral                       | 155° linear: blue 88% → 93% → neutral 96.5%                      |
| D · Mesh retuned | Same layout, no violet or pink, about half the chroma                               | blue, slate-blue and cyan glows at 30%, 20% and 14%              |

## Measured contrast (light, Chromium 1440 × 900)

`scripts/measure-glass-contrast.mjs` and `scripts/measure-glass-edge.mjs` on the exploration build, which took the option as a `BACKDROP` variable (removed with the options). Muted text, worst pixel. The floors are the 0.3.5 values.

| Surface                          | Current | A Mist | B Paper | C Tide | D Mesh |
| -------------------------------- | ------- | ------ | ------- | ------ | ------ |
| Top bar over content (WorstCase) | 4.90    | 5.02   | 5.03    | 4.90   | 4.90   |
| Popover over content             | 5.08    | 5.08   | 5.08    | 5.08   | 5.08   |
| Sidebar                          | 5.14    | 6.14   | 6.00    | 5.93   | 5.83   |
| Stat card (AppFrame)             | 6.29    | 6.36   | 6.37    | 6.24   | 6.30   |
| Data table frame (AppFrame)      | 6.35    | 6.40   | 6.36    | 6.29   | 6.35   |
| Card                             | 6.40    | 6.41   | 6.41    | 6.29   | 6.41   |

Every option keeps 4.5:1 for muted text everywhere. Tide's cards are 0.05 to 0.11 lower than current because the blue wash sits under the top cards; they stay above 6.2. Light edges (rim against outside, sides and bottom) stay in the 1.0 to 1.1 band of 0.3.5 for all options; Paper's darker ground raises its card-to-backdrop step from 1.19 to 1.24 at the sides and from 1.30 to 1.40 at the bottom. Dark mode measured unchanged (sidebar 5.82, data surfaces 6.75 to 6.83).

## Recommendation

**C · Tide.** It is the only option that keeps glass meaningful and still calms the data. The blue sits where the chrome is (sidebar, top bar), so the translucent surfaces have something to refract and still read as glass; the content area, where tables and red failure states live, is neutral. It removes the pink cast and uses one hue, which is what NN/g and Apple both point to.

A · Mist is the fallback if Alexis wants maximum calm: it is the Linear and Vercel answer and has the best sidebar contrast, but on it the glass sidebar looks almost like a plain white panel, so the material stops earning its cost. B · Paper turns cards cream and fights the blue primary and Echopoint's lime; reject it unless the brand moves warm. D · Mesh retuned is better than today but is still a mesh, with a grey-lavender corner that reads muddy; it treats the symptom, not the cause.

A product hue is possible later: Tide's hue could become a token that Echopoint and Anchor set beside `--app-shell-brand-tile`. Not done here.
