// The facts and the words that each page shares.
// An entry with `sample: true` is not a confirmed fact of the cafe. No page prints the field.

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialAccount {
  name: string;
  href: string;
}

export const site = {
  name: 'Teekaapi',
  description:
    'Teekaapi is a South Indian cafe in Melbourne with specialty coffee and a fusion-food menu.',
  tagline: { text: 'Coffee, fusion, and a little rule-breaking.', sample: true },
};

// Only the pages that exist. A later page adds its link here. The logo leads to the home page.
export const navLinks: NavLink[] = [
  { label: 'Menu', href: '/menu/' },
  { label: 'Our Story', href: '/story/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Visit Us', href: '/visit/' },
  { label: 'Order / Book', href: '/order/' },
];

// True when a link leads to the page at this path.
export const isCurrent = (href: string, pathname: string): boolean =>
  href.replace(/\/$/, '') === pathname.replace(/\/$/, '');

// The accounts that the cafe names. The footer shows no icon row while this list is empty.
export const socialAccounts: SocialAccount[] = [];
