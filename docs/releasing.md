# Release the public beta

Applications install an exact public package version. The npm `beta` tag is a discovery channel, not a floating application dependency. GitHub releases also carry the same archive and checksum. Keep the version in `package.json`, the changelog and the Git tag aligned; never replace a reviewed archive or reuse a published version.

## Prepare and validate

1. Work in an isolated worktree. Bump the beta version, describe the consumer upgrade in `CHANGELOG.md`, and update the README install example. Component, token and variation changes follow the normal contribution checks.
2. Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test:browser` and `pnpm test:package`. Confirm generated registry files are unchanged after generation.
3. Pack the built output with `npm pack --ignore-scripts --pack-destination artifacts`. Inspect the archive: only `dist`, the package manifest, README, license and third-party notices belong in it. Test the packed package in the real consumer before publishing.
4. Merge the reviewed release change into `main`. Do not tag it by hand: the release workflow tags the merged commit.

## First npm publication

An npm account with write access to the `@nanostackorg` scope must bootstrap the first package. The package must already exist before npm can configure a trusted publisher. Use npm's interactive web login and account 2FA; do not put credentials in this repository or send them through a chat.

```sh
npm login --auth-type=web --registry https://registry.npmjs.org/
npm publish artifacts/nanostackorg-design-system-0.2.0-beta.3.tgz --access public --tag beta --ignore-scripts
```

Publish the same verified archive attached to the GitHub prerelease; do not rebuild it. The first local npm publication has no GitHub Actions provenance. Record the source commit and archive checksum in the GitHub prerelease. After publication, configure the package's npm trusted publisher:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization | `nanostack-dev` |
| Repository | `nanostack-design-system` |
| Workflow filename | `release.yml` |
| Environment | Empty |
| Allowed operation | Direct `npm publish` |

The setup is documented by [npm's trusted publisher guide](https://docs.npmjs.com/trusted-publishers/) and [npm trust prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/). This is a one-time account configuration; the repository does not need a long-lived npm publishing token.

## Subsequent releases

Releases are automatic. Every push to `main` runs `release.yml`:

1. `plan` reads the manifest version. If npm already has it, nothing is released. A prerelease version such as `0.2.0-beta.5` publishes to the `beta` dist-tag, a stable version to `latest`.
2. `verify` checks the manifest and the changelog entry, then runs `pnpm check`, the registry diff, `pnpm test:browser` and `pnpm test:package`, and packs the archive.
3. `publish` publishes that exact archive with npm trusted publishing and provenance.
4. `github-release` downloads the published archive from npm and creates the `v<package-version>` tag and GitHub release on the merged commit, with the archive, its SHA-256 checksum and the changelog notes. Prereleases are marked as such.

So a release is one reviewed pull request that bumps the version and adds the changelog entry. Merging it ships it. A merge that does not change the version only runs `plan`.

If publication succeeded but the GitHub release failed, rerun the workflow on `main` (`gh workflow run release.yml --ref main`): npm already has the version, so only the GitHub release runs. If npm has already accepted a version, publish a new version for any content change. The workflow refuses to publish when `v<package-version>` already points at another commit.

## Verify adoption

Query the public registry with `npm view @nanostackorg/design-system@<version> version dist.integrity dist.tarball`. Install that exact registry version into the consumer, commit its lockfile, and remove unused vendored archives. Run the application's assembly guard, lint, type checks and production build. Run affected interaction and accessibility checks whenever implementation bytes change.

Imports and the single stylesheet entry remain the same. All new presentation capabilities still belong to the library; publishing publicly does not permit local CSS, primitive copies, visual-engine imports or custom styling props in Echopoint or Anchor.
