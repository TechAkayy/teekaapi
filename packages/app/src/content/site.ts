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

// Only the parts that exist. A later page adds its link here.
export const navLinks: NavLink[] = [
  { label: 'Drinks', href: '/#drinks' },
  { label: 'Food', href: '/#food' },
  { label: 'Moments', href: '/#moments' },
];

// The accounts that the cafe names. The footer shows no icon row while this list is empty.
export const socialAccounts: SocialAccount[] = [];
