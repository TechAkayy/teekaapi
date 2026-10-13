import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`in ${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    test('the home page has no accessibility violation', async ({ page }) => {
      await page.goto('/');
      await settle(page);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
      expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(' | ')}`)).toEqual([]);
    });

    test('the style reference page has no accessibility violation', async ({ page }) => {
      await page.goto('/styleguide/');
      await settle(page);
      // The contrast table shows failing pairings on purpose, each with its ratio in words.
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .exclude('[aria-labelledby="contrast"]')
        .analyze();
      expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(' | ')}`)).toEqual([]);
    });
  });
}

test('the keyboard reaches each control in the order of the page, each with a visible focus ring', async ({ page, viewport }) => {
  await page.goto('/');
  await settle(page);

  const stops: { label: string; top: number; left: number; ring: boolean; order: number }[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const all = [...document.querySelectorAll('*')];
      return {
        label: (el.getAttribute('aria-label') ?? el.getAttribute('aria-labelledby') ?? el.textContent ?? '').trim().replace(/\s+/g, ' '),
        top: el.getBoundingClientRect().top + window.scrollY,
        left: el.getBoundingClientRect().left,
        ring: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
        order: all.indexOf(el),
      };
    });
    if (!stop || stops.some((seen) => seen.order === stop.order)) break;
    stops.push(stop);
  }

  const labels = stops.map((stop) => stop.label);
  expect(labels[0]).toBe('Skip to main content');
  expect(labels).toContain('View Menu');
  expect(labels.at(-1)).toBe('Moments');
  if ((viewport?.width ?? 0) < 768) {
    expect(labels).toContain('Menu');
    expect(labels).toContain('Signature drinks, in a row');
    expect(labels.filter((label) => label.startsWith('Show drink'))).toHaveLength(4);
  } else {
    expect(labels.filter((label) => label === 'Drinks')).toHaveLength(2);
  }

  // The order of the stops is the order of the page, and each stop shows a ring.
  for (const [index, stop] of stops.entries()) {
    expect(stop.ring, `${stop.label} has a focus ring`).toBe(true);
    if (index > 0) expect(stop.order, `${stop.label} comes after ${stops[index - 1]?.label}`).toBeGreaterThan(stops[index - 1]?.order ?? -1);
  }
});
