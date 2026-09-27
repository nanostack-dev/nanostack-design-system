import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

const workflows = readdirSync('.github/workflows')
  .filter((name) => name.endsWith('.yml'))
  .map((name) => ({ name, text: readFileSync(`.github/workflows/${name}`, 'utf8') }));

function jobs(text: string) {
  const [, section = ''] = text.split(/^jobs:\n/m);
  return section.split(/^(?= {2}[\w-]+:\n)/m).map((job) => ({
    name: job.slice(0, job.indexOf(':')).trim(),
    body: job,
  }));
}

describe('GitHub workflows', () => {
  it.each(workflows)('$name pins every action to a commit with its release', ({ text }) => {
    const actions = [...text.matchAll(/^\s*(?:- )?uses: (.+)$/gm)].map(([, action]) => action!);
    expect(actions.length).toBeGreaterThan(0);
    for (const action of actions) {
      expect(action).toMatch(/^[\w.-]+\/[\w./-]+@[0-9a-f]{40} # v\d+\.\d+\.\d+$/);
    }
  });

  it.each(workflows)('$name bounds every job with a timeout', ({ text }) => {
    const unbounded = jobs(text)
      .filter((job) => !/^ {4}timeout-minutes: \d+$/m.test(job.body))
      .map((job) => job.name);
    expect(jobs(text).length).toBeGreaterThan(0);
    expect(unbounded).toEqual([]);
  });

  it('cancels superseded pull request runs but never a release', () => {
    const ci = workflows.find((workflow) => workflow.name === 'ci.yml')!.text;
    const release = workflows.find((workflow) => workflow.name === 'release.yml')!.text;
    expect(ci).toMatch(
      /^concurrency:\n {2}group: .+\n {2}cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}$/m,
    );
    expect(release).toMatch(/^concurrency:\n {2}group: .+\n {2}cancel-in-progress: false$/m);
  });

  it('deploys the documentation site from main and never cancels a deploy in progress', () => {
    const pages = workflows.find((workflow) => workflow.name === 'pages.yml')!.text;
    expect(pages).toMatch(/^on:\n {2}push:\n {4}branches: \[main\]\n {2}workflow_dispatch:$/m);
    expect(pages).toMatch(
      /^permissions:\n {2}contents: read\n {2}pages: write\n {2}id-token: write$/m,
    );
    expect(pages).toMatch(/^concurrency:\n {2}group: pages\n {2}cancel-in-progress: false$/m);
    expect(pages).toMatch(
      /^ {6}- run: pnpm build:docs\n {8}env:\n {10}DOCS_BASE: \/nanostack-design-system\/$/m,
    );
    expect(pages).toMatch(/^ {8}with:\n {10}path: site$/m);
    expect(pages).toMatch(
      /^ {4}environment:\n {6}name: github-pages\n {6}url: \$\{\{ steps\.deployment\.outputs\.page_url \}\}$/m,
    );
  });

  it('publishes with the npm tag and release kind that the release identity chose', () => {
    const release = workflows.find((workflow) => workflow.name === 'release.yml')!.text;
    expect(release).toMatch(/^ {10}node scripts\/release-identity\.mjs$/m);
    expect(release).toContain('DIST_TAG: ${{ needs.verify.outputs.dist_tag }}');
    expect(release).toContain('PRERELEASE: ${{ needs.verify.outputs.prerelease }}');
    expect(release).toMatch(/npm publish .*--tag "\$DIST_TAG"/);
    expect(release).toMatch(/gh release create .*--prerelease="\$PRERELEASE"/);
    expect(release).not.toMatch(/--tag beta|--prerelease(?!=)/);
  });
});
