# 0001: Own the shadcn code and close the component API

Status: accepted, 2026-09-28. Ships in 0.2.0.

## Context

0.1.0 kept the shadcn CLI output untouched in `src/components/ui/` and exported a thin wrapper for each component. Each wrapper reused the shadcn prop type, so every component accepted `className`, `style` and the shadcn variant names.

Echopoint, the first consumer, used that freedom. An audit of its 0.1.0 migration found 1,188 component uses, 371 with `className`, and 260 of those changed the look: 3 radii and 4 heights on `Button`, 3 heights on `Input`, and 185 `text-*` overrides. Same use case, different pixels.

A fix to a wrapper also had to fight the shadcn classes from outside. The destructive contrast fix in #29 overrode `text-destructive` through class merging.

Mature systems close the component API. Shopify Polaris and Twilio Paste do not accept `className` or `style`. Braid does not accept overrides on its high-level components, so that a design gap surfaces instead of a workaround, and it lets layout components own all spacing. React Spectrum and Braid keep one open, low-level layer for people who build new components.

## Decision

1. **We own the shadcn code.** Each component is one file, `src/components/<name>/<name>.tsx`, that starts from the shadcn CLI output and is edited in place. `src/components/ui/` is gone.
2. **The untouched upstream stays as a merge base.** `upstream/ui/<name>.tsx` holds the CLI output that the owned file started from, and `upstream/lock.json` records its hash. `pnpm shadcn:update <name>` fetches the new CLI output and runs a three-way merge (old upstream, new upstream, owned file). `upstream/` is never built or exported.
3. **Public components are closed.** An exported component takes typed props only: its variants, its content, its behaviour, `aria-*`, `data-*`, handlers and `ref`. It does not take `className` or `style`. The type check rejects them, and `pnpm test:package` checks every export.
4. **One vocabulary for variants.**
   - `variant`: visual weight. `solid`, `soft`, `outline`, `ghost`. A component offers only the ones it needs.
   - `tone`: meaning. `neutral`, `brand`, `critical`, `success`, `warning`, `info`.
   - `size`: `xs`, `sm`, `md`, `lg`. `md` is the default.
   - `width`: `auto` or `fill`, for controls that can stretch.
   - No shape, radius, colour or spacing props. The system chooses them.
     A new value needs two real uses in products, and a story that shows it.
5. **Layout owns spacing.** Components have no outer margin. `Stack`, `Inline`, `Columns` and `Spread` place children on the spacing scale (`none`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`).
6. **One open layer for builders.** `Box` accepts `className` and renders any element. It exists for a product component file that needs a look no component gives. Product ESLint allows `className` only in component definition files, only on host elements and `Box`, and only with design tokens.
7. **Internal composition uses internal parts.** An owned file may export an unexported-by-the-package part (for example `buttonStyles`) that other owned files import by path. `src/components/<name>/index.ts` exports only the closed public API, and the package exports only those barrels. Blocks import the public barrels, like a product does.
8. **Links go through a provider.** `DesignSystemProvider linkComponent={RouterLink}` makes `ButtonLink` and `TextLink` render the product's router link. The package does not depend on a router.

## Where a new component goes

1. A design-system component and variant covers it: use it.
2. Same use case, another look: request a variant (two real uses), or take the standard look.
3. A second product would use it unchanged: a design-system block.
4. Product meaning (a flow step, an HTTP method, a run bar): a product component. One feature: `src/features/<feature>/components/`. Two or more features: `src/components/<domain>/`.
5. A product component is closed too. It exposes typed variants, and `className` stays inside its own file.

## Consequences

- An upstream shadcn update is a merge, not an overwrite. Conflicts appear only where we changed the same lines.
- Every 0.1.0 wrapper changes its props. 0.2.0 is a breaking release with a codemod table in `CHANGELOG.md`.
- A product cannot fix a look locally. It asks for a variant, and the system owns the result.
