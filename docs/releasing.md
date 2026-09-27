# Release the public beta

Applications install an exact public package version. The first release is available as a GitHub release archive, so consumption does not depend on npm account setup. Once npm publishing is configured, its `beta` tag is a discovery channel, not a floating application dependency. Keep the version in `package.json`, the changelog and the Git tag aligned; never replace a reviewed archive or reuse a published version.

## Prepare and validate

1. Work in an isolated worktree. Bump the beta version, describe the consumer upgrade in `CHANGELOG.md`, and update the README install example. Component, token and variation changes follow the normal contribution checks.
2. Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test:browser` and `pnpm test:package`. Confirm generated registry files are unchanged after generation.
3. Pack the built output with `npm pack --ignore-scripts --pack-destination artifacts`. Inspect the archive: only `dist`, the package manifest, README, license and third-party notices belong in it. Test the packed package in the real consumer before publishing.
4. Merge the reviewed release change into `main`, then tag that exact commit as `v<package-version>`. The release workflow refuses a tag whose version differs from the manifest or whose commit is not on `main`.

## First npm publication

An npm account with write access to the `@nanostack` scope must bootstrap the first package. The package must already exist before npm can configure a trusted publisher. Use npm's interactive web login and account 2FA; do not put credentials in this repository or send them through a chat.

```sh
npm login --auth-type=web --registry https://registry.npmjs.org/
npm publish artifacts/nanostack-design-system-0.2.0-beta.3.tgz --access public --tag beta --ignore-scripts
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

Push the version tag, then explicitly run the workflow for that tag:

```sh
git push origin v<package-version>
gh workflow run release.yml --ref v<package-version>
```

The workflow validates the tagged source, tests the packed consumer, uploads the exact package artifact, publishes it publicly with the `beta` tag and provenance, and creates a GitHub prerelease with the same archive and SHA-256 checksum. It uses GitHub-hosted runners and npm 11.20.0 for OIDC support. Running it against a branch does not publish.

If npm publication succeeds but creation of the GitHub release fails, finish the GitHub release using that run's artifact; do not rerun publication or build a replacement. If npm has already accepted a version, publish a new version for any content change.

## Verify adoption

Query the public registry with `npm view @nanostack/design-system@<version> version dist.integrity dist.tarball`. Install that exact registry version into the consumer, commit its lockfile, and remove unused vendored archives. Run the application's assembly guard, lint, type checks and production build. Run affected interaction and accessibility checks whenever implementation bytes change.

Imports and the single stylesheet entry remain the same. All new presentation capabilities still belong to the library; publishing publicly does not permit local CSS, primitive copies, visual-engine imports or custom styling props in Echopoint or Anchor.
