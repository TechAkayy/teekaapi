import { expect, test } from '@playwright/test';

const titles = ['The first pour', 'Filter kaapi', 'Over ice', 'Crisp and golden', 'Around the leaf', 'A quiet corner', 'A little green', 'Made by hand', 'The finishing touch'];

test('the gallery shows its nine labelled photographs in a stable square grid', async ({ page, viewport }) => {
  await page.goto('/gallery/');
  await expect(page.getByRole('heading', { name: 'Gallery', level: 1 })).toBeVisible();
  await expect(page.getByText('Sample photographs and captions — a taste of the atmosphere.')).toBeVisible();
  const cards = page.locator('[data-gallery-list] > li');
  await expect(cards).toHaveCount(9);
  await expect(page.locator('[data-gallery-title]')).toHaveText(titles);
  expect(await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-category')))).toEqual([
    'Coffee', 'Coffee', 'Coffee', 'Food', 'Food', 'Space', 'Space', 'People', 'People',
  ]);
  for (const card of await cards.all()) {
    const image = card.getByRole('img');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('alt', /.+/);
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const box = await image.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(1);
  }
  const columns = (viewport?.width ?? 0) >= 1024 ? 3 : (viewport?.width ?? 0) >= 640 ? 2 : 1;
  const boxes = await cards.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
  if (columns > 1) expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(1);
  expect(boxes[columns].y).toBeGreaterThan(boxes[0].y + boxes[0].height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('filters keep source order, announce the result and retain keyboard focus through repeated selections', async ({ page }) => {
  await page.goto('/gallery/');
  const visibleCards = page.locator('[data-gallery-list] > li:visible');
  const choices = [
    ['Food', titles.slice(3, 5)], ['Coffee', titles.slice(0, 3)],
    ['People', titles.slice(7)], ['Space', titles.slice(5, 7)], ['All', titles],
  ] as const;
  for (const [category, expected] of choices) {
    const button = page.getByRole('button', { name: category, exact: true });
    await button.focus();
    await page.keyboard.press(category === 'Coffee' ? 'Space' : 'Enter');
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-gallery-filter][aria-pressed="true"]')).toHaveCount(1);
    await expect(visibleCards.locator('[data-gallery-title]')).toHaveText([...expected]);
    await expect(page.getByRole('img')).toHaveCount(expected.length);
    await expect(page.getByRole('status')).toHaveText(`${category}: ${expected.length} photographs`);
  }
});

test('filters work with actual touch input', async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ baseURL, viewport: viewport ?? undefined, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.goto('/gallery/');
    await page.getByRole('button', { name: 'People', exact: true }).tap();
    await expect(page.locator('[data-gallery-list] > li:visible [data-gallery-title]')).toHaveText(titles.slice(7));
    const captions = page.locator('[data-gallery-list] > li:visible details');
    await captions.nth(0).locator('summary').tap();
    await captions.nth(1).locator('summary').tap();
    await expect(page.locator('details[open]')).toHaveCount(2);
    await captions.nth(0).locator('summary').tap();
    await expect(page.locator('details[open]')).toHaveCount(1);
    await page.getByRole('button', { name: 'All', exact: true }).tap();
    await expect(page.getByRole('img')).toHaveCount(9);
    await expect(page.locator('details[open]')).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('native captions open and close by keyboard, and filters reset actual open disclosures', async ({ page }) => {
  await page.goto('/gallery/');
  const summaries = page.locator('[data-gallery-title]');
  await summaries.nth(0).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details[open] p')).toHaveText('Espresso flows from the machine into a waiting cup.');
  await page.keyboard.press('Space');
  await expect(page.locator('details[open]')).toHaveCount(0);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(summaries.nth(1)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('details[open]')).toHaveCount(2);
  await page.getByRole('button', { name: 'People', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details[open]')).toHaveCount(0);
  await page.keyboard.press('Tab');
  await expect(summaries.nth(7)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('details[open] p')).toHaveText('A hand holds the cup for the next pour.');
});

test('captions survive failed images and enlarged text without clipping', async ({ page }) => {
  await page.route(/\.(webp|jpg)(\?.*)?$/, (route) => route.abort());
  await page.goto('/gallery/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  const cards = page.locator('[data-gallery-list] > li');
  for (const card of await cards.all()) {
    await expect(card.getByRole('img')).toHaveAttribute('alt', /.+/);
    await card.locator('summary').click();
    await expect(card.locator('details p')).toBeVisible();
    expect(await card.locator('details').evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true);
  }
  // The shared header has its own enlarged-text coverage in the layout tests.
  expect(await page.locator('[data-gallery]').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false });
  test('all photographs remain available and unavailable filters are absent', async ({ page }) => {
    await page.goto('/gallery/');
    await expect(page.getByRole('img')).toHaveCount(9);
    await expect(page.locator('[data-gallery-controls]')).toBeHidden();
    await expect(page.locator('[data-gallery-title]')).toHaveText(titles);
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('details[open] p')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.locator('details[open]')).toHaveCount(0);
  });
});
