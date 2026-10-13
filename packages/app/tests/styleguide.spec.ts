import { expect, test } from '@playwright/test';

test('the style reference page shows each colour, is hidden from search and has no sideways scroll', async ({ page }) => {
  await page.goto('/styleguide/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('section[aria-labelledby="colours"] li')).toHaveCount(9);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('the home page does not link to the style reference page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="styleguide"]')).toHaveCount(0);
});
