# Design system documentation

Start with [agent rules](../AGENTS.md), [canonical vocabulary](../CONTEXT.md) and [consumer installation](../README.md).

## System and decisions

- [Architecture](technical/architecture.md): ownership, public API, tokens, builds and consumer boundaries.
- [ADR index](adr/README.md) and [ADR 0001](adr/0001-own-shadcn-with-a-closed-api.md): owned shadcn source and the closed API.
- [0.2.0 migration](migration/0.2.0.md) and [changelog](../CHANGELOG.md).
- Component usage is maintained in colocated `src/**/*.stories.tsx` files and published [Storybook](https://nanostack-dev.github.io/nanostack-design-system/).
- [Owned component procedure](../.claude/skills/own-shadcn-component/SKILL.md) and [vendored shadcn guidance](../.claude/skills/shadcn/SKILL.md) are available in an independent clone.

## Development and operations

- [Setup](development/setup.md), [testing](development/testing.md), [troubleshooting](development/troubleshooting.md).
- [Package publishing and consumer upgrades](runbooks/deployment.md), [rollback](runbooks/rollback.md).

Add research or postmortem documents only when real findings or incidents warrant them. Keep component-specific usage beside its code and link it from this index when navigation needs it.
