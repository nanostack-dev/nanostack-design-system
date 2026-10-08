# Development troubleshooting

## Fresh clone resolves a parent shadcn installation

Install with `pnpm install --frozen-lockfile` in this repository before invoking tooling. A parent `node_modules` can otherwise supply a version different from the lockfile. Confirm the resolved tool with `pnpm exec shadcn --version`, then rerun the component update/check procedure.

## Consumer styles are missing

Verify the consumer imports Tailwind before library CSS and that its `@source` points at the installed library `dist`, relative to the CSS file. Run the consumer build and verify the affected component in the browser. The [installation guide](../../README.md#install) and packed-package tests own this contract.

## Router links behave like ordinary anchors

Supply the consumer router adapter through `DesignSystemProvider linkComponent={RouterLink}`. The default intentionally renders anchors. Verify navigation, keyboard activation and tooltip behavior in the consuming app; do not hard-code an application router into the library.

## Browser tests cannot find Chromium

Run `pnpm exec playwright install chromium`; on a Linux host missing system libraries, use the host-appropriate `--with-deps` installation. Rerun the affected story and confirm both theme projects execute. Report browser/sandbox failures as verification limits rather than passing checks.

## Package release identity fails

The tag must be `v` followed by the exact package version, and the release commit must be reachable from `origin/main`. The changelog must contain that version and nonempty notes. Follow [publishing](../runbooks/deployment.md); fix identity in a reviewed source change instead of moving a published tag.
