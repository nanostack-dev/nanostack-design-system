# Design system context

The design system owns visual primitives that Nanostack products can use unchanged. Products own their domain-specific meaning and composition.

## Language

**Component:** An owned UI primitive with a closed, typed public contract for content, behavior and supported variations.

**Variant:** The supported visual weight of a component, such as solid, soft, outline or ghost.

**Tone:** The semantic meaning of a component's appearance: neutral, brand, critical, success, warning or info.

**Layout block:** A primitive that arranges children and owns spacing, such as Stack, Inline, Columns or Spread.

**Block:** A reusable composition of public components that a second Nanostack product could use unchanged.

**Product component:** A component whose meaning belongs to one product, such as a flow step or run bar. Its public API remains closed even when its implementation uses Box.

**Design token:** A named visual role shared across components and themes, rather than a product's arbitrary styling value.

**Owned component:** Shadcn-origin source maintained directly by this repository after applying its public API and token conventions.

**Upstream merge base:** The untouched shadcn source snapshot used to merge later upstream changes into owned source.

**Story:** A maintained usage example and observable behavior test for a component or block.
