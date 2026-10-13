// A part of the page fades and slides up one time, when it enters the view.
// The styles are in global.css. They apply only when the visitor allows motion,
// so this script changes nothing for a visitor who asked for reduced motion.

const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

// Cards that share a parent enter a little apart in time.
const seen = new Map<Element, number>();
for (const target of targets) {
  const parent = target.parentElement;
  if (!parent) continue;
  const index = seen.get(parent) ?? 0;
  seen.set(parent, index + 1);
  target.style.setProperty('--reveal-index', String(Math.min(index, 5)));
}

// After the entry the marks are removed, so that a later hover transition of the element is its own.
function settle(target: HTMLElement): void {
  target.removeAttribute('data-reveal');
  target.classList.remove('is-visible');
  target.style.removeProperty('--reveal-index');
}

if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  targets.forEach(settle);
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        observer.unobserve(target);
        target.classList.add('is-visible');
        target.addEventListener('transitionend', () => settle(target), { once: true });
        // A part that is in view at the first paint has no transition to end, so a timer settles it too.
        window.setTimeout(() => settle(target), 700);
      }
    },
    { threshold: 0.15 },
  );
  targets.forEach((target) => observer.observe(target));
}
