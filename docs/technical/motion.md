# Motion

The design system owns component motion. Products own navigation, first-run sequences and animations that explain product meaning. Components use CSS transitions and Base UI's starting/ending states so a reversal can retarget the current state.

## Timing and frequency

| Use                                           | Token                       | Default | Allowed range |
| --------------------------------------------- | --------------------------- | ------- | ------------- |
| Control feedback                              | `--motion-duration-micro`   | 120 ms  | 100–150 ms    |
| Tooltip, dropdown, popover, disclosure, toast | `--motion-duration-ui`      | 180 ms  | 150–250 ms    |
| Dialog, sheet, drawer                         | `--motion-duration-modal`   | 240 ms  | 200–300 ms    |
| Product page transition                       | `--motion-duration-page`    | 350 ms  | 300–400 ms    |
| Reduced motion                                | `--motion-duration-reduced` | 120 ms  | Opacity only  |

Routine UI stays below 300 ms. Entrances use `--ease-out`; drawers use `--ease-drawer`. Disclosures use the measured panel height and `--ease-in-out`, a deliberate layout exception. Reduced motion changes the height immediately and fades opacity only. Drawer dragging stays under Base UI's direct pointer control; settling takes at most the modal budget.

At 100+ encounters per day, omit motion. Response tabs, command palettes and their backdrops, live progress and sidebar layout already update immediately. Occasional tasks use standard motion. Reserve extra delight for rare, first-time experiences owned by the product. Never animate keyboard-initiated actions, including modified shortcuts.

## Provider policy

```tsx
<DesignSystemProvider linkComponent={RouterLink}>
  <App />
</DesignSystemProvider>

// An editor's repeated controls and pickers:
<DesignSystemProvider motion="none">
  <Editor />
</DesignSystemProvider>
```

`motion="auto"` is the default and follows `prefers-reduced-motion`. `motion="reduced"` removes animated travel and scale, keeping a 120 ms opacity cue. `motion="none"` makes changes immediate. An omitted preference inherits the nearest provider; an explicit nested preference affects only that subtree, including its React portals. `auto` cannot override a device's reduced-motion preference. No wrapper element or product CSS is needed.

Input observers are shared per document, registered in capture phase before component handlers, reference counted and removed when their last component/provider unmounts. Portals use the same document's keyboard/pointer policy. A keydown makes UI changes immediate; the next pointerdown restores the selected motion budget. Standalone library triggers/controls also register the observer. The private `data-ns-*` attributes are implementation details.

Reduced motion retains final geometry, including dialog centering and a switch's checked position, while removing interpolation of position, scale, size and shadow. Loading feedback remains visible and named; continuous decorative spinning and pulsing stop. Tooltip groups use Base UI's instant state to skip repeated entrances.

Do not delay removal of sensitive inputs with an exit animation. Products that conditionally replace credentials or forms should remove the outgoing interactive content immediately. Do not add stagger to everyday work or animate incoming live data.

## Examples and verification

The [Foundations/Motion stories](https://nanostack-dev.github.io/nanostack-design-system/?path=/docs/foundations-motion--docs) demonstrate pointer surfaces, keyboard/pointer switching, reduced motion, frequent use, rapid reversal, live controls, toast feedback, nested providers, immediate sidebar navigation and hostile long content. Play tests run in both themes with the catalog. The responsive motion command exercises the built Storybook in mobile, tablet and desktop Chromium, in both themes and with normal and reduced device motion.

Run `pnpm build-storybook && pnpm test:motion`. Add `-- --review` to the motion command for local screenshots and native-size videos under ignored `.ui-craft/motion-review/`. It uses an owned ephemeral HTTP port and closes the server and browser on completion. See [testing](../development/testing.md).
