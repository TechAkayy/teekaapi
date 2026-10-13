import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

test('a visit to each page makes no request to another host', async ({ page, baseURL }) => {
  const own = new URL(baseURL ?? '').host;
  const others = new Set<string>();
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.host !== own) others.add(url.host);
  });

  for (const path of ['/', '/menu/', '/story/', '/styleguide/']) {
    await page.goto(path);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    });
    await page.waitForLoadState('networkidle');
  }
  expect([...others]).toEqual([]);
});

test('no component, layout or page holds a raw colour value', () => {
  const src = fileURLToPath(new URL('../src', import.meta.url));
  const offenders: string[] = [];
  for (const folder of ['components', 'layouts', 'pages']) {
    for (const name of readdirSync(join(src, folder), { recursive: true }) as string[]) {
      if (!/\.(astro|ts|css)$/.test(name)) continue;
      const text = readFileSync(join(src, folder, name), 'utf8');
      const found = text.match(/#[0-9a-fA-F]{3,8}\b(?![\w-])|\b(?:rgba?|hsla?|oklch|oklab)\(/g);
      if (found) offenders.push(`${folder}/${name}: ${found.join(', ')}`);
    }
  }
  expect(offenders).toEqual([]);
});
