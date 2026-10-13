import { expect, test } from '@playwright/test';

test.describe('with reduced motion asked for', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const path of ['/', '/menu/', '/story/']) {
    test(`on ${path} nothing is hidden, nothing animates and no transition takes time`, async ({ page }) => {
      await page.goto(path);
      const state = await page.evaluate(() => {
        const elements = [...document.querySelectorAll<HTMLElement>('body *')];
        return {
          waiting: document.querySelectorAll('[data-reveal]').length,
          hidden: elements.filter((el) => el.matches('main *') && getComputedStyle(el).opacity === '0' && !el.matches('figcaption')).length,
          animations: document.getAnimations().length,
          slow: elements.filter((el) =>
            getComputedStyle(el).transitionDuration.split(',').some((duration) => parseFloat(duration) > 0),
          ).length,
        };
      });
      expect(state).toEqual({ waiting: 0, hidden: 0, animations: 0, slow: 0 });
    });
  }
});

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('a part below the fold waits, then enters in 150 to 250 milliseconds when it comes into view', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('#moments [data-reveal]').first();
    await expect(heading).toHaveCSS('opacity', '0');
    const duration = await heading.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration) * 1000);
    expect(duration).toBeGreaterThanOrEqual(150);
    expect(duration).toBeLessThanOrEqual(250);

    await page.locator('#moments').scrollIntoViewIfNeeded();
    await expect(page.locator('#moments h2')).toBeVisible();
    await expect.poll(() => page.locator('#moments [data-reveal]').count()).toBe(0);
    await expect(page.locator('#moments h2')).toHaveCSS('opacity', '1');
  });
});

test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false });

  test('the whole content of the menu page and of the story page can be read', async ({ page }) => {
    await page.goto('/menu/');
    await expect(page.locator('[data-menu-item]')).toHaveCount(22);
    for (const item of await page.locator('[data-menu-item]').all()) await expect(item).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-category-bar]').getByRole('link')).toHaveCount(4);
    await page.goto('/story/');
    for (const part of await page.locator('[data-narrative] section, [data-timeline] li, [data-portraits] li').all()) {
      await expect(part).toHaveCSS('opacity', '1');
    }
  });

  test('each part of the page is visible', async ({ page }) => {
    await page.goto('/');
    for (const id of ['drinks', 'food', 'moments']) {
      await expect(page.locator(`#${id} h2`)).toHaveCSS('opacity', '1');
    }
    await expect(page.locator('[data-drink]').first()).toHaveCSS('opacity', '1');
  });
});
