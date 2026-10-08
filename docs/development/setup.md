# Local setup

An independent clone includes the project rules and component procedures. Use [package.json](../../package.json) as the source for Node compatibility and the exact pnpm version. It currently declares Node `>=22.16.0` and pnpm `10.33.0`; CI verification uses Node 22, while publishing uses Node 24.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm storybook
```

Storybook runs on port 6006. On Linux, Chromium may also need host libraries; CI uses `pnpm exec playwright install --with-deps chromium`.

Keep dependencies in this clone so tooling resolves the locked shadcn version, rather than a parent checkout's installation. Build the package with `pnpm build`; build the static docs with `pnpm build-storybook`.

For component source updates, follow the committed [owned component procedure](../../.claude/skills/own-shadcn-component/SKILL.md). The local shadcn guidance and ADR take precedence over generic upstream examples that still accept open styling props. External workspace skills are optional.

## Agent clients

Codex, OpenCode and Grok Build read the local `AGENTS.md` directly. Claude Code loads it through the committed [.claude/settings.json](../../.claude/settings.json) SessionStart hook, which resolves the Git root and prints that guide using only Git and the shell. Start from this repository or a nested directory.

Approve repository trust through the client when required, and start a new session after changing hooks or installed skills so the client reloads them. Trust and login are developer-controlled. Keep personal overrides in ignored `.claude/settings.local.json`; no shared-workspace checkout or external skill installer is required.
