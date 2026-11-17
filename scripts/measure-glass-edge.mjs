// Measures how visible the edge of each glass data surface is, from real
// Chromium renders of the Foundations/Glass material stories.
// docs/technical/material.md explains the method and holds the last results.
//
// The rim is the outermost CSS pixel of a card, stat card or data-table frame.
// For four points on that line (top middle, right and left near the bottom,
// bottom near the left corner) the script compares the rim pixel with the
// backdrop 3px outside it and with the surface 4px inside it.
//
// Start Storybook first (pnpm storybook), then:
//   node scripts/measure-glass-edge.mjs [baseUrl]
// GLASS_CSS="<css>" injects token overrides to try other values.
import { createRequire } from 'node:module';

const [base = 'http://localhost:6006'] = process.argv.slice(2);
const require = createRequire(import.meta.url);
const { chromium } = createRequire(require.resolve('@vitest/browser-playwright'))('playwright');

const surfaces = {
  statCard: '[data-slot=stat-card]',
  dataTable: '[data-slot=data-table-frame]',
  card: '[data-slot=card]',
};
const stories = [
  ['app-frame', ['statCard', 'dataTable']],
  ['worst-case', ['statCard', 'dataTable']],
  ['data-surfaces', ['card']],
];

function luminance([r, g, b]) {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const browser = await chromium.launch();
const rows = [];
for (const theme of ['light', 'dark']) {
  for (const [story, keys] of stories) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(
      `${base}/iframe.html?id=foundations-glass-material--${story}&viewMode=story&globals=material:glass;theme:${theme}`,
    );
    if (process.env.GLASS_CSS) await page.addStyleTag({ content: process.env.GLASS_CSS });
    await page.waitForSelector('#storybook-root > *', { timeout: 20000 });
    await page.waitForTimeout(1200);
    for (const key of keys) {
      // Each probe: [rim point, outside point, inside point], in CSS pixels.
      const probes = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const xIn = (f) => Math.round(r.left + r.width * f);
        const yIn = (f) => Math.round(r.top + r.height * f);
        const top = Math.floor(r.top);
        const bottom = Math.ceil(r.bottom) - 1;
        const left = Math.floor(r.left);
        const right = Math.ceil(r.right) - 1;
        return {
          top: [
            [xIn(0.5), top],
            [xIn(0.5), top - 3],
            [xIn(0.5), top + 4],
          ],
          right: [
            [right, yIn(0.8)],
            [right + 3, yIn(0.8)],
            [right - 4, yIn(0.8)],
          ],
          left: [
            [left, yIn(0.8)],
            [left - 3, yIn(0.8)],
            [left + 4, yIn(0.8)],
          ],
          bottom: [
            [xIn(0.15), bottom],
            [xIn(0.15), bottom + 3],
            [xIn(0.15), bottom - 4],
          ],
        };
      }, surfaces[key]);
      if (!probes) {
        rows.push({ theme, story, surface: key, missing: true });
        continue;
      }
      const png = await page.screenshot();
      const pixels = await page.evaluate(
        async ({ b64, probes }) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, c.width, c.height).data;
          const at = ([x, y]) => {
            const i = (y * c.width + x) * 4;
            return [data[i], data[i + 1], data[i + 2]];
          };
          return Object.fromEntries(
            Object.entries(probes).map(([side, pts]) => [side, pts.map(at)]),
          );
        },
        { b64: png.toString('base64'), probes },
      );
      const row = { theme, story, surface: key };
      for (const [side, [rim, outside, inside]] of Object.entries(pixels)) {
        row[side] = `${ratio(rim, outside).toFixed(2)}/${ratio(rim, inside).toFixed(2)}`;
      }
      rows.push(row);
    }
    await page.close();
  }
}
await browser.close();
console.log('rim:outside / rim:inside contrast');
console.table(rows);
