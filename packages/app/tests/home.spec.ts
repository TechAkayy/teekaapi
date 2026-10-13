import { expect, test } from '@playwright/test';

test('the home page loads with one main heading and no sideways scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('the hero shows its headline, its photograph and a button that goes to the drinks', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('section.hero');
  await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(hero.getByRole('img')).toHaveAttribute('alt', /.+/);
  await hero.getByRole('link', { name: 'View Menu' }).click();
  await expect(page).toHaveURL(/#drinks$/);
  await expect(page.locator('#drinks')).toBeInViewport();
});

test('the highlights show three or four cards, each with a title and a line', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('section[aria-labelledby="highlights-heading"] li');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(4);
  for (const card of await cards.all()) {
    await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(card.locator('p')).toHaveText(/.+/);
  }
});
