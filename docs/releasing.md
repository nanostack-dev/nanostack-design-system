# Release a public version

Applications install an exact public package version. npm tags are discovery channels, not floating application dependencies. GitHub releases also carry the same archive and checksum. Keep the version in `package.json`, the changelog and the Git tag aligned; never replace a reviewed archive or reuse a published version.

## Version numbers and npm tags

| Version | npm tag | GitHub release |
| --- | --- | --- |
| `X.Y.Z`, for example `0.0.1` | `latest` | Release |
| `X.Y.Z-beta.N`, for example `0.1.0-beta.1` | `beta` | Prerelease |

`scripts/release-identity.mjs` accepts only these two forms, and the release workflow publishes with the tag it chooses. `package.json` has no `publishConfig.tag`, so a manual `npm publish` of a stable version also goes to `latest`, and npm refuses a prerelease without an explicit `--tag`.

Numbering restarted at 0.0.1 for the first release of the common-only library. npm already holds 0.2.0-beta.3, which sorts above 0.0.1. Consumers pin exact versions, so the order does not change an install, but a caret range such as `^0.2.0-beta.3` never resolves to a 0.0.x release. The `beta` tag keeps naming 0.2.0-beta.3 until the next beta; remove it with `npm dist-tag rm @nanostackorg/design-system beta` if it should not be discovered.

## Prepare and validate

1. Work in an isolated worktree. Bump the version, describe the consumer upgrade in `CHANGELOG.md`, and update the README install example. Component, token and variation changes follow the normal contribution checks.
2. Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test:browser` and `pnpm test:package`. `pnpm check` fails when the committed registry differs from the source; run `pnpm registry:build` and commit its output.
3. Pack the built output with `npm pack --ignore-scripts --pack-destination artifacts`. Inspect the archive: only `dist`, the package manifest, README, license and third-party notices belong in it. Test the packed package in the real consumer before publishing.
4. Merge the reviewed release change into `main`, then tag that exact commit as `v<package-version>`. The release workflow refuses a tag whose version differs from the manifest, a version outside the two forms above, or a commit that is not on `main`.

## First npm publication

The package was bootstrapped with 0.2.0-beta.3; this section records how. An npm account with write access to the `@nanostackorg` scope must bootstrap the first package. The package must already exist before npm can configure a trusted publisher. Use npm's interactive web login and account 2FA; do not put credentials in this repository or send them through a chat.

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

Push the version tag, then explicitly run the workflow for that tag:

```sh
git push origin v<package-version>
gh workflow run release.yml --ref v<package-version>
```

The workflow validates the tagged source, tests the packed consumer, uploads the exact package artifact, publishes it publicly with provenance under the tag from the table above, and creates a GitHub release, or a prerelease for a beta, with the same archive and SHA-256 checksum. It uses GitHub-hosted runners and npm 11.20.0 for OIDC support. Running it against a branch does not publish.

If npm publication succeeds but creation of the GitHub release fails, finish the GitHub release using that run's artifact; do not rerun publication or build a replacement. If npm has already accepted a version, publish a new version for any content change.

## Verify adoption

Query the public registry with `npm view @nanostackorg/design-system@<version> version dist.integrity dist.tarball`. Install that exact registry version into the consumer, commit its lockfile, and remove unused vendored archives. Run the application's assembly guard, lint, type checks and production build. Run affected interaction and accessibility checks whenever implementation bytes change.

Imports and the single stylesheet entry remain the same. Publishing publicly does not relax the contract: applications never restyle a library component, copy a library primitive or pass styling props. Product-specific visuals follow the scope rule in `AGENTS.md`: they stay in their product, built from library tokens and primitives with CSS the product owns.
