# Contributing

## Choose the correct layer

A foundation defines a shared visual decision. A primitive provides one interaction or semantic element. A block combines primitives into a reusable workflow structure. Applications own routes, requests, permissions, domain state, product copy, assemblies of exported library parts, and the product-specific visuals that carry their meaning.

### Library scope

The library holds UI that any Nanostack product can use unchanged: primitives, layout, forms, overlays, navigation and the application shell, collections and tables, generic data display, a plain code editor and viewer, and theming. Before adding a part, answer two questions:

1. Would a second Nanostack product use it unchanged?
2. Are its names, props and variants free of product vocabulary, such as flow, node, run, runner, worker, request, HTTP method or variable template?

A part belongs here only when both answers are yes. Otherwise it stays in the product that owns its meaning. For example, Echopoint keeps its flow canvas and node parts, its Pebble runner avatars, fleet capacity tiles, request editors with `{{variables}}`, workbench panes and trees, run-history strips and timelines, its assistant conversation and its HTTP method badges.

Consult [the component catalog](components.md) before adding a part. Before introducing an abstraction, demonstrate its use in a real consumer or documented example. Prefer a small composition of parts over a component whose many booleans select unrelated layouts. Keep state near its owner and expose conventional controlled/uncontrolled behavior only when consumers need it.

### Assembly, product visual, or common component

An application assembly selects and composes existing parts, passes content and behavior, and chooses supported variants. It can be a React function, route, or feature module. Its JSX is made from library components and other such assemblies, with React fragments/providers for behavior. It adds no CSS to library parts and copies no library implementation. The same rule applies inside children, render callbacks and named content slots.

For example, an Echopoint run summary can combine `Section`, `SectionHeader`, `SectionTitle`, `SectionBody`, `ActivityList`, `ActivityItem` and `Badge`. The application maps its run status to a supported badge tone, supplies links and copy, and fetches the runs. It does not implement a second badge or attach CSS to a row.

A product visual is markup that only one product's meaning explains, such as an Echopoint flow node. It lives in that product's source tree, reads `--ns-*` tokens so it follows the theme, composes library primitives where they fit, and carries its own namespaced CSS. It restyles no library component and selects no library class.

When a composition needs a missing common capability, add the smallest primitive or block here and give it finite semantic variants. A generic progress indicator belongs here; an Echopoint hook that queries run progress, or a meter that shows runner capacity, belongs in Echopoint. Keep domain-aware data preparation outside the visual API.

Promote a product visual into the library only when a second product needs it. First remove its product vocabulary: a runner capacity tile becomes a neutral selectable tile with a meter, not a `WorkerTile`.

Consumers import the package's public entry point or documented subpaths and its stylesheet once. Generated registry sources are a distribution artifact of this repository, not a consumer customization surface. Change the canonical source and update the dependency when a new variant is needed.

## Contribution recipe

1. Write the consumer assembly with existing parts and identify the exact capability it lacks. Completion: the capability passes the [library scope](#library-scope) test, a second product's composition demonstrates the reusable boundary, and domain fetching and policy remain in the app.
2. Define the smallest public part and its finite semantic variations. Derive native/Base UI behavior types, apply `NoCustomStyle`, and preserve names, refs and events. Completion: supported examples type-check and unsupported styling/replacement props fail, including spread objects.
3. Implement the anatomy and any visual-engine adapter inside the library. Forward props through `safeProps`; add namespaced rules to a style module imported by `src/styles.css`; export the component from `src/index.ts`. Completion: one canonical source supplies both package and registry outputs, with no application dependency.
4. Exercise the interaction and visual states that changed. Completion: focused behavior/type tests and relevant browser checks prove labels, disabled/pending behavior, keyboard focus, portal theming, long content and responsive bounds. Test observable results instead of private CSS selectors.
5. Integrate the packed dependency into the consumer and update this catalog, the change record and any migration example. Completion: the consumer's assembly guard, type/build checks and affected interaction tests pass against the artifact, not a source alias.

If the requirement is merely a new arrangement of existing parts, stop at the application assembly. For example, mapping a monitor's status to `Badge` and placing `Progress` beside it needs no new library component. A reusable disclosure, measured virtual list, or new accessible input interaction belongs here. Product names are not variant names, and a visual that only one product explains stays in that product.

## Public API contract

Consumers customize appearance only through finite typed variants and approved theme presets. Named parts and children compose existing visual units; behavior properties carry events and state. Public APIs reject the styling and replacement keys defined by `NoCustomStyle`, including CSS aliases, generic slot bags, raw HTML and library-owned CSS attributes. Add a shared variant when a justified consumer requirement cannot be expressed today.

Derive internal adapter types from native or Base UI types, then explicitly exclude unsupported properties from exported types. Preserve relevant native semantics, refs, accessible names, events, and form attributes. Avoid `any`, broad index signatures, and casts that bypass the public contract. Arbitrary properties from JavaScript or spread objects must not silently reopen styling escape hatches; keep DOM forwarding deliberate and test it.

Separate appearance from behavior. A disabled control must have native disabled semantics, a selected navigation item must expose its current state, and a link must remain a link. Give icon-only controls accessible names. Keep Base UI's focus and keyboard behavior intact when wrapping it.

Tokens and stylesheet rules belong to this repository. Change token values alongside the representative compositions they affect. Product apps choose supported presets without reaching into internal selectors. A product visual may read `--ns-*` tokens; it never redefines them. Ordinary accessibility attributes, native events, form semantics, refs and consumer telemetry attributes remain available. `data-ns-*` and the library's CSS state attributes are implementation details and are stripped at forwarding boundaries.

The package contract is enforced in two layers: compile-time checks cover every public component's props (including structural spreads), and runtime forwarding removes forbidden keys from JavaScript callers. Consumer source checks enforce the assembly boundary. These are maintainability guarantees, not a sandbox: a host stylesheet, imperative DOM mutation through a ref, or arbitrary JSX children cannot be prevented by a React prop type. Enforce their ownership in application CI instead of claiming the library can isolate hostile host code.

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

Every release before 1.0 is a coordinated adoption period. Pin an exact release or commit in consumers; any 0.x release can require coordinated migration. Record public API, visual, interaction, and token changes in release notes with a consumer action when needed.

After 1.0, compatible additions are minor releases, compatible fixes are patches, and removals or incompatible semantics are major releases. Visual changes need review even when TypeScript still compiles. Mark deprecated APIs, provide a replacement, and allow a documented migration period before removal.

Generate distribution artifacts from the canonical source. Verify the packed package and generated registry, then validate an affected consumer. Keep React, and any package whose values consumers pass through public props such as Phosphor glyphs, as peer dependencies so the application owns one copy. The supported baseline is React 19.2; using a newer-only API requires changing that baseline and testing the upgrade explicitly.

Release acceptance requires reproducible checks, an accurate change record, and a usable consumer example. Follow the workspace's isolated-worktree and PR process. Keep the guide concise and put architectural rationale in [research.md](research.md).
