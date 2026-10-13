import { expect, test } from '@playwright/test';

const names = ['Coffee', 'Cold Brew & Specials', 'Fusion Bites', 'Desserts'];

test('the menu shows four categories with grouped items, descriptions and prices', async ({ page }) => {
  await page.goto('/menu/');
  await expect(page.getByRole('heading', { level: 1, name: 'Menu' })).toBeVisible();
  const categories = page.locator('[data-menu-category]');
  await expect(categories).toHaveCount(4);
  for (const [index, name] of names.entries()) {
    const category = categories.nth(index);
    await expect(category.getByRole('heading', { level: 2 })).toHaveText(name);
    expect(await category.getByRole('heading', { level: 3 }).count()).toBeGreaterThanOrEqual(2);
    const items = category.locator('[data-menu-item]');
    expect(await items.count()).toBeGreaterThanOrEqual(2);
    for (const item of await items.all()) {
      await expect(item.getByRole('heading', { level: 4 })).toHaveText(/.+/);
      await expect(item.locator('[data-price]')).toHaveText(/^\$\d+(\.\d{2})?$/);
      await expect(item.locator('p')).toHaveText(/.+/);
    }
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('each dietary mark has a meaning in words, and the key explains each mark', async ({ page }) => {
  await page.goto('/menu/');
  const marks = page.locator('[data-menu-item] [role="img"]');
  expect(await marks.count()).toBeGreaterThan(10);
  const used = new Set<string>();
  for (const mark of await marks.all()) {
    const label = await mark.getAttribute('aria-label');
    expect(label).toMatch(/^[A-Z][a-z]/);
    used.add((await mark.textContent())?.trim() ?? '');
  }
  const key = page.locator('[data-dietary-key]');
  for (const mark of used) await expect(key.getByText(mark, { exact: true })).toBeVisible();
});

test('the special card comes before the first category', async ({ page }) => {
  await page.goto('/menu/');
  const special = page.locator('[data-menu-special]');
  await expect(special.getByRole('heading', { level: 2 })).toHaveText(/.+/);
  await expect(special).toContainText('Today’s Special');
  const before = await page.evaluate(() => {
    const card = document.querySelector('[data-menu-special]');
    const first = document.querySelector('[data-menu-category]');
    return !!card && !!first && !!(card.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(before).toBe(true);
});

test('the category bar stays in view, moves the page to a category and marks the category in view', async ({ page }) => {
  await page.goto('/menu/');
  const bar = page.locator('[data-category-bar]');
  const links = bar.getByRole('link');
  const current = () => links.evaluateAll((all) => all.map((link) => link.getAttribute('aria-current')).join());
  await expect(links).toHaveText(names);
  await expect.poll(current).toBe('true,false,false,false');

  // By pointer: the category comes into view below the bar, and the bar is still in view.
  await links.nth(2).click();
  await expect(page).toHaveURL(/#bites$/);
  const heading = page.locator('#bites h2');
  await expect(heading).toBeInViewport();
  await expect(bar).toBeInViewport();
  const clear = await page.evaluate(() => {
    const barBox = document.querySelector('[data-category-bar]')?.getBoundingClientRect();
    const headingBox = document.querySelector('#bites h2')?.getBoundingClientRect();
    return !!barBox && !!headingBox && barBox.top === 0 && headingBox.top >= barBox.bottom;
  });
  expect(clear).toBe(true);
  await expect.poll(current).toBe('false,false,true,false');

  // By keyboard.
  await links.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#cold$/);
  await expect(page.locator('#cold h2')).toBeInViewport();
  await expect.poll(current).toBe('false,true,false,false');

  // The mark follows a scroll to the end of the page and back to its start.
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect.poll(current).toBe('false,false,false,true');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(current).toBe('true,false,false,false');

  // The bar never makes the page scroll sideways.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
