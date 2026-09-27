import assert from 'node:assert/strict';
import { appendFileSync, readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const release = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(-beta\.(?:0|[1-9]\d*))?$/.exec(
  manifest.version,
);

assert.equal(manifest.name, '@nanostackorg/design-system');
assert(release, `Version ${manifest.version} must be X.Y.Z or X.Y.Z-beta.N`);
assert.equal(process.env.GITHUB_REF_NAME, `v${manifest.version}`);
assert.notEqual(manifest.license, 'UNLICENSED');
assert.equal(manifest.publishConfig.access, 'public');
assert.equal(manifest.publishConfig.tag, undefined, 'The release workflow chooses the npm tag');

const prerelease = release[1] !== undefined;
appendFileSync(
  process.env.GITHUB_OUTPUT,
  `version=${manifest.version}\ndist_tag=${prerelease ? 'beta' : 'latest'}\nprerelease=${prerelease}\n`,
);
