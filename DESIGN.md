# Design decisions

The accepted direction is a compact operating interface, inspired by Linear's hierarchy and Nanostack's restrained blue accent. Product work leads; navigation stays quiet. The showcase is documentation and uses explicit example data.

## Foundations

Neutral surfaces use a warm-white light canvas and a charcoal dark canvas. Semantic foreground/background pairs, separators, accent and state colors are scoped to a Theme. Brand and density are finite presets. The system font stack is deliberate for a cross-platform product library; consumers inherit consistent metrics without a font network dependency.

Spacing follows 4/8/12/16/24/32px. Control heights are 32/36px with a larger touch minimum under coarse pointers. Body text is 14px, metadata 12px, section headings 16px, page titles 28px. Numerals are tabular. Rounded corners are restrained: controls 6px and surfaces 12px.

## Composition

AppShell separates navigation, a compact context header and main content. PageHeader owns the page title and primary actions. Section groups related work with one title and optional action; it does not add another decorative card. ActivityList is a structured row list. Empty, error and loading states occupy the same region as ready content.

Mobile navigation is a focus-managed Base UI dialog. Main content becomes one column and retains the desktop order. Navigation and action labels remain explicit. Motion is limited to state feedback and honors reduced motion. All styling is library-owned; consumers select semantic variants, never CSS.
