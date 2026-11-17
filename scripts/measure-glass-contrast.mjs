// Measures text contrast on glass surfaces from real Chromium renders of the
// Foundations/Glass material stories. docs/technical/material.md explains the
// method and holds the last results.
//
// Start Storybook first (pnpm storybook), then:
//   node scripts/measure-glass-contrast.mjs [baseUrl] [outDir]
// Defaults: http://localhost:6006 and .ui-craft/glass. Screenshots and
// contrast.json land in outDir. ONLY=worst-case,dialog-surface limits stories;
// GLASS_CSS="<css>" injects token overrides to try other values.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'http://localhost:6006', outDir = '.ui-craft/glass'] = process.argv.slice(2);
// Playwright arrives through @vitest/browser-playwright; resolve it from there.
const require = createRequire(import.meta.url);
const { chromium } = createRequire(require.resolve('@vitest/browser-playwright'))('playwright');
mkdirSync(outDir, { recursive: true });

const surfaces = {
  header: '[data-slot=app-shell-header]',
  sidebar: '[data-slot=sidebar-inner]',
  popover: '[data-slot=popover-content]',
  menu: '[data-slot=dropdown-menu-content]',
  select: '[data-slot=select-content]',
  dialog: '[data-slot=dialog-content]',
  alertDialog: '[data-slot=alert-dialog-content]',
  sheet: '[data-slot=sheet-content]',
  toast: '[data-slot=toast]',
  statCard: '[data-slot=stat-card]',
  dataTable: '[data-slot=data-table-frame]',
  card: '[data-slot=card]',
  table: '[data-slot=table-container]',
};

const allStories = [
  ['worst-case', ['header', 'sidebar', 'popover', 'statCard', 'dataTable']],
  ['app-frame', ['header', 'sidebar', 'statCard', 'dataTable']],
  ['dropdown-menu-surface', ['menu']],
  ['select-surface', ['select']],
  ['dialog-surface', ['dialog']],
  ['alert-dialog-surface', ['alertDialog']],
  ['sheet-surface', ['sheet']],
  ['toast-surface', ['toast']],
  ['data-surfaces', ['card', 'table']],
];

const stories = process.env.ONLY
  ? allStories.filter(([s]) => process.env.ONLY.split(',').includes(s))
  : allStories;
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
const results = [];
for (const theme of ['light', 'dark']) {
  for (const [story, keys] of stories) {
    for (const material of story === 'app-frame' ? ['glass', 'solid'] : ['glass']) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const url = `${base}/iframe.html?id=foundations-glass-material--${story}&viewMode=story&globals=material:${material};theme:${theme}`;
      await page.goto(url);
      if (process.env.GLASS_CSS) await page.addStyleTag({ content: process.env.GLASS_CSS });
      await page.waitForSelector('#storybook-root > *', { timeout: 20000 });
      await page.waitForTimeout(1200);
      if (story === 'toast-surface') {
        await page.waitForSelector('[data-slot=toast]', { timeout: 5000 }).catch(() => {});
      }
      if (story === 'worst-case') {
        await page.evaluate(() => {
          const v = document.querySelector(
            '[data-slot=app-shell-content] [data-slot=scroll-area-viewport]',
          );
          const block = document.querySelector('[data-testid=worst-case-dark]');
          const header = document.querySelector('[data-slot=app-shell-header]');
          if (block && header) {
            const delta =
              block.getBoundingClientRect().top - header.getBoundingClientRect().top - 8;
            if (v && v.scrollHeight > v.clientHeight) v.scrollTop += delta;
            else window.scrollBy(0, delta);
          }
        });
        await page.waitForTimeout(400);
      }
      await page.screenshot({ path: join(outDir, `${story}-${material}-${theme}.png`) });
      if (material !== 'glass') {
        await page.close();
        continue;
      }
      // Text colours, resolved by the browser.
      const colours = await page.evaluate(() => {
        const probe = document.createElement('span');
        document.body.append(probe);
        const read = (v) => {
          probe.style.color = `var(${v})`;
          return getComputedStyle(probe)
            .color.match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number);
        };
        const out = {
          muted: read('--muted-foreground'),
          primary: read('--primary'),
          fg: read('--foreground'),
        };
        probe.remove();
        return out;
      });
      for (const key of keys) {
        const selector = surfaces[key];
        const handle = await page.$(selector);
        if (!handle) {
          results.push({ theme, story, surface: key, missing: true });
          continue;
        }
        // Hide text and icons inside the surface only; keep everything behind it.
        await page.addStyleTag({
          content: `${selector}, ${selector} * { color: transparent !important; text-shadow: none !important; } ${selector} svg { visibility: hidden !important; }`,
        });
        await page.waitForTimeout(100);
        // Points where the surface itself is the painted background.
        const points = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          const r = el.getBoundingClientRect();
          const pts = [];
          // Focus rings and control shadows paint outside their element: keep clear of them.
          const controls = [
            ...el.querySelectorAll('button, input, textarea, a, [tabindex], [role=combobox]'),
          ].map((c) => c.getBoundingClientRect());
          const nearControl = (x, y) =>
            controls.some(
              (c) => x > c.left - 8 && x < c.right + 8 && y > c.top - 8 && y < c.bottom + 8,
            );
          const opaque = (n) => {
            const cs = getComputedStyle(n);
            return (
              (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && !cs.backgroundColor.endsWith(', 0)')) ||
              cs.backgroundImage !== 'none'
            );
          };
          for (let y = r.top + 6; y < Math.min(r.bottom - 6, innerHeight - 1); y += 4) {
            for (let x = r.left + 6; x < Math.min(r.right - 6, innerWidth - 1); x += 4) {
              if (nearControl(x, y)) continue;
              let n = document.elementFromPoint(x, y);
              if (!n || !el.contains(n)) continue;
              let ok = true;
              while (n && n !== el) {
                if (opaque(n) || ['INPUT', 'TEXTAREA', 'BUTTON', 'IMG'].includes(n.tagName)) {
                  ok = false;
                  break;
                }
                n = n.parentElement;
              }
              if (ok) pts.push([Math.round(x), Math.round(y)]);
            }
          }
          return pts;
        }, selector);
        const png = await page.screenshot();
        const pixels = await page.evaluate(
          async ({ b64, pts }) => {
            const img = new Image();
            img.src = `data:image/png;base64,${b64}`;
            await img.decode();
            const c = document.createElement('canvas');
            c.width = img.width;
            c.height = img.height;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, c.width, c.height).data;
            return pts.map(([x, y]) => {
              const i = (y * c.width + x) * 4;
              return [data[i], data[i + 1], data[i + 2]];
            });
          },
          { b64: png.toString('base64'), pts: points },
        );
        if (!pixels.length) {
          results.push({ theme, story, surface: key, missing: true });
          continue;
        }
        const lum = pixels.map(luminance);
        // Worst background for the text: closest luminance to the text colour.
        const textLum = luminance(colours.muted);
        let worst = pixels[0];
        let worstGap = Infinity;
        pixels.forEach((p, i) => {
          const gap = Math.abs(lum[i] - textLum);
          if (gap < worstGap) {
            worstGap = gap;
            worst = p;
          }
        });
        let worstP = pixels[0];
        let gapP = Infinity;
        const pl = luminance(colours.primary);
        pixels.forEach((p, i) => {
          const gap = Math.abs(lum[i] - pl);
          if (gap < gapP) {
            gapP = gap;
            worstP = p;
          }
        });
        const sorted = [...lum].sort((a, b) => a - b);
        const median = pixels[lum.indexOf(sorted[Math.floor(sorted.length / 2)])];
        results.push({
          theme,
          story,
          surface: key,
          samples: pixels.length,
          worstBg: worst,
          muted: +ratio(colours.muted, worst).toFixed(2),
          mutedMedian: +ratio(colours.muted, median).toFixed(2),
          primary: +ratio(colours.primary, worstP).toFixed(2),
          primaryMedian: +ratio(colours.primary, median).toFixed(2),
        });
      }
      await page.close();
    }
  }
}
await browser.close();
writeFileSync(join(outDir, 'contrast.json'), JSON.stringify(results, null, 2));
for (const r of results) {
  if (r.missing) console.log(`${r.theme}\t${r.story}\t${r.surface}\tMISSING`);
  else
    console.log(
      `${r.theme}\t${r.story}\t${r.surface}\tn=${r.samples}\tmuted ${r.muted} (median ${r.mutedMedian})\tprimary ${r.primary} (median ${r.primaryMedian})\tworstBg rgb(${r.worstBg})`,
    );
}
