import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const pages = ['/', '/menu/', '/story/'];

// Scrolls through the page, so that each part has entered and each photograph has loaded.
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await expect.poll(() => page.locator('[data-reveal]').count()).toBe(0);
}

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];
const summary = (violations: { id: string; nodes: { target: unknown }[] }[]): string[] =>
  violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(' | ')}`);

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`in ${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    for (const path of pages) {
      test(`the page ${path} has no accessibility violation`, async ({ page }) => {
        await page.goto(path);
        await settle(page);
        const results = await new AxeBuilder({ page }).withTags(tags).analyze();
        expect(summary(results.violations)).toEqual([]);
      });
    }

    test('the style reference page has no accessibility violation', async ({ page }) => {
      await page.goto('/styleguide/');
      await settle(page);
      // The contrast table shows failing pairings on purpose, each with its ratio in words.
      const results = await new AxeBuilder({ page }).withTags(tags).exclude('[aria-labelledby="contrast"]').analyze();
      expect(summary(results.violations)).toEqual([]);
    });
  });
}

interface Stop {
  label: string;
  ring: boolean;
  order: number;
}

// Presses Tab through the page and returns each stop in the order that the keyboard reaches it.
async function tabStops(page: Page): Promise<Stop[]> {
  const stops: Stop[] = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      return {
        label: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' '),
        ring: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
        order: [...document.querySelectorAll('*')].indexOf(el),
      };
    });
    if (!stop || stops.some((seen) => seen.order === stop.order)) break;
    stops.push(stop);
  }
  return stops;
}

for (const path of pages) {
  test(`on ${path} the keyboard reaches each control in the order of the page, each with a visible focus ring`, async ({ page, viewport }) => {
    await page.goto(path);
    await settle(page);
    const stops = await tabStops(page);
    const labels = stops.map((stop) => stop.label);
    const phone = (viewport?.width ?? 0) < 768;

    // Each page starts with the skip link and the header, and ends with the links of the footer.
    expect(labels[0]).toBe('Skip to main content');
    expect(labels.slice(-2)).toEqual(['Menu', 'Our Story']);
    if (phone) expect(labels.filter((label) => label === 'Menu')).toHaveLength(2);
    else expect(labels.filter((label) => label === 'Our Story')).toHaveLength(2);

    if (path === '/') {
      expect(labels).toContain('View Menu');
      if (phone) {
        expect(labels).toContain('Signature drinks, in a row');
        expect(labels.filter((label) => label.startsWith('Show drink'))).toHaveLength(4);
      }
    }
    if (path === '/menu/') {
      for (const name of ['Coffee', 'Cold Brew & Specials', 'Fusion Bites', 'Desserts']) expect(labels).toContain(name);
    }

    // The order of the stops is the order of the page, and each stop shows a ring.
    for (const [index, stop] of stops.entries()) {
      expect(stop.ring, `${stop.label} has a focus ring`).toBe(true);
      if (index > 0) expect(stop.order, `${stop.label} comes after ${stops[index - 1]?.label}`).toBeGreaterThan(stops[index - 1]?.order ?? -1);
    }
  });
}
