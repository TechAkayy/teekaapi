import { expect, test } from '@playwright/test';

test('the story page shows the narrative in three or four parts', async ({ page }) => {
  await page.goto('/story/');
  await expect(page.getByRole('heading', { level: 1, name: 'Our Story' })).toBeVisible();
  const parts = page.locator('[data-narrative] section');
  const count = await parts.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(4);
  for (const part of await parts.all()) {
    await expect(part.getByRole('heading', { level: 2 })).toHaveText(/.+/);
    expect(((await part.locator('p').textContent()) ?? '').length).toBeGreaterThan(80);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('the timeline is an ordered list of three or four milestones, down the side on a phone and across from the tablet width', async ({ page, viewport }) => {
  await page.goto('/story/');
  const timeline = page.locator('ol[data-timeline]');
  const steps = timeline.locator('> li');
  const count = await steps.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(4);
  for (const step of await steps.all()) {
    await expect(step.getByRole('heading', { level: 3 })).toHaveText(/.+/);
    await expect(step.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  }
  await timeline.scrollIntoViewIfNeeded();
  // The steps slide into place as they enter the view; the layout is read after that.
  await expect.poll(() => timeline.locator('[data-reveal]').count()).toBe(0);
  const first = await steps.nth(0).boundingBox();
  const second = await steps.nth(1).boundingBox();
  if (!first || !second) throw new Error('The timeline has no layout.');
  if ((viewport?.width ?? 0) >= 768) {
    expect(Math.abs(second.y - first.y)).toBeLessThan(2);
    expect(second.x).toBeGreaterThan(first.x);
  } else {
    expect(second.y).toBeGreaterThan(first.y + first.height - 1);
  }
});

test('the portraits are three or four square photographs with captions and text alternatives', async ({ page }) => {
  await page.goto('/story/');
  const figures = page.locator('[data-portraits] figure');
  const count = await figures.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(4);
  for (const figure of await figures.all()) {
    const image = figure.getByRole('img');
    await expect(image).toHaveAttribute('alt', /.+/);
    await expect(figure.locator('figcaption')).toHaveText(/.+/);
    const box = await image.evaluate((el) => el.getBoundingClientRect().toJSON());
    expect(Math.abs(box.width - box.height)).toBeLessThan(1);
    // The frame has the offset shadow of the site brief.
    await expect(figure.locator('[data-portrait-frame]')).not.toHaveCSS('box-shadow', 'none');
  }
});

test('the joining line of the timeline can be seen in light and in dark mode', async ({ page }) => {
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/story/');
    const colours = await page.evaluate(() => {
      const step = document.querySelector('.timeline-step');
      const section = step?.closest('section');
      if (!step || !section) return null;
      const line = getComputedStyle(step, '::before');
      const down = line.borderLeftWidth !== '0px';
      return {
        line: down ? line.borderLeftColor : line.borderTopColor,
        surface: getComputedStyle(section).backgroundColor,
        // The length of the line: its height when it runs down, its width when it runs across.
        length: parseFloat(down ? line.height : line.width),
        thickness: parseFloat(down ? line.borderLeftWidth : line.borderTopWidth),
      };
    });
    expect(colours).not.toBeNull();
    expect(colours?.length).toBeGreaterThan(20);
    expect(colours?.thickness).toBeGreaterThanOrEqual(2);
    expect(colours?.line).not.toBe(colours?.surface);
    // Light mode has a dark line on a light surface; dark mode has a light line on a dark surface.
    expect(colours?.line).toBe(scheme === 'light' ? 'rgb(27, 21, 18)' : 'rgb(250, 250, 250)');
  }
});
