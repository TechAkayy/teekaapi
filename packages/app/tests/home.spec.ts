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

test('the signature drinks are a row with dots on a phone and a grid from the tablet width', async ({ page, viewport }) => {
  await page.goto('/');
  const row = page.locator('[data-drinks-row]');
  const cards = row.locator('[data-drink]');
  const dots = page.locator('[data-drinks-dot]');
  await expect(cards).toHaveCount(4);

  if ((viewport?.width ?? 0) >= 768) {
    // A grid: each card is in the row without a scroll, and no dot is offered.
    expect(await row.evaluate((el) => el.scrollWidth - el.clientWidth)).toBe(0);
    await expect(dots.first()).toBeHidden();
    await expect(row).not.toHaveAttribute('tabindex');
    for (const card of await cards.all()) await expect(card).toBeVisible();
    return;
  }

  await expect(dots).toHaveCount(4);
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
  await page.locator('#drinks').evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));

  // A dot moves the row to its card and becomes the current dot.
  await dots.nth(2).click();
  await expect(cards.nth(2)).toBeInViewport({ ratio: 0.9 });
  await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'false');

  // The row takes the keyboard focus, and an arrow key moves it.
  await row.evaluate((el) => el.scrollTo({ left: 0, behavior: 'instant' }));
  await row.focus();
  await expect(row).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => row.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
});

test('the fusion food teaser shows its photograph beside three to five dishes', async ({ page, viewport }) => {
  await page.goto('/');
  const section = page.locator('#food');
  const image = section.getByRole('img');
  const dishes = section.locator('ul > li');
  await expect(image).toHaveAttribute('alt', /.+/);
  const count = await dishes.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(5);

  await section.scrollIntoViewIfNeeded();
  const imageBox = await image.boundingBox();
  const listBox = await section.locator('ul').boundingBox();
  if (!imageBox || !listBox) throw new Error('The teaser has no layout.');
  if ((viewport?.width ?? 0) >= 768) {
    // Side by side: the list starts to the right of the photograph.
    expect(listBox.x).toBeGreaterThan(imageBox.x + imageBox.width - 1);
  } else {
    // Stacked: the list starts below the photograph.
    expect(listBox.y).toBeGreaterThan(imageBox.y + imageBox.height - 1);
  }
});

test('the social band shows square photographs with text alternatives and links to no account', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#moments');
  const images = section.getByRole('img');
  await expect(images).toHaveCount(6);
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('alt', /.+/);
    const box = await image.evaluate((el) => el.getBoundingClientRect().toJSON());
    expect(Math.abs(box.width - box.height)).toBeLessThan(1);
  }
  await expect(section.getByRole('link')).toHaveCount(0);
});

test('the words of the hero do not sit on its coloured shapes', async ({ page }) => {
  await page.goto('/');
  const overlaps = await page.evaluate(() => {
    const hero = document.querySelector('section.hero');
    if (!hero) return ['no hero'];
    // The boxes of the lines of text, not of their full-width blocks.
    const words = [...hero.querySelectorAll('h1, p, a')].flatMap((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return [...range.getClientRects()];
    });
    const shapes = [...hero.querySelectorAll<HTMLElement>('.hero-shape')].filter((el) => getComputedStyle(el).display !== 'none');
    const found: string[] = [];
    for (const shape of shapes) {
      const s = shape.getBoundingClientRect();
      for (const w of words) {
        if (w.left < s.right && w.right > s.left && w.top < s.bottom && w.bottom > s.top) found.push(shape.className);
      }
    }
    return found;
  });
  expect(overlaps).toEqual([]);
});
