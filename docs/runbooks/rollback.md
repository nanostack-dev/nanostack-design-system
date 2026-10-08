# Roll back a package upgrade

1. Identify the failing consumer release, its previous package version and any caller/API migration.
2. Restore the previous exact dependency and lockfile in the consumer and revert the matching caller changes. Run that application's typecheck, build and affected browser checks, then use its deployment rollback procedure.
3. Verify the affected UI at matching data, themes and viewports. A package pin alone does not restore deployed assets.
4. Repair or revert the library source through a new PR; publish a new version only after the user approves. Preserve already-published versions and tags so consumers remain reproducible.

For a bad Storybook publication, revert the offending source on `main` and let the Pages workflow rebuild; verify its output separately. Registry dist-tag changes, deprecation or unpublishing are explicit publishing actions requiring approval and are not a substitute for fixing consumers.

Capture the verified cause and recurring repair in documentation; write a postmortem for a significant incident.
