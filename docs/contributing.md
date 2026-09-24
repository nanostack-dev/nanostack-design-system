# Contributing

## Choose the correct layer

A foundation defines a shared visual decision. A primitive provides one interaction or semantic element. A block combines primitives into a reusable workflow structure. Applications own routes, requests, permissions, domain state, and product copy.

Before introducing an abstraction, demonstrate its use in a real consumer or documented example. Prefer a small composition of parts over a component whose many booleans select unrelated layouts. Keep state near its owner and expose conventional controlled/uncontrolled behavior only when consumers need it.

## Public API contract

Consumers customize through finite typed variants, named parts, children, behavior properties, and approved theme presets. Public APIs never expose `className`, `style`, `css`, `classNames`, `unstyled`, arbitrary CSS tokens, `render`, `asChild`, or a generic styling/slot-props object. Add a shared variant when a justified consumer requirement cannot be expressed today.

Derive internal adapter types from native or Base UI types, then explicitly exclude unsupported properties from exported types. Preserve relevant native semantics, refs, accessible names, events, and form attributes. Avoid `any`, broad index signatures, and casts that bypass the public contract. Arbitrary properties from JavaScript or spread objects must not silently reopen styling escape hatches; keep DOM forwarding deliberate and test it.

Separate appearance from behavior. A disabled control must have native disabled semantics, a selected navigation item must expose its current state, and a link must remain a link. Give icon-only controls accessible names. Keep Base UI's focus and keyboard behavior intact when wrapping it.

Tokens and stylesheet rules belong to this repository. Change token values alongside the representative compositions they affect. Product apps choose supported presets without reaching into internal selectors. This restriction governs supported APIs; it cannot prevent a host website from applying global CSS.

## Validate the change

Use the repository's package scripts as the executable source of truth. Run lint, type checking, component tests, package build, and docs build for a release candidate; run browser checks for changes to interaction, styling, or layout. Build and validate registry artifacts when exported source or dependency metadata changes.

Tests should prove user-visible guarantees:

- Type fixtures accept supported variants and reject custom CSS properties and invalid variants.
- Interaction tests query roles and names, exercise keyboard input, and assert observable state.
- Overlays test opening, Escape, focus placement, and return to the trigger. Forms test labels, descriptions, and errors.
- Browser checks cover narrow and wide layouts, both themes, empty/loading/error states, long labels, and overflow.
- Contrast checks cover the foreground/background pairs actually used. Axe scans cover representative composed pages.
- Consumer checks import the built package and stylesheet, rather than resolving directly to source. Registry checks verify declared files and dependencies.

Add a focused regression test for a real defect. Avoid snapshots that merely repeat component markup or assertions about private implementation details. Report which checks ran and which could not run; automated accessibility checks do not replace manual keyboard and assistive-technology assessment.

## Review visual changes

Capture before/after pairs using the same viewport, theme, and representative data. Include desktop and mobile when responsive behavior changes. Keep screenshots out of commits; attach review evidence to the PR using the workspace's frontend screenshot procedure. Review the affected blocks together so a token improvement does not silently worsen another component.

## Version and distribute deliberately

The initial `0.1.0-beta` line is an adoption pilot. Pin an exact beta release or commit in consumers; every beta can require coordinated migration. Record public API, visual, interaction, and token changes in release notes with a consumer action when needed.

After 1.0, compatible additions are minor releases, compatible fixes are patches, and removals or incompatible semantics are major releases. Visual changes need review even when TypeScript still compiles. Mark deprecated APIs, provide a replacement, and allow a documented migration period before removal.

Generate distribution artifacts from the canonical source. Verify the packed package and generated registry, then validate an affected consumer. Keep React as a peer dependency. The supported baseline is React 19.2; using a newer-only API requires changing that baseline and testing the upgrade explicitly.

Release acceptance requires reproducible checks, an accurate change record, and a usable consumer example. Follow the workspace's isolated-worktree and PR process. Keep the guide concise and put architectural rationale in [research.md](research.md).
