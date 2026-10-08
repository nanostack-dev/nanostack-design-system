# Publish the package and upgrade consumers

The user approves each npm publish. Preparing a PR does not authorize publishing. Storybook Pages and npm are separate outputs.

1. Prepare the package version, changelog section and an `Upgrade:` line for API changes. Run [all verification gates](../development/testing.md), including packed-package checks.
2. After the change is merged and publishing is approved, tag the reviewed `origin/main` commit as `v<version>`, push the new tag, and dispatch `gh workflow run release.yml --ref v<version>`.
3. The [release workflow](../../.github/workflows/release.yml) validates the tag/version identity, reruns verification, packs the tested output, records its checksum, publishes through npm trusted publishing and creates a GitHub release. Beta versions use the `beta` dist-tag; stable versions use `latest`.
4. Confirm the workflow, GitHub release and registry identity with `npm view @nanostackorg/design-system@<version> version dist.integrity`. Match the verified artifact before reporting publication complete.
5. Upgrade a consumer with its chosen exact version, review its lockfile, apply [migration instructions](../migration/0.2.0.md), and run its normal checks and browser tests. Deploy through that application's runbook.

Every push to `main` also runs the [Storybook Pages workflow](../../.github/workflows/pages.yml). Verify that workflow and the changed published page before claiming the docs site updated. A merged PR alone proves neither package publication nor consumer deployment.
