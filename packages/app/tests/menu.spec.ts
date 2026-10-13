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

test('the category bar stays in view, and each category is reached by pointer and by keyboard with its link marked', async ({ page }) => {
  await page.goto('/menu/');
  const bar = page.locator('[data-category-bar]');
  const links = bar.getByRole('link');
  const ids = ['coffee', 'cold', 'bites', 'desserts'];
  const current = () => links.evaluateAll((all) => all.map((link) => link.getAttribute('aria-current')).join());
  const only = (index: number) => ids.map((_, i) => String(i === index)).join();
  await expect(links).toHaveText(names);
  await expect.poll(current).toBe(only(0));

  // The heading of a category is in view and clear of the bar, and the bar is at the top of the window.
  const landed = async (id: string): Promise<void> => {
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id} h2`)).toBeInViewport();
    await expect
      .poll(() =>
        page.evaluate((target) => {
          const barBox = document.querySelector('[data-category-bar]')?.getBoundingClientRect();
          const headingBox = document.querySelector(`#${target} h2`)?.getBoundingClientRect();
          return !!barBox && !!headingBox && barBox.top >= 0 && barBox.top < 40 && headingBox.top >= barBox.bottom;
        }, id),
      )
      .toBe(true);
  };

  // By pointer, each category more than one time and in a mixed order, so that a link that is
  // half out of the bar on a phone is pressed too.
  for (const index of [2, 1, 3, 0, 2, 3, 1]) {
    await links.nth(index).click();
    await landed(ids[index] ?? '');
    await expect.poll(current).toBe(only(index));
  }

  // By keyboard: Tab from the top of the page reaches each link, and Enter opens its category.
  // After Enter the browser moves the keyboard position into the category, so each link gets a fresh start.
  for (const [index, id] of ids.entries()) {
    await page.goto('/menu/');
    for (let presses = 0; presses < 30; presses++) {
      if (await links.nth(index).evaluate((link) => link === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(links.nth(index)).toBeFocused();
    await page.keyboard.press('Enter');
    await landed(id);
    await expect.poll(current).toBe(only(index));
    // The next stop of the keyboard is inside the page, below the bar: the focus has left the bar.
    await page.keyboard.press('Tab');
    expect(await bar.evaluate((el) => el.contains(document.activeElement))).toBe(false);
  }

  // The mark follows a scroll through the page: one link is marked at every position.
  await page.goto('/menu/');
  const marks = await page.evaluate(async () => {
    const seen: string[] = [];
    const read = (): string =>
      [...document.querySelectorAll('[data-category-link]')].map((link) => (link.getAttribute('aria-current') === 'true' ? '1' : '0')).join('');
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 120) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      seen.push(read());
    }
    return seen;
  });
  expect(marks.every((mark) => mark.split('1').length === 2)).toBe(true);
  expect(marks[0]).toBe('1000');
  expect(marks.at(-1)).toBe('0001');
  expect([...new Set(marks)]).toEqual(['1000', '0100', '0010', '0001']);

  // The bar never makes the page scroll sideways.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('a category link that takes the keyboard focus is whole inside the bar, in both directions', async ({ page }) => {
  await page.goto('/menu/');
  const links = page.locator('[data-category-link]');
  const inside = (index: number) =>
    links.nth(index).evaluate((link) => {
      const box = link.getBoundingClientRect();
      const scroller = link.closest('[data-category-scroller]')?.getBoundingClientRect();
      return !!scroller && box.left >= scroller.left - 1 && box.right <= Math.min(scroller.right, window.innerWidth) + 1;
    });
  await links.nth(0).focus();
  expect(await inside(0)).toBe(true);
  for (const index of [1, 2, 3]) {
    await page.keyboard.press('Tab');
    await expect(links.nth(index)).toBeFocused();
    expect(await inside(index), `link ${index} forward`).toBe(true);
  }
  for (const index of [2, 1, 0]) {
    await page.keyboard.press('Shift+Tab');
    await expect(links.nth(index)).toBeFocused();
    expect(await inside(index), `link ${index} backward`).toBe(true);
  }
});

test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false });

  test('no category link is marked, and each link still moves the page', async ({ page }) => {
    await page.goto('/menu/');
    await expect(page.locator('[data-category-link][aria-current]')).toHaveCount(0);
    await page.locator('[data-category-link]').nth(2).click();
    await expect(page).toHaveURL(/#bites$/);
    await expect(page.locator('#bites h2')).toBeInViewport();
  });
});

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the glow of the special card runs', async ({ page }) => {
    await page.goto('/menu/');
    const running = await page
      .locator('[data-menu-special]')
      .evaluate((card) => card.getAnimations().filter((animation) => animation.playState === 'running').length);
    expect(running).toBe(1);
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the glow of the special card does not run, and the card keeps a still glow', async ({ page }) => {
    await page.goto('/menu/');
    const card = page.locator('[data-menu-special]');
    expect(await card.evaluate((el) => el.getAnimations().length)).toBe(0);
    await expect(card).not.toHaveCSS('box-shadow', 'none');
  });
});
