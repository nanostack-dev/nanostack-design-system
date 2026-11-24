# Component audit, November 2026

Status: **research**, 2026-11-24. Three read-only audits checked every component, block, layout part, the provider and the token layer against the official shadcn skill (`.claude/skills/shadcn/`), the upstream CLI output in `upstream/ui/`, AGENTS.md rules, WCAG 2.2 and the motion policy. A consumer audit of Anchor (nanostack-dev/anchor#422) supplied the first seven claims. [Maintenance practices](design-system-maintenance.md) covers process.

Contrast figures are flat-colour WCAG calculations on the token values in `src/styles.css`. Glass figures are estimates without blur or sheen; `node scripts/measure-glass-contrast.mjs` gives the measured values.

Status values: **fixed** (the follow-up fix PR), **deferred** (safe, not done yet), **decision** (changes the API, a product look or a repo rule; needs the owner).

## Summary

1. Upstream drift was small. shadcn moved from 4.21.0 to 4.23.0 and only dropped `"use client"`, which the owned files never carried. No upstream accessibility fix was lost.
2. The main defect is non-text contrast (WCAG 1.4.11). No token reaches 3:1 for a control edge: `--border` and `--input` are about 1.3:1, `--border-strong` about 1.6:1, on white and on the dark card. Unchecked Checkbox, Switch, RadioGroup, the Questionnaire indicator, InputOTP slots and the Slider thumb depend on them.
3. Focus indicators that use only `ring-ring/30` (1.60:1 light, 2.1:1 dark) are too faint where no solid border or outline goes with them.
4. Glass and motion coverage has holes: a slot override, missing material attributes and missing selectors leave some surfaces solid or static.
5. Rule 11 (worst-case stories) is mostly unmet: few stories are named `WorstCase`, and `Empty` and `One` stories are rare.

## Broken

| Finding                                                                                                                                                                | Evidence                                        | Status |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ |
| Dark `--chart-3` equals `--chart-1` (and `--primary`, `--success`): chart series 1 and 3 look the same in dark.                                                        | `src/styles.css` dark block                     | fixed  |
| `MenubarContent` and `MenubarSubContent` pass `data-slot="menubar-content"` into `MenuPopup`, which its own slot overrides: menubar popups get no glass and no motion. | `menubar.tsx:77,174`, `dropdown-menu.tsx:64-67` | fixed  |
| `MenubarTrigger` focus is only `bg-muted` (1.15:1): keyboard focus is nearly invisible.                                                                                | `menubar.tsx:66`                                | fixed  |
| NavigationMenu active link style keys on `data-[active=true]`, but Base UI writes `data-active=""`: the current page has no visual state (also upstream).              | `navigation-menu.tsx:136`                       | fixed  |

## Should fix

| Finding                                                                                                                                                  | Evidence                                                        | Status   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------- |
| Unchecked Checkbox, Switch, RadioGroup and Questionnaire indicator: `bg-input/90`, transparent border, 1.2–1.3:1.                                        | `checkbox.tsx:14`, `switch.tsx:14`, `radio-group.tsx:18`        | fixed    |
| InputOTP slot edge `border-input` 1.33:1; invalid needs `aria-invalid` on every slot by hand.                                                            | `input-otp.tsx:51`                                              | fixed    |
| Slider track and light thumb 1.29:1; focus looks like hover.                                                                                             | `slider.tsx:40,51`                                              | fixed    |
| SearchButton and Resizable grip use `border-border` / `bg-border` as their only edge.                                                                    | `search-button.tsx:14`, `resizable.tsx:37,40`                   | fixed    |
| Soft Input, Select, Textarea, ComboboxChips: the `bg-input/50` fill (1.15:1) is the only boundary; ghost has none.                                       | `input`, `select.tsx:42`, `textarea.tsx:10`, `combobox.tsx:226` | decision |
| Inactive TabsTrigger text `foreground/60` on `bg-muted` is 4.49:1 (light).                                                                               | `tabs.tsx:65`                                                   | fixed    |
| Focus is `ring-ring/30` alone on Toggle, TextLink, Accordion trigger and NavigationMenu trigger and link.                                                | `toggle.tsx:12`, `text-link.tsx:24`, `accordion.tsx:40`         | fixed    |
| Submenus (`dropdown-menu-sub-content`, `context-menu-sub-content`) are missing from the motion selectors and snap open.                                  | `styles.css` motion lists                                       | fixed    |
| NativeSelect, InputOTPSlot, QuestionnaireInput and the NavigationMenu popup carry no material attribute; they stay solid or backdrop-tinted under glass. | `src/lib/material.tsx`                                          | fixed    |
| `stat-card` is missing from the no-backdrop-filter and reduced-transparency fallbacks.                                                                   | `styles.css` fallbacks                                          | fixed    |
| `StatCardValue` uses `wrap-anywhere`, so "Not configured" breaks mid-word.                                                                               | `stat-card.tsx:69`                                              | fixed    |
| Scrolled content shows in the 12 px gap above the floating glass `AppShellHeader`.                                                                       | `styles.css:594-599`                                            | fixed    |
| `Empty variant="outline"` is a dashed border with no fill: about 1.04–1.22:1 under glass.                                                                | `empty.tsx:25`                                                  | fixed    |
| Sidebar `isActive` never sets `aria-current="page"`; Cmd/Ctrl+B fires inside inputs and editable content.                                                | `sidebar.tsx:163,516,617`                                       | fixed    |
| A nested `DesignSystemProvider` resets `linkComponent` to the plain anchor, so links in a nested subtree reload the page.                                | `design-system-provider.tsx:38`                                 | fixed    |
| Error toasts are announced politely.                                                                                                                     | `toast.tsx:63`                                                  | fixed    |
| Drawer content is `overflow-hidden` and the closed API removed the consumer scroll hook: long content is clipped.                                        | `drawer.tsx:157`                                                | fixed    |
| Chart `aria-label` sits on a generic `div` without a role.                                                                                               | `chart.tsx:78-84`                                               | deferred |
| Carousel buttons drop focus when they become disabled; a consumer `onClick` replaces the scroll handler.                                                 | `carousel.tsx:192,214`                                          | deferred |
| Command input lacks `data-slot="input-group-control"`; `CommandItem checked` is visual only.                                                             | `command.tsx:102,172`                                           | deferred |
| Item `ItemGroup` sets `role="list"` but `Item` never sets `listitem`.                                                                                    | `item.tsx:91`                                                   | deferred |
| Progress indeterminate renders an empty track.                                                                                                           | `progress.tsx:19-23`                                            | deferred |
| Calendar range middle and today use `bg-muted` (1.15:1); focused day ring 2.28:1.                                                                        | `calendar.tsx:40,184`                                           | deferred |
| InputGroup addon click focuses only an `input`, never a textarea; consumer `onClick` overrides it.                                                       | `input-group.tsx:96-100`                                        | deferred |
| TextLink brand colour differs from body text by colour only (2.81:1).                                                                                    | `text-link.tsx:24-25`                                           | decision |
| Theme toggle sets the class in `useEffect`: the wrong theme flashes on load.                                                                             | `theme.tsx:99-113`                                              | deferred |
| `prefers-contrast: more` only swaps the rim; it does not raise borders or make glass opaque.                                                             | `styles.css:769-775`                                            | deferred |

## API and vocabulary (decision, CHANGELOG entry needed)

| Finding                                                                                                                                           | Evidence                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| No link tabs: `TabsTrigger` omits `render`, so a section nav cannot be a router link. Proposal: a `TabsLink` part on `linkComponent`.             | `tabs.tsx:19`                                         |
| No flush Card: `py-(--card-spacing)` always applies. Proposal: `CardContent bleed` or a `padding` prop.                                           | `card.tsx:13,21-24`                                   |
| `render` stays open on triggers (SidebarMenuButton, SheetTrigger, TooltipTrigger, NavigationMenuTrigger) and cmdk parts keep `asChild`.           | `src/lib/closed-props.ts`, `command.tsx`              |
| Vocabulary drift: `Text`/`TableCell`/`Label` `tone="default"`, `DialogSize xl`, `DropdownMenuContent width sm/md`.                                | `text.tsx:7`, `dialog.tsx:12`, `dropdown-menu.tsx:16` |
| Hard-coded English accessible names: Sheet and Dialog "Close", toast "Close toast", mobile sidebar "Sidebar", DataTable pager, Breadcrumb "More". | several                                               |
| `StatCardValue` needs a text or status variant for non-numeric values.                                                                            | `stat-card.tsx`                                       |
| The email builder in products needs a fill-height content mode.                                                                                   | `app-shell.tsx`                                       |

## Cross-cutting patterns

1. **Control edge token.** One additive token at 3:1 or more fixes most non-text contrast rows. Do not darken `--border`, which also draws dividers.
2. **Focus indicators.** `ring-ring/30` is acceptable only with `border-ring` (Input, Item, outline Button). Borderless controls need a solid outline.
3. **Slot overrides.** A wrapper that passes `data-slot` into a shared part silently opts out of every `styles.css` rule keyed on that slot. Use a second attribute.
4. **Dead classes.** Many component `transition-[…]` classes are overridden by the motion policy, and some selectors are Radix-only (`data-[state=on]`, `data-[state=selected]`). Remove them only when the file changes for another reason, to keep `shadcn:update` merges small.
5. **Physical CSS.** `left`/`right`, `ml-*` and `rounded-l/r` break right-to-left layouts although a `DirectionProvider` ships. Mostly inherited from upstream.
6. **Stories (rule 11).** Add `WorstCase`, `Empty` and `One` stories when a component next changes.
