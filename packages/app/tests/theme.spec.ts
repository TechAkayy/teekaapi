import { expect, test } from '@playwright/test';

const isDark = () => document.documentElement.classList.contains('dark');

test.describe('with the device in dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('the first load is dark', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(isDark)).toBe(true);
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
  });
});

test.describe('with the device in dark mode, the script that sets the mode', () => {
  test.use({ colorScheme: 'dark' });

  test('is written into the head and stands before the first style', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(isDark)).toBe(true);
    const inHead = await page.evaluate(() => {
      const inline = [...document.head.querySelectorAll('script:not([src])')].find((script) =>
        script.textContent?.includes('prefers-color-scheme'),
      );
      const firstStyle = document.head.querySelector('link[rel="stylesheet"], style');
      return !!inline && (!firstStyle || !!(inline.compareDocumentPosition(firstStyle) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(inHead).toBe(true);
  });
});

test.describe('with the device in light mode', () => {
  test.use({ colorScheme: 'light' });

  test('the first load is light', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(isDark)).toBe(false);
  });

  test('the button changes the mode, and the choice outlasts a reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    expect(await page.evaluate(isDark)).toBe(true);

    await page.reload();
    expect(await page.evaluate(isDark)).toBe(true);

    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await page.reload();
    expect(await page.evaluate(isDark)).toBe(false);
  });

  test('without a saved choice the site follows a change of the device', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });
    // The browser reports the change of the device in a later task.
    await expect.poll(() => page.evaluate(isDark)).toBe(true);
  });

  test('the theme button is reachable by keyboard', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Switch to dark mode' });
    await button.focus();
    await page.keyboard.press('Enter');
    expect(await page.evaluate(isDark)).toBe(true);
  });
});
