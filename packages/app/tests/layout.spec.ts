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

test('each page has the header, the footer, a title and a description', async ({ page }) => {
  for (const path of ['/', '/styleguide/']) {
    await page.goto(path);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page).toHaveTitle(/Teekaapi/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  }
});

test('the footer has no form, and each link of the header and the footer has a target', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('contentinfo').locator('form, input')).toHaveCount(0);
  const hrefs = await page.locator('header a, footer a').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href') ?? ''),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const [path = '/', id] = href.split('#');
    expect(path).toBe('/');
    if (id) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
});

test('the phone menu opens and closes by keyboard, and a link in it reaches its section', async ({ page, viewport }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Menu' });
  const nav = page.getByRole('navigation', { name: 'Main' });

  if ((viewport?.width ?? 0) >= 768) {
    // From the tablet width the links are always visible and no menu button is offered.
    await expect(button).toBeHidden();
    await expect(nav.getByRole('link', { name: 'Drinks' })).toBeVisible();
    return;
  }

  await expect(nav).toBeHidden();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Drinks' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(button).toBeFocused();

  await page.keyboard.press('Enter');
  await nav.getByRole('link', { name: 'Food' }).click();
  await expect(page).toHaveURL(/#food$/);
  await expect(nav).toBeHidden();
});
