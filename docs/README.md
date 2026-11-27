# Design system documentation

Start with [agent rules](../AGENTS.md), [canonical vocabulary](../CONTEXT.md) and [consumer installation](../README.md).

## System and decisions

- [Motion policy](technical/motion.md): timing, frequency, keyboard input, reduced motion and provider inheritance.
- [Material](technical/material.md): the solid and glass materials, which surfaces are glass, measured contrast and fallbacks. [Light glass backdrops](research/light-glass-backdrops.md) records why the light backdrop is one blue wash (decided).
- [Theming](technical/theming.md): palettes, contrast levels, the theme generator and the theme picker.
- [Effect UI entry](technical/effect-ui.md): experimental Effect UI view functions and the framework-neutral class recipes they share with React (`effect` branch only).
- [Architecture](technical/architecture.md): ownership, public API, tokens, builds and consumer boundaries.
- [ADR index](adr/README.md), [ADR 0001](adr/0001-own-shadcn-with-a-closed-api.md): owned shadcn source and the closed API, [ADR 0002](adr/0002-glass-material-through-the-provider.md): glass as a provider material, and [ADR 0004](adr/0004-themes-generated-from-palette-inputs.md): themes generated from palette inputs.
- [0.2.0 migration](migration/0.2.0.md) and [changelog](../CHANGELOG.md).
- [Design system maintenance practices](research/design-system-maintenance.md) (research, 2026-11) compares 20 published sources with this repository. [Component audit, November 2026](research/component-audit-2026-11.md) lists every finding from the full component review and its status.
- [Versioning and deprecation proposal](research/versioning-and-deprecation-proposal.md) (proposal, needs an owner decision): public API, 0.x rules, 1.0 criteria, the deprecation path and the screenshot baseline question.
- Component usage is maintained in colocated `src/**/*.stories.tsx` files and published [Storybook](https://nanostack-dev.github.io/nanostack-design-system/).
- [Owned component procedure](../.claude/skills/own-shadcn-component/SKILL.md) and [vendored shadcn guidance](../.claude/skills/shadcn/SKILL.md) are available in an independent clone.

## Development and operations

- [Setup](development/setup.md), [testing](development/testing.md), [troubleshooting](development/troubleshooting.md).
- Maintenance checks: [token lock and contrast pairs](development/testing.md#token-and-contrast-checks) (`scripts/check-tokens.mjs`, `scripts/check-contrast.mjs`, `scripts/generate-themes.mjs --check`, run by `pnpm lint`) and [upstream drift](development/testing.md#upstream-drift) (`pnpm shadcn:update --check`, weekly workflow).
- [Package publishing and consumer upgrades](runbooks/deployment.md), [rollback](runbooks/rollback.md).

Add research or postmortem documents only when real findings or incidents warrant them. Keep component-specific usage beside its code and link it from this index when navigation needs it.
