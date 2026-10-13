import { expect, test } from '@playwright/test';

test('the skip link is the first stop and moves the focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

const pages = ['/', '/menu/', '/story/', '/styleguide/'];

test('each page has the header, the footer, a title and a description', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page).toHaveTitle(/Teekaapi/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  }
});

test('the footer has no form, and each link of the header and the footer leads to a page that exists', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('contentinfo').locator('form, input')).toHaveCount(0);
  const hrefs = await page.locator('header a, footer a').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href') ?? ''),
  );
  expect(hrefs).toEqual(['/', '/menu/', '/story/', '/', '/menu/', '/story/']);
  for (const href of new Set(hrefs)) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('the link of the current page is marked in the header and in the footer, and no other link is', async ({ page }) => {
  for (const [path, label] of [['/menu/', 'Menu'], ['/story/', 'Our Story']] as const) {
    await page.goto(path);
    for (const region of [page.getByRole('banner'), page.getByRole('contentinfo')]) {
      const marked = region.locator('a[aria-current="page"]');
      await expect(marked).toHaveCount(1);
      await expect(marked).toHaveText(label);
      await expect(marked).toHaveCSS('text-decoration-line', 'underline');
    }
  }
  await page.goto('/');
  await expect(page.locator('a[aria-current="page"]')).toHaveCount(0);
});

test('the phone menu opens and closes by keyboard, and a link in it reaches its page', async ({ page, viewport }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Menu' });
  const nav = page.getByRole('navigation', { name: 'Main' });

  if ((viewport?.width ?? 0) >= 768) {
    // From the tablet width the links are always visible and no menu button is offered.
    await expect(button).toBeHidden();
    await expect(nav.getByRole('link', { name: 'Menu' })).toBeVisible();
    return;
  }

  await expect(nav).toBeHidden();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Menu' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(button).toBeFocused();

  // After the menu opens, the next stop of the keyboard is its first link.
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: 'Menu' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: 'Our Story' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/story\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Our Story' })).toBeVisible();
  await expect(nav).toBeHidden();

  // The panel closes when the focus leaves it.
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(nav).toBeVisible();
  await page.getByRole('contentinfo').getByRole('link', { name: 'Menu' }).focus();
  await expect(nav).toBeHidden();
});

test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false });

  test('the links of the header are in view, and no control that needs scripts is shown', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const name of ['Menu', 'Our Story']) await expect(nav.getByRole('link', { name })).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toBeHidden();
    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    await expect(page.locator('[data-drinks-dots]')).toBeHidden();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
