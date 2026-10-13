// The words and the pictures of the home page.
// An entry with `sample: true` is not a confirmed fact of the cafe. No page prints the field.
import type { ImageMetadata } from 'astro';
import heroEspresso from '../assets/images/hero-espresso.jpg';

export const hero = {
  flourish: 'Melbourne brewed',
  headline: 'South Indian soul. Melbourne coffee.',
  line: 'Specialty coffee and fusion food, served with colour, craft and a little nostalgia.',
  cta: { label: 'View Menu', href: '/#drinks' },
  image: heroEspresso,
  alt: 'Espresso runs from the machine into a cup.',
  sample: true,
};

export type HighlightIcon = 'coffee' | 'bowl' | 'flame' | 'pin';

export interface Highlight {
  icon: HighlightIcon;
  title: string;
  text: string;
}

// Only what the site brief states of the cafe. A card for late hours or for an
// address waits until the cafe confirms it.
export const highlights: Highlight[] = [
  { icon: 'coffee', title: 'Specialty Coffee', text: 'Carefully sourced, carefully pulled, never rushed.' },
  { icon: 'bowl', title: 'Fusion Bites', text: 'Familiar plates with an unexpected twist.' },
  { icon: 'flame', title: 'South Indian Roots', text: 'The flavours we grew up with, at the heart of the menu.' },
  { icon: 'pin', title: 'Melbourne Made', text: 'A hangout for the city that takes its coffee seriously.' },
];

export type { ImageMetadata };
