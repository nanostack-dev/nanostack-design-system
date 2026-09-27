# Research and design decisions

Verified against primary sources on September 24, 2026. Company practices below are evidence; Nanostack decisions are our application of that evidence, not claims that those companies use this implementation.

## The product contract

Nanostack provides compact, Linear-inspired building blocks for Anchor and Echopoint. The user's explicit requirement is stronger than ordinary shadcn customization: **consumers select typed variants and finite theme presets; they never supply custom CSS through component APIs.** Public components exclude `className`, `style`, `css`, `classNames`, `unstyled`, arbitrary token values, and `render`/`asChild` escape hatches. Appearance changes happen in this library and receive shared review and tests.

Composition remains flexible through named parts, children, semantic variants, and behavior properties. Routing, fetching, authorization, and product-specific text belong to applications. This is an API contract, not a browser CSS sandbox.

## Company evidence → decisions

### Airbnb: build a language from real screens

Airbnb's historical DLS account describes auditing existing experiences, establishing typography, colors, spacing, icons, and information architecture, then building reusable components with a common vocabulary. [Airbnb Design, Building a Visual Language](https://medium.com/airbnb-design/building-a-visual-language-behind-the-scenes-of-our-airbnb-design-system-224748775e4e).

**Decision:** start with the actual workspace shell and overview workflows in Echopoint and Anchor. Ship useful blocks with documented composition examples, rather than a speculative catalog. Foundations establish the grammar; components and blocks express it.

### Stripe: make accessible color systematic

Stripe used perceptual color models to generate consistent scales and predictable contrast relationships. Its lesson is to evaluate foreground/background pairs as a system instead of repeatedly repairing isolated components. [Stripe, Designing accessible color systems](https://stripe.com/blog/accessible-color-systems).

**Decision:** keep semantic surface, text, border, accent, and status tokens inside the library. Test the actual pairs used by components. A brand accent and a success state have distinct meanings. Use text or icons alongside status color.

### Linear: reduce competition for attention

Linear's 2024 redesign describes aliases for surfaces, text, icons, and controls, with perceptual color used for theme generation. Its March 2026 refresh reduces competing navigation emphasis, inconsistent header placement, excessive separators, and unnecessary icon treatment. Linear compared old and new interfaces behind feature flags. [Linear, 2024 redesign](https://linear.app/now/how-we-redesigned-the-linear-ui), [Linear, 2026 refresh](https://linear.app/now/behind-the-latest-design-refresh).

**Decision:** use quiet navigation, compact rhythm, restrained elevation, and predictable title/action placement. Keep content visually primary. Echopoint's beta route is the controlled adoption surface. Light/dark presets are library-owned; consumers cannot tune arbitrary contrast or color values.

### Atlassian: tokens and change governance

Atlassian describes tokens as the record of UI decisions. Its release phases distinguish experimental, beta, and generally available features; deprecation includes a replacement and migration communication. [Atlassian foundations](https://atlassian.design/foundations), [Atlassian release phases](https://atlassian.design/release-phases).

**Decision:** document beta maturity, public API changes, token changes, migration instructions, and consumer validation. A semantic token is more durable than a hardcoded product color. Stable components should not disappear without a replacement and announced migration period.

### Shopify: semantic choices and explicit composition

Current Polaris guidance uses semantic tone/variant properties, slots, and mobile-first responsive values. Shopify now uses Web Components; its previous React package is not the architecture to copy. [Current Polaris guidance](https://shopify.dev/docs/api/polaris/using-polaris-web-components).

**Decision:** borrow semantic variants and named composition areas, implemented with React and Base UI. Responsive defaults must work in a narrow container, not only a full desktop viewport.

## React, Base UI, and shadcn

React 19.3 is the latest stable release verified for this work. The library supports React 19.2 and later compatible 19.x releases so consumers can adopt it without an unrelated React upgrade; development uses 19.3. New 19.3-only APIs require raising and testing the peer minimum before library use. React 19 supports ref as a property, so new components do not need `forwardRef`. [React versions](https://react.dev/versions), [React 19.3 release](https://react.dev/blog/2026/09/09/react-19-3), [ref guidance](https://react.dev/reference/react/forwardRef).

Base UI supplies keyboard interactions, ARIA, and focus management; visible focus, labels, and contrast remain our responsibility. Its typed `.Props` interfaces help internal adapters. Public wrappers explicitly remove styling and element-replacement properties. Base UI's `render` mechanism may be used internally; it is not a consumer extension point. [Base UI accessibility](https://base-ui.com/react/overview/accessibility), [types](https://base-ui.com/react/handbook/typescript), [composition](https://base-ui.com/react/handbook/composition).

Since July 2026, shadcn defaults to Base UI for new projects. Its registry distributes code with declared files and dependencies; the schema supports `registry:base`, `registry:ui`, `registry:block`, and `registry:theme`. [shadcn announcement](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default), [registry schema](https://ui.shadcn.com/docs/registry/registry-item-json).

**Decision:** maintain one implementation source. Package exports provide shared upgrades; generated registry entries make blocks discoverable and installable. Registry distribution does not grant a supported CSS customization API. Consumer forks become locally maintained code and cannot claim the shared package's upgrade guarantees.

## Verification

Testing Library favors observable DOM behavior over implementation details. Playwright supports axe scans while explicitly recommending manual assessment and inclusive user testing too. [Testing Library principles](https://testing-library.com/docs/guiding-principles/), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).

**Decision:** test typed API rejection, keyboard behavior, accessible names, focus restoration, state variants, theme contrast, responsive layout, package consumption, and registry integrity. Use browser screenshots for composition regressions. Passing automated scans is evidence about detectable defects, not a declaration of full accessibility conformance.
